var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { PageIdentifier } from './../../base/PageIdentifier';
import { BaseComponent } from '../../base/BaseComponent';
import { Component, Injector, ViewChild } from '@angular/core';
export var ContractInvoiceDetailGridComponent = (function (_super) {
    __extends(ContractInvoiceDetailGridComponent, _super);
    function ContractInvoiceDetailGridComponent(injector) {
        _super.call(this, injector);
        this.queryParams = {
            operation: 'Application/iCABSAContractInvoiceDetailGrid',
            module: 'invoicing',
            method: 'bill-to-cash/grid'
        };
        this.pageId = '';
        this.itemsPerPage = 14;
        this.currentPage = 1;
        this.totalItems = 10;
        this.maxColumn = 15;
        this.lBudgetBilling = false;
        this.cExchangeParentMode = '';
        this.tdContractNumberLabel = 'Contract Number';
        this.trShowAll = true;
        this.trAccount = false;
        this.trInvoiceGroup = false;
        this.trContract = false;
        this.trPremise = false;
        this.trProduct = false;
        this.checkShowAll = 'False';
        this.totalRecords = 1;
        this.rowId = '';
        this.search = this.getURLSearchParamObject();
        this.controls = [
            { name: 'AccountNumber', readonly: true, disabled: true, required: true },
            { name: 'AccountName', readonly: true, disabled: true, required: true },
            { name: 'InvoiceGroupNumber', readonly: true, disabled: true, required: true },
            { name: 'InvoiceGroupDesc', readonly: true, disabled: true, required: false },
            { name: 'ContractNumber', readonly: true, disabled: true, required: true },
            { name: 'ContractName', readonly: true, disabled: true, required: true },
            { name: 'PremiseNumber', readonly: true, disabled: true, required: true },
            { name: 'PremiseName', readonly: true, disabled: true, required: false },
            { name: 'ProductCode', readonly: true, disabled: true, required: true },
            { name: 'ProductDesc', readonly: true, disabled: true, required: false },
            { name: 'CompanyCode', readonly: true, disabled: true, required: true },
            { name: 'CompanyDesc', readonly: true, disabled: true, required: false },
            { name: 'InvoiceNumber', readonly: true, disabled: true, required: true },
            { name: 'InvoiceName', readonly: true, disabled: true, required: false },
            { name: 'SelectedInvoice', readonly: false, disabled: false, required: false },
            { name: 'ShowAll', readonly: false, disabled: false, required: false }
        ];
        this.pageCurrent = 1;
        this.pageId = PageIdentifier.ICABSACONTRACTINVOICEDETAILGRID;
    }
    ContractInvoiceDetailGridComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.windowOnload();
        this.pageTitle = 'Invoice Details';
    };
    ContractInvoiceDetailGridComponent.prototype.onCheckboxChange = function (event) {
        if (event.target.checked) {
            this.checkShowAll = 'True';
            this.riGrid.ResetGrid();
            this.BuildGrid();
        }
        else {
            this.checkShowAll = 'False';
            this.riGrid.ResetGrid();
            this.BuildGrid();
        }
    };
    ContractInvoiceDetailGridComponent.prototype.windowOnload = function () {
        this.riGrid.HighlightBar = true;
        this.riGrid.FunctionPaging = true;
        this.riGrid.FunctionUpdateSupport = true;
        this.riGrid.PageSize = 10;
        this.cExchangeParentMode = this.parentMode;
        if (this.cExchangeParentMode === 'BudgetBilling') {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'AccountNumber', this.riExchange.getParentHTMLValue('AccountNumber'));
            this.riExchange.riInputElement.SetValue(this.uiForm, 'AccountName', this.riExchange.getParentHTMLValue('AccountName'));
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumber', this.riExchange.getParentHTMLValue('ContractNumber'));
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractName', this.riExchange.getParentHTMLValue('ContractName'));
            this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseNumber', this.riExchange.getParentHTMLValue('PremiseNumber'));
            this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', this.riExchange.getParentHTMLValue('PremiseName'));
            this.riExchange.riInputElement.SetValue(this.uiForm, 'InvoiceNumber', this.riExchange.getParentHTMLValue('SelectedCompanyInvoiceNumber'));
            this.riExchange.riInputElement.SetValue(this.uiForm, 'InvoiceName', this.riExchange.getParentHTMLValue('SelectedCompanyInvoiceName'));
            this.riExchange.riInputElement.SetValue(this.uiForm, 'CompanyCode', this.riExchange.getParentHTMLValue('SelectedCompanyCode'));
            this.riExchange.riInputElement.SetValue(this.uiForm, 'CompanyDesc', this.riExchange.getParentHTMLValue('SelectedCompanyDesc'));
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumber', this.riExchange.getParentHTMLValue('SelectedContractNumber'));
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractName', this.riExchange.getParentHTMLValue('SelectedContractName'));
            this.attributes.SystemInvoiceNumber = this.riExchange.getParentHTMLValue('SystemInvoiceNumber');
            this.lBudgetBilling = true;
            this.cExchangeParentMode = 'Contract';
            this.pageTitle = 'Budget Billing - Invoice Detail - Payment Grid';
            this.tdContractNumberLabel = 'Job Number';
        }
        if (this.cExchangeParentMode === 'TicketMaintenance') {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'AccountNumber', this.riExchange.getParentHTMLValue('AccountNumber'));
            this.riExchange.riInputElement.SetValue(this.uiForm, 'AccountName', this.riExchange.getParentHTMLValue('AccountName'));
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumber', this.riExchange.getParentHTMLValue('ContractNumber'));
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractName', this.riExchange.getParentHTMLValue('ContractName'));
            this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseNumber', this.riExchange.getParentHTMLValue('PremiseNumber'));
            this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', this.riExchange.getParentHTMLValue('PremiseName'));
            this.riExchange.riInputElement.SetValue(this.uiForm, 'InvoiceNumber', this.riExchange.getParentHTMLValue('SelectedCompanyInvoiceNumber'));
            this.riExchange.riInputElement.SetValue(this.uiForm, 'InvoiceName', this.riExchange.getParentHTMLValue('SelectedCompanyInvoiceName'));
            this.riExchange.riInputElement.SetValue(this.uiForm, 'CompanyCode', this.riExchange.getParentHTMLValue('SelectedCompanyCode'));
            this.riExchange.riInputElement.SetValue(this.uiForm, 'CompanyDesc', this.riExchange.getParentHTMLValue('SelectedCompanyDesc'));
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumber', this.riExchange.getParentHTMLValue('SelectedContractNumber'));
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractName', this.riExchange.getParentHTMLValue('SelectedContractName'));
            this.attributes.SystemInvoiceNumber = this.riExchange.getParentHTMLValue('SystemInvoiceNumber');
            this.cExchangeParentMode = 'Account';
            if ((this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber')) !== '' && (this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber')) !== null) {
                this.cExchangeParentMode = 'Contract';
            }
            if ((this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber')) !== '' && (this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber')) !== '0' && (this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber')) !== null) {
                this.cExchangeParentMode = 'Premise';
            }
        }
        switch (this.cExchangeParentMode) {
            case 'InvoiceGroup':
                this.trShowAll = false;
                this.trAccount = true;
                this.trInvoiceGroup = true;
                if (this.parentMode !== 'TicketMaintenance') {
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'AccountNumber', this.riExchange.getParentAttributeValue('AccountNumber'));
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'AccountName', this.riExchange.getParentAttributeValue('AccountName'));
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'InvoiceGroupNumber', this.riExchange.getParentAttributeValue('InvoiceGroupNumber'));
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'InvoiceGroupDesc', this.riExchange.getParentAttributeValue('InvoiceGroupDesc'));
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'InvoiceName', this.riExchange.getParentAttributeValue('InvoiceName'));
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'CompanyCode', this.riExchange.getParentAttributeValue('CompanyCode'));
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'CompanyDesc', this.riExchange.getParentAttributeValue('CompanyDesc'));
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'InvoiceNumber', this.riExchange.getParentAttributeValue('InvoiceNumber'));
                    if (this.riExchange.getParentAttributeValue('SystemInvoiceNumber')) {
                        this.attributes.SystemInvoiceNumber = this.riExchange.getParentAttributeValue('SystemInvoiceNumber');
                    }
                    else {
                        this.attributes.SystemInvoiceNumber = this.riExchange.getParentHTMLValue('SystemInvoiceNumber');
                    }
                }
                this.strGridData = {
                    Mode: 'Detail',
                    Level: 'InvoiceGroup',
                    BusinessCode: this.riExchange.ClientSideValues.Fetch('BusinessCode'),
                    AccountNumber: this.riExchange.riInputElement.GetValue(this.uiForm, 'AccountNumber'),
                    InvoiceGroupNumber: this.riExchange.riInputElement.GetValue(this.uiForm, 'InvoiceGroupNumber'),
                    InvoiceNumber: this.attributes.SystemInvoiceNumber,
                    ShowAll: this.checkShowAll
                };
                break;
            case 'Account':
                this.trContract = true;
                this.riExchange.riInputElement.SetValue(this.uiForm, 'SelectedInvoice', this.riExchange.getParentHTMLValue('InvoiceNumber'));
                if (this.parentMode !== 'TicketMaintenance') {
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'InvoiceName', this.riExchange.getParentAttributeValue('InvoiceName'));
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'CompanyCode', this.riExchange.getParentAttributeValue('CompanyCode'));
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'CompanyDesc', this.riExchange.getParentAttributeValue('CompanyDesc'));
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'InvoiceNumber', this.riExchange.getParentAttributeValue('InvoiceNumber'));
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumber', this.riExchange.getParentAttributeValue('ContractNumber'));
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractName', this.riExchange.getParentAttributeValue('ContractName'));
                    if (this.riExchange.getParentAttributeValue('SystemInvoiceNumber')) {
                        this.attributes.SystemInvoiceNumber = this.riExchange.getParentAttributeValue('SystemInvoiceNumber');
                    }
                    else {
                        this.attributes.SystemInvoiceNumber = this.riExchange.getParentHTMLValue('SystemInvoiceNumber');
                    }
                }
                this.strGridData = {
                    Mode: 'Detail',
                    Level: 'Contract',
                    BusinessCode: this.riExchange.ClientSideValues.Fetch('BusinessCode'),
                    ContractNumber: this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'),
                    InvoiceNumber: this.attributes.SystemInvoiceNumber,
                    ShowAll: this.checkShowAll
                };
                break;
            case 'Contract':
                this.trContract = true;
                if (this.parentMode !== 'TicketMaintenance') {
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumber', this.riExchange.getParentHTMLValue('ContractNumber'));
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractName', this.riExchange.getParentHTMLValue('ContractName'));
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'SelectedInvoice', this.riExchange.getParentHTMLValue('InvoiceNumber'));
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'InvoiceName', this.riExchange.getParentAttributeValue('InvoiceName'));
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'CompanyCode', this.riExchange.getParentAttributeValue('CompanyCode'));
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'CompanyDesc', this.riExchange.getParentAttributeValue('CompanyDesc'));
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'InvoiceNumber', this.riExchange.getParentAttributeValue('InvoiceNumber'));
                    if (this.riExchange.getParentAttributeValue('SystemInvoiceNumber')) {
                        this.attributes.SystemInvoiceNumber = this.riExchange.getParentAttributeValue('SystemInvoiceNumber');
                    }
                    else {
                        this.attributes.SystemInvoiceNumber = this.riExchange.getParentHTMLValue('SystemInvoiceNumber');
                    }
                }
                this.strGridData = {
                    Mode: 'Detail',
                    Level: 'Contract',
                    BusinessCode: this.riExchange.ClientSideValues.Fetch('BusinessCode'),
                    ContractNumber: this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'),
                    InvoiceNumber: this.attributes.SystemInvoiceNumber,
                    ShowAll: this.checkShowAll
                };
                break;
            case 'Premise':
                this.trContract = true;
                this.trPremise = true;
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumber', this.riExchange.getParentHTMLValue('ContractNumber'));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractName', this.riExchange.getParentHTMLValue('ContractName'));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseNumber', this.riExchange.getParentHTMLValue('PremiseNumber'));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', this.riExchange.getParentHTMLValue('PremiseName'));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'SelectedInvoice', this.riExchange.getParentHTMLValue('InvoiceNumber'));
                if (this.parentMode !== 'TicketMaintenance') {
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'InvoiceName', this.riExchange.getParentAttributeValue('InvoiceName'));
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'CompanyCode', this.riExchange.getParentAttributeValue('CompanyCode'));
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'CompanyDesc', this.riExchange.getParentAttributeValue('CompanyDesc'));
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'InvoiceNumber', this.riExchange.getParentAttributeValue('InvoiceNumber'));
                    if (this.riExchange.getParentAttributeValue('SystemInvoiceNumber')) {
                        this.attributes.SystemInvoiceNumber = this.riExchange.getParentAttributeValue('SystemInvoiceNumber');
                    }
                    else {
                        this.attributes.SystemInvoiceNumber = this.riExchange.getParentHTMLValue('SystemInvoiceNumber');
                    }
                }
                this.strGridData = {
                    Mode: 'Detail',
                    Level: 'Premise',
                    BusinessCode: this.riExchange.ClientSideValues.Fetch('BusinessCode'),
                    ContractNumber: this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'),
                    PremiseNumber: this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber'),
                    InvoiceNumber: this.attributes.SystemInvoiceNumber,
                    ShowAll: this.checkShowAll
                };
                break;
            case 'Product':
                this.trContract = true;
                this.trPremise = true;
                this.trProduct = true;
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumber', this.riExchange.getParentHTMLValue('ContractNumber'));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractName', this.riExchange.getParentHTMLValue('ContractName'));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseNumber', this.riExchange.getParentHTMLValue('PremiseNumber'));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', this.riExchange.getParentHTMLValue('PremiseName'));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductCode', this.riExchange.getParentHTMLValue('ProductCode'));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', this.riExchange.getParentHTMLValue('ProductDesc'));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'SelectedInvoice', this.riExchange.getParentHTMLValue('InvoiceNumber'));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'InvoiceName', this.riExchange.getParentAttributeValue('InvoiceName'));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'CompanyCode', this.riExchange.getParentAttributeValue('CompanyCode'));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'CompanyDesc', this.riExchange.getParentAttributeValue('CompanyDesc'));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'InvoiceNumber', this.riExchange.getParentAttributeValue('InvoiceNumber'));
                if (this.riExchange.getParentAttributeValue('SystemInvoiceNumber')) {
                    this.attributes.SystemInvoiceNumber = this.riExchange.getParentAttributeValue('SystemInvoiceNumber');
                }
                else {
                    this.attributes.SystemInvoiceNumber = this.riExchange.getParentHTMLValue('SystemInvoiceNumber');
                }
                this.strGridData = {
                    Mode: 'Detail',
                    Level: 'Product',
                    BusinessCode: this.riExchange.ClientSideValues.Fetch('BusinessCode'),
                    ContractNumber: this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'),
                    PremiseNumber: this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber'),
                    ProductCode: this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode'),
                    InvoiceNumber: this.attributes.SystemInvoiceNumber,
                    ShowAll: this.checkShowAll
                };
                break;
        }
        if (this.lBudgetBilling) {
            this.strGridData['BudgetBilling'] = 'Y';
            this.maxColumn = this.maxColumn + 1;
        }
        this.riGrid.ResetGrid();
        this.BuildGrid();
    };
    ContractInvoiceDetailGridComponent.prototype.riGrid_Sort = function (event) {
        this.loadData();
    };
    ContractInvoiceDetailGridComponent.prototype.onCellClick = function (data) {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'SelectedInvoice', this.riExchange.riInputElement.GetValue(this.uiForm, 'InvoiceNumber'));
        this.attributes.InvoiceItem = this.riGrid.Details.GetAttribute('InvoiceItemNumber', 'additionalproperty');
        this.attributes.AdditionalProperty = this.riGrid.Details.GetAttribute('InvoiceItemNumber', 'additionalproperty');
        this.pageParams.AdditionalDta = this.attributes.AdditionalProperty;
        if (this.riGrid.CurrentColumnName !== 'ValueExclTax') {
            this.attributes.SelectedInvoiceRow = this.riGrid.CurrentRow;
            this.attributes.SelectedInvoiceRowID = this.riGrid.Details.GetAttribute('ContractNumber', 'rowid');
            this.attributes.SelectedInvoiceCell = this.riGrid.CurrentCell;
        }
        else {
            this.attributes.SelectedInvoiceRow = this.riGrid.CurrentRow;
            this.attributes.SelectedInvoiceCell = this.riGrid.CurrentCell;
        }
        this.attributes.SelectedInvoiceField = this.riGrid.CurrentColumnName;
        this.attributes.SelectedInvoiceLevel = 'Detail';
    };
    ContractInvoiceDetailGridComponent.prototype.Detail = function (data, event) {
        switch (data) {
            case 'InvoicePaid':
                this.riGrid.Update = true;
                this.riGrid.UpdateBody = true;
                this.riGrid.UpdateFooter = true;
                this.riGrid.UpdateHeader = true;
                break;
            case 'ValueExclTax':
                alert('Application/iCABSAContractInvoiceTurnoverGrid screen is out of scope in this print');
                break;
            case 'ContractNumber':
                if (this.lBudgetBilling === true) {
                    this.navigate('InvoiceDetail', this.ContractManagementModuleRoutes.ICABSAJOBMAINTENANCE);
                }
                else {
                    if (this.riGrid.Details.GetAttribute('ContractNumber', 'additionalproperty') === 'job') {
                        this.navigate('InvoiceDetail', this.ContractManagementModuleRoutes.ICABSAJOBMAINTENANCE, {
                            'parentMode': 'InvoiceDetail',
                            'CurrentContractTypeURLParameter': '<' + this.riGrid.Details.GetAttribute('ContractNumber', 'additionalproperty') + '>',
                            'ContractNumber': this.riGrid.Details.GetValue('ContractNumber')
                        });
                    }
                    if (this.riGrid.Details.GetAttribute('ContractNumber', 'additionalproperty') === 'contract') {
                        this.navigate('InvoiceDetail', this.ContractManagementModuleRoutes.ICABSACONTRACTMAINTENANCE, {
                            'parentMode': 'InvoiceDetail',
                            'CurrentContractTypeURLParameter': '<' + this.riGrid.Details.GetAttribute('ContractNumber', 'additionalproperty') + '>',
                            'ContractNumber': this.riGrid.Details.GetValue('ContractNumber')
                        });
                    }
                    if (this.riGrid.Details.GetAttribute('ContractNumber', 'additionalproperty') === 'product') {
                        this.navigate('InvoiceDetail', this.ContractManagementModuleRoutes.ICABSAPRODUCTSALEMAINTENANCE, {
                            'parentMode': 'InvoiceDetail',
                            'CurrentContractTypeURLParameter': '<' + this.riGrid.Details.GetAttribute('ContractNumber', 'additionalproperty') + '>',
                            'ContractNumber': this.riGrid.Details.GetValue('ContractNumber')
                        });
                    }
                }
                break;
        }
    };
    ContractInvoiceDetailGridComponent.prototype.onCellKeyDown = function (data) {
        if (this.riGrid.CurrentCell === 13) {
            this.Detail(this.riGrid.CurrentColumnName, data);
        }
    };
    ContractInvoiceDetailGridComponent.prototype.onCellClickBlur = function (data) {
        this.loadData();
    };
    ContractInvoiceDetailGridComponent.prototype.BuildGrid = function () {
        this.riGrid.Clear();
        this.riGrid.AddColumn('unknown', 'InvoiceDetail', 'unknown', MntConst.eTypeInteger, 5);
        this.riGrid.AddColumn('InvoiceItemNumber', 'InvoiceDetail', 'InvoiceItemNumber', MntConst.eTypeText, 5);
        this.riGrid.AddColumnAlign('InvoiceItemNumber', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('ContractNumber', 'InvoiceDetail', 'ContractNumber', MntConst.eTypeCode, 8, true);
        this.riGrid.AddColumnAlign('ContractNumber', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('PremiseNumber', 'InvoiceDetail', 'PremiseNumber', MntConst.eTypeText, 5);
        this.riGrid.AddColumnAlign('PremiseNumber', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('ClientReference', 'Premise', 'ClientReference', MntConst.eTypeText, 5);
        this.riGrid.AddColumnAlign('ClientReference', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnScreen('ClientReference', false);
        this.riGrid.AddColumn('PremiseAddressLine1', 'InvoiceDetail', 'PremiseAddressLine1', MntConst.eTypeText, 50);
        this.riGrid.AddColumnAlign('PremiseAddressLine1', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnScreen('PremiseAddressLine1', false);
        this.riGrid.AddColumn('ProductCode', 'InvoiceDetail', 'ProductCode', MntConst.eTypeCode, 6);
        this.riGrid.AddColumnAlign('ProductCode', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('PeriodStart', 'InvoiceDetail', 'PeriodStart', MntConst.eTypeDate, 10);
        this.riGrid.AddColumnAlign('PeriodStart', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('PeriodEnd', 'InvoiceDetail', 'PeriodEnd', MntConst.eTypeDate, 10);
        this.riGrid.AddColumnAlign('PeriodEnd', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('ValueExclTax', 'InvoiceDetail', 'ValueExclTax', MntConst.eTypeText, 10);
        this.riGrid.AddColumnAlign('ValueExclTax', MntConst.eAlignmentRight);
        this.riGrid.AddColumn('TaxValue', 'InvoiceDetail', 'TaxValue', MntConst.eTypeText, 6);
        this.riGrid.AddColumnAlign('TaxValue', MntConst.eAlignmentRight);
        this.riGrid.AddColumn('TaxCode', 'InvoiceDetail', 'TaxCode', MntConst.eTypeText, 5);
        this.riGrid.AddColumnAlign('TaxCode', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('TaxRate', 'InvoiceDetail', 'TaxRate', MntConst.eTypeDecimal1, 2);
        this.riGrid.AddColumnAlign('TaxRate', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('InvoiceCreditReasonCode', 'InvoiceHeader', 'InvoiceCreditReasonCode', MntConst.eTypeText, 20);
        this.riGrid.AddColumnAlign('InvoiceCreditReasonCode', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('ServiceQuantity', 'InvoiceDetail', 'ServiceQuantity', MntConst.eTypeInteger, 4);
        this.riGrid.AddColumnAlign('ServiceQuantity', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('ServiceBranch', 'InvoiceDetail', 'ServiceBranch', MntConst.eTypeInteger, 2);
        this.riGrid.AddColumnAlign('ServiceBranch', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('VisitFrequency', 'InvoiceDetail', 'VisitFrequency', MntConst.eTypeInteger, 3);
        this.riGrid.AddColumnAlign('VisitFrequency', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('VisitDates', 'InvoiceDetail', 'VisitDates', MntConst.eTypeText, 20);
        this.riGrid.AddColumnAlign('VisitDates', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnScreen('VisitDates', false);
        if (this.lBudgetBilling) {
            this.riGrid.AddColumn('InvoicePaid', 'InvoiceDetail', 'InvoicePaid', MntConst.eTypeImage, 1, true);
            this.riGrid.AddColumnAlign('InvoicePaid', MntConst.eAlignmentCenter);
        }
        this.riGrid.AddColumn('InvoiceNumberEx', 'InvoiceDetail', 'InvoiceNumberEx', MntConst.eTypeInteger, 10);
        this.riGrid.AddColumnScreen('InvoiceNumberEx', false);
        this.riGrid.AddColumn('InvoiceNameEx', 'InvoiceDetail', 'InvoiceNameEx', MntConst.eTypeText, 20);
        this.riGrid.AddColumnScreen('InvoiceNameEx', false);
        this.riGrid.AddColumn('InvoiceItemNumberEx', 'InvoiceDetail', 'InvoiceItemNumberEx', MntConst.eTypeText, 5);
        this.riGrid.AddColumnAlign('InvoiceItemNumberEx', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnScreen('InvoiceItemNumberEx', false);
        this.riGrid.AddColumn('InvoiceCreditReasonDescEx', 'InvoiceDetail', 'InvoiceCreditReasonDescEx', MntConst.eTypeText, 20);
        this.riGrid.AddColumnScreen('InvoiceCreditReasonDescEx', false);
        this.riGrid.AddColumn('CompanyCodeEx', 'InvoiceDetail', 'CompanyCodeEx', MntConst.eTypeText, 20);
        this.riGrid.AddColumnScreen('CompanyCodeEx', false);
        this.riGrid.AddColumn('CompanyDescEx', 'InvoiceDetail', 'CompanyDescEx', MntConst.eTypeText, 20);
        this.riGrid.AddColumnScreen('CompanyDescEx', false);
        this.riGrid.AddColumn('PONumberEx', 'InvoiceDetail', 'PONumberEx', MntConst.eTypeText, 20);
        this.riGrid.AddColumnScreen('PONumberEx', false);
        this.riGrid.AddColumn('ProductDescEx', 'InvoiceDetail', 'ProductDescEx', MntConst.eTypeText, 20);
        this.riGrid.AddColumnScreen('ProductDescEx', false);
        this.riGrid.AddColumn('TaxCodeEx', 'InvoiceDetail', 'TaxCodeEx', MntConst.eTypeText, 20);
        this.riGrid.AddColumnScreen('TaxCodeEx', false);
        this.riGrid.AddColumn('TaxRateEx', 'InvoiceDetail', 'TaxRateEx', MntConst.eTypeDecimal1, 2);
        this.riGrid.AddColumnAlign('TaxRateEx', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnScreen('TaxRateEx', false);
        this.riGrid.AddColumn('ServiceQuantityEx', 'InvoiceDetail', 'ServiceQuantityEx', MntConst.eTypeInteger, 4);
        this.riGrid.AddColumnAlign('ServiceQuantityEx', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnScreen('ServiceQuantityEx', false);
        this.riGrid.AddColumn('ContractNEx', 'InvoiceDetail', 'ContractNEx', MntConst.eTypeText, 20);
        this.riGrid.AddColumnScreen('ContractNEx', false);
        this.riGrid.Complete();
        this.loadData();
    };
    ContractInvoiceDetailGridComponent.prototype.loadData = function () {
        var _this = this;
        this.search = this.getURLSearchParamObject();
        this.search.set(this.serviceConstants.Action, '2');
        if (this.strGridData) {
            this.search.set('Mode', this.strGridData.Mode);
            this.search.set('Level', this.strGridData.Level);
            this.search.set('ContractNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'));
            this.search.set('InvoiceNumber', this.attributes.SystemInvoiceNumber);
            this.search.set('ShowAll', this.checkShowAll.toString());
            if (this.lBudgetBilling) {
                this.search.set('BudgetBilling', this.strGridData.BudgetBilling);
            }
        }
        this.search.set(this.serviceConstants.PageSize, this.itemsPerPage.toString());
        this.search.set(this.serviceConstants.PageCurrent, this.pageCurrent.toString());
        this.search.set(this.serviceConstants.GridMode, '0');
        this.search.set(this.serviceConstants.GridHandle, '527546');
        this.search.set('riSortOrder', 'Descending');
        this.search.set('HeaderClickedColumn=', '');
        this.queryParams.search = this.search;
        this.riGrid.Update = false;
        this.riGrid.UpdateBody = false;
        this.riGrid.UpdateFooter = false;
        this.riGrid.UpdateHeader = false;
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.queryParams.search)
            .subscribe(function (data) {
            if (data) {
                try {
                    _this.pageCurrent = data.pageData ? data.pageData.pageNumber : 1;
                    _this.totalRecords = data.pageData ? data.pageData.lastPageNumber * 10 : 1;
                    _this.riGrid.Update = true;
                    _this.riGrid.UpdateBody = true;
                    _this.riGrid.UpdateHeader = true;
                    _this.riGrid.UpdateFooter = true;
                    if (data && data.errorMessage) {
                        _this.messageModal.show(data, true);
                    }
                    else {
                        _this.riGrid.Execute(data);
                    }
                }
                catch (e) {
                    _this.logger.log('Problem in grid load', e);
                }
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.totalRecords = 1;
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    ContractInvoiceDetailGridComponent.prototype.onGridRowClick = function (event) {
        this.Detail(this.riGrid.CurrentColumnName, event);
        if (this.riGrid.CurrentColumnName === 'ValueExclTax') {
            alert('Application/iCABSAContractInvoiceTurnoverGrid screen is out of scope in this print');
        }
    };
    ContractInvoiceDetailGridComponent.prototype.getGridInfo = function (info) {
        this.contractInvoiceDetailPagination.totalItems = info.totalRows;
        this.totalRecords = info.totalRows;
    };
    ContractInvoiceDetailGridComponent.prototype.getCurrentPage = function (currentPage) {
        this.currentPage = currentPage.value;
        this.loadData();
    };
    ContractInvoiceDetailGridComponent.prototype.refresh = function () {
        this.currentPage = 1;
        this.windowOnload();
    };
    ContractInvoiceDetailGridComponent.prototype.ngOnDestroy = function () {
        _super.prototype.ngOnDestroy.call(this);
    };
    ContractInvoiceDetailGridComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSAContractInvoiceDetailGrid.html'
                },] },
    ];
    ContractInvoiceDetailGridComponent.ctorParameters = [
        { type: Injector, },
    ];
    ContractInvoiceDetailGridComponent.propDecorators = {
        'contractInvoiceDetailGrid': [{ type: ViewChild, args: ['contractInvoiceDetailGrid',] },],
        'contractInvoiceDetailPagination': [{ type: ViewChild, args: ['contractInvoiceDetailPagination',] },],
        'riGrid': [{ type: ViewChild, args: ['riGrid',] },],
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
    };
    return ContractInvoiceDetailGridComponent;
}(BaseComponent));
