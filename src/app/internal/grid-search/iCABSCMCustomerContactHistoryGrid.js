var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { PageIdentifier } from './../../base/PageIdentifier';
import { URLSearchParams } from '@angular/http';
import { Component, ViewChild, Injector } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
export var CustomerContactHistoryGridComponent = (function (_super) {
    __extends(CustomerContactHistoryGridComponent, _super);
    function CustomerContactHistoryGridComponent(injector) {
        _super.call(this, injector);
        this.pageId = '';
        this.pageTitle = '';
        this.parentMode = '';
        this.inputParams = {};
        this.itemsPerPage = 10;
        this.totalRecords = 10;
        this.currentPage = 1;
        this.branchName = '';
        this.maxColumn = 4;
        this.isShowDetailVisible = true;
        this.customerModel = {
            'AccountName': '',
            'AccountNumber': '',
            'ContractName': '',
            'ContractNumber': '',
            'PremiseName': '',
            'PremiseNumber': '',
            'ProductCode': '',
            'ProductDesc': '',
            'ServiceCoverNumber': '',
            'ServiceCoverRowID': ''
        };
        this.fromDate = new Date();
        this.toDate = new Date();
        this.dateObjectsEnabled = {
            fromDate: true,
            toDate: true
        };
        this.dateObjectsRequired = {
            fromDate: true,
            toDate: true
        };
        this.clearDate = {
            fromDate: false,
            toDate: false
        };
        this.attributeList = {};
        this.contractRenewalStatus = false;
        this.languageCode = 'ENG';
        this.showMessageHeader = false;
        this.showErrorHeader = false;
        this.promptTitle = '';
        this.promptContent = '';
        this.muleConfig = {
            method: 'ccm/maintenance',
            module: 'tickets',
            operation: 'ContactManagement/iCABSCMCustomerContactHistoryGrid',
            contentType: 'application/x-www-form-urlencoded',
            action: '2'
        };
        this.controls = [
            { name: 'AccountNumber', readonly: false, disabled: true, required: false },
            { name: 'AccountName', readonly: false, disabled: true, required: false },
            { name: 'FromDate', readonly: false, disabled: true, required: false },
            { name: 'ToDate', readonly: false, disabled: true, required: false },
            { name: 'HistoryFilter', readonly: false, disabled: false, required: false, value: 'all' },
            { name: 'ContractName', readonly: false, disabled: true, required: false },
            { name: 'ContractNumber', readonly: false, disabled: true, required: false },
            { name: 'ShowDetail', readonly: false, disabled: false, required: false },
            { name: 'PremiseName', readonly: false, disabled: true, required: false },
            { name: 'PremiseNumber', readonly: false, disabled: true, required: false },
            { name: 'ProductCode', readonly: false, disabled: true, required: false },
            { name: 'ProductDesc', readonly: false, disabled: true, required: false },
            { name: 'ServiceCoverNumber', readonly: false, disabled: true, required: false },
            { name: 'ServiceCoverRowID', readonly: false, disabled: true, required: false }
        ];
        this.pageId = PageIdentifier.ICABSCMCUSTOMERCONTACTHISTORYGRID;
        this.pageTitle = 'Customer Contact History';
        this.search = this.getURLSearchParamObject();
    }
    CustomerContactHistoryGridComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.getParentFields();
        if (this.parentMode === 'ServiceCover') {
        }
        else {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceCoverRowID', '');
        }
        this.fromDate.setMonth(this.fromDate.getMonth() + -12);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'FromDate', this.utils.formatDate(this.fromDate));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ToDate', this.utils.formatDate(this.toDate));
        var data = this.riExchange.riInputElement.GetValue(this.uiForm, 'HistoryFilter');
        this.onHistoryFilterValue(data);
        if ((this.parentMode !== 'Premise') && (this.parentMode !== 'ServiceCover')) {
            this.contractRenewalStatus = true;
        }
        this.buildGrid();
    };
    CustomerContactHistoryGridComponent.prototype.getParentFields = function () {
        this.customerModel.AccountName = this.getNodeValue(this.riExchange.getParentHTMLValue('AccountName'));
        this.customerModel.AccountNumber = this.getNodeValue(this.riExchange.getParentHTMLValue('AccountNumber'));
        this.customerModel.ContractName = this.getNodeValue(this.riExchange.getParentHTMLValue('ContractName'));
        this.customerModel.ContractNumber = this.getNodeValue(this.riExchange.getParentHTMLValue('ContractNumber'));
        this.customerModel.PremiseName = this.getNodeValue(this.riExchange.getParentHTMLValue('PremiseName'));
        this.customerModel.PremiseNumber = this.getNodeValue(this.riExchange.getParentHTMLValue('PremiseNumber'));
        this.customerModel.ProductCode = this.getNodeValue(this.riExchange.getParentHTMLValue('ProductCode'));
        this.customerModel.ServiceCoverNumber = this.getNodeValue(this.riExchange.getParentHTMLValue('ServiceCoverNumber'));
        this.customerModel.ProductDesc = this.getNodeValue(this.riExchange.getParentHTMLValue('ProductDesc'));
        this.customerModel.ServiceCoverRowID = this.getNodeValue(this.riExchange.getParentHTMLValue('ServiceCoverRowID'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'AccountName', this.customerModel.AccountName);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'AccountNumber', this.customerModel.AccountNumber);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractName', this.customerModel.ContractName);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumber', this.customerModel.ContractNumber);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', this.customerModel.PremiseName);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseNumber', this.customerModel.PremiseNumber);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductCode', this.customerModel.ProductCode);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', this.customerModel.ProductDesc);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceCoverNumber', this.customerModel.ServiceCoverNumber);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceCoverRowID', this.customerModel.ServiceCoverRowID);
    };
    CustomerContactHistoryGridComponent.prototype.getNodeValue = function (value) {
        return (value) ? value : '';
    };
    CustomerContactHistoryGridComponent.prototype.buildGrid = function () {
        if (!this.uiForm.controls['FromDate'].value || !this.uiForm.controls['ToDate'].value)
            return;
        this.search = new URLSearchParams();
        this.inputParams.module = this.muleConfig.module;
        this.inputParams.method = this.muleConfig.method;
        this.inputParams.operation = this.muleConfig.operation;
        var blnShowDetail = '';
        if ((this.uiForm.controls['ShowDetail'].value === true) && (this.isShowDetailVisible === true)) {
            blnShowDetail = 'yes';
        }
        else {
            blnShowDetail = 'no';
        }
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.search.set('riGridMode', '0');
        this.search.set('riGridHandle', '199032');
        this.search.set('riSortOrder', 'Descending');
        this.search.set('Function', 'CMHistory');
        this.search.set('AccountNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'AccountNumber'));
        this.search.set('ContractNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'));
        this.search.set('PremiseNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber'));
        this.search.set('ProductCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode'));
        this.search.set('ServiceCoverNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceCoverNumber'));
        this.search.set('ServiceCoverRowID', this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceCoverRowID'));
        this.search.set('FromDate', this.riExchange.riInputElement.GetValue(this.uiForm, 'FromDate'));
        this.search.set('ToDate', this.riExchange.riInputElement.GetValue(this.uiForm, 'ToDate'));
        this.search.set('Filter', this.riExchange.riInputElement.GetValue(this.uiForm, 'HistoryFilter'));
        this.search.set('LanguageCode', this.languageCode);
        this.search.set('ShowDetail', blnShowDetail);
        this.search.set(this.serviceConstants.GridPageSize, this.itemsPerPage.toString());
        this.search.set(this.serviceConstants.GridPageCurrent, this.currentPage.toString());
        this.search.set(this.serviceConstants.Action, this.muleConfig.action);
        this.inputParams.search = this.search;
        this.grdCustomerContactGrid.loadGridData(this.inputParams);
    };
    CustomerContactHistoryGridComponent.prototype.getGridInfo = function (info) {
        this.totalRecords = info.totalRows;
    };
    CustomerContactHistoryGridComponent.prototype.getCurrentPage = function (data) {
        this.currentPage = data.value;
        this.buildGrid();
    };
    CustomerContactHistoryGridComponent.prototype.refresh = function () {
        this.currentPage = 1;
        this.buildGrid();
    };
    CustomerContactHistoryGridComponent.prototype.getConvertedDate = function (dateValue) {
        var returnDate = '';
        if (dateValue) {
            returnDate = this.utils.convertDate(dateValue);
            returnDate = dateValue;
        }
        else {
            returnDate = '';
        }
        return returnDate;
    };
    CustomerContactHistoryGridComponent.prototype.onHistoryFilterValue = function (value) {
        switch (value) {
            case 'all':
                this.isShowDetailVisible = true;
                break;
            case 'visits':
                this.isShowDetailVisible = false;
                break;
            case 'invoices':
                this.isShowDetailVisible = false;
                break;
            case 'contacts':
                this.isShowDetailVisible = true;
                break;
            case 'renewal':
                this.isShowDetailVisible = false;
                break;
            default:
                break;
        }
        this.refresh();
    };
    CustomerContactHistoryGridComponent.prototype.onShowDetail = function () {
        this.refresh();
    };
    CustomerContactHistoryGridComponent.prototype.selectedDataOnDoubleClick = function (event) {
        this.selectedDataOnCellFocus(event);
        this.detail(event);
    };
    CustomerContactHistoryGridComponent.prototype.selectedDataOnCellFocus = function (event) {
        this.attributeList = {};
        if (event.cellIndex === '0') {
            this.attributeList['AccountNumberRow'] = event.rowIndex;
            this.attributeList['AccountNumberCell'] = event.cellIndex;
            this.attributeList['AccountNumberRowID'] = event.cellData.rowID;
            this.attributeList['AccountNumberTableName'] = event.cellData.additionalData;
        }
        else if (event.cellIndex === '3') {
            this.attributeList['AccountNumberRowID'] = event.cellData.rowID;
            this.attributeList['AccountNumberTableName'] = event.cellData.additionalData;
            this.attributeList['ContractNumberViewRowID'] = event.cellData.rowID;
        }
        if (event.trRowData && event.trRowData.length >= 2) {
            this.attributeList['HistoryTextAdditionalProperty'] = event.trRowData[2].additionalData;
        }
    };
    CustomerContactHistoryGridComponent.prototype.getAttribute = function (attrName) {
        var defaultValue = '';
        if (this.attributeList && this.attributeList.hasOwnProperty(attrName)) {
            defaultValue = this.attributeList[attrName];
        }
        return defaultValue;
    };
    CustomerContactHistoryGridComponent.prototype.detail = function (event) {
        switch (event.cellIndex) {
            case 3:
                if (event.cellData.text === 'SP') {
                    switch (event.cellData.additionalData.toUpperCase()) {
                        case 'SERVICEVISIT':
                            this.visitPrint();
                            break;
                        case 'INVOICEHEADER':
                            this.invoicePrint();
                            break;
                        case 'CONTRACTRENEWAL':
                            this.contractRenewalPrint();
                            break;
                        default:
                            this.messageService.emitMessage(event.cellData.additionalData.toUpperCase());
                    }
                }
                break;
            default:
                switch (event.cellData.additionalData.toUpperCase()) {
                    case 'INVOICEHEADER':
                        this.invoicePrint();
                        break;
                    case 'CONTACTACTION':
                        this.ContactAction();
                        break;
                    case 'CUSTOMERCONTACT':
                        this.CustomerContact();
                        break;
                    case 'PLANVISIT':
                        this.PlanVisit();
                        break;
                    case 'SERVICEVISIT':
                        this.ServiceVisit();
                        break;
                    case 'CONTRACTRENEWAL':
                        this.contractRenewalPrint();
                        break;
                    default:
                        this.messageService.emitMessage(event.cellData.additionalData.toUpperCase());
                }
        }
    };
    CustomerContactHistoryGridComponent.prototype.CustomerContact = function () {
        alert('ContactManagement iCABSCMCustomerContactDetailGrid.htm');
    };
    CustomerContactHistoryGridComponent.prototype.ContactAction = function () {
        alert('ContactManagement/iCABSCMContactActionMaintenance.htm');
    };
    CustomerContactHistoryGridComponent.prototype.PlanVisit = function () {
        this.router.navigate(['maintenance/planvisit'], { queryParams: { parentMode: 'ContactHistory' } });
    };
    CustomerContactHistoryGridComponent.prototype.ServiceVisit = function () {
        alert('Service/iCABSSeServiceVisitMaintenance.htm');
    };
    CustomerContactHistoryGridComponent.prototype.visitPrint = function () {
        var _this = this;
        var strURL = '';
        var paramObj = {
            'Function': 'Single',
            'PremiseVisitRowID': this.getAttribute('ContractNumberViewRowID')
        };
        this.fetchPrintData(paramObj).subscribe(function (e) {
            if (e.status === 'failure') {
                _this.errorService.emitError(e.oResponse);
            }
            else {
                if (e.url) {
                    strURL = e.url;
                    window.open(strURL, '_blank');
                }
            }
        }, function (error) {
            _this.errorService.emitError(error);
        });
    };
    CustomerContactHistoryGridComponent.prototype.invoicePrint = function () {
        var _this = this;
        var strURL = '';
        var paramObj = {
            'Function': 'Single',
            'InvoiceNumber': this.getAttribute('AccountNumberRowID')
        };
        this.fetchPrintData(paramObj).subscribe(function (e) {
            if (e.status === 'failure') {
                _this.errorService.emitError(e.oResponse);
            }
            else {
                if (e.url) {
                    strURL = e.url;
                    window.open(strURL, '_blank');
                }
            }
        }, function (error) {
            _this.errorService.emitError(error);
        });
    };
    CustomerContactHistoryGridComponent.prototype.contractRenewalPrint = function () {
        var _this = this;
        var strURL = '';
        var paramObj = {
            'ReportNumber': this.getAttribute('HistoryTextAdditionalProperty')
        };
        this.fetchPrintData(paramObj).subscribe(function (e) {
            if (e.status === 'failure') {
                _this.errorService.emitError(e.oResponse);
            }
            else {
                if (e.url) {
                    strURL = e.url;
                    window.open(strURL, '_blank');
                }
            }
        }, function (error) {
            _this.errorService.emitError(error);
        });
    };
    CustomerContactHistoryGridComponent.prototype.fetchPrintData = function (params) {
        this.search = new URLSearchParams();
        this.inputParams.module = this.muleConfig.module;
        this.inputParams.method = this.muleConfig.method;
        this.inputParams.operation = this.muleConfig.operation;
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.search.set(this.serviceConstants.Action, '0');
        for (var key in params) {
            if (key) {
                this.search.set(key, params[key]);
            }
        }
        return this.httpService.makeGetRequest(this.muleConfig.method, this.muleConfig.module, this.muleConfig.operation, this.search);
    };
    CustomerContactHistoryGridComponent.prototype.onBackLinkClick = function (event) {
        event.preventDefault();
        this.location.back();
    };
    CustomerContactHistoryGridComponent.prototype.fromDateSelectedValue = function (value) {
        if (value && value['value']) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'FromDate', value['value']);
            this.refresh();
        }
        else {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'FromDate', '');
        }
    };
    CustomerContactHistoryGridComponent.prototype.toDateSelectedValue = function (value) {
        if (value && value['value']) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ToDate', value['value']);
            this.refresh();
        }
        else {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ToDate', '');
        }
    };
    CustomerContactHistoryGridComponent.prototype.promptSave = function (event) {
    };
    CustomerContactHistoryGridComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSCMCustomerContactHistoryGrid.html'
                },] },
    ];
    CustomerContactHistoryGridComponent.ctorParameters = [
        { type: Injector, },
    ];
    CustomerContactHistoryGridComponent.propDecorators = {
        'grdCustomerContactGrid': [{ type: ViewChild, args: ['grdCustomerContactGrid',] },],
        'grdCustomerContactPagination': [{ type: ViewChild, args: ['grdCustomerContactPagination',] },],
        'historyFilterDropDown': [{ type: ViewChild, args: ['historyFilterDropDown',] },],
        'errorModal': [{ type: ViewChild, args: ['errorModal',] },],
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
    };
    return CustomerContactHistoryGridComponent;
}(BaseComponent));
