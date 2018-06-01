import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { GridAdvancedComponent } from './../../../shared/components/grid-advanced/grid-advanced';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { PageIdentifier } from './../../base/PageIdentifier';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';
import { InternalGridSearchSalesModuleRoutes } from './../../base/PageRoutes';
import { GridComponent } from './../../../shared/components/grid/grid';
import { BaseComponent } from '../../base/BaseComponent';
import { Subscription } from 'rxjs/Subscription';
import { Component, OnInit, Injector, ViewChild, OnDestroy } from '@angular/core';
@Component({
  templateUrl: 'iCABSAContractInvoiceDetailGrid.html'
})
export class ContractInvoiceDetailGridComponent extends BaseComponent implements OnInit, OnDestroy {
  @ViewChild('contractInvoiceDetailGrid') contractInvoiceDetailGrid: GridComponent;
  @ViewChild('contractInvoiceDetailPagination') contractInvoiceDetailPagination: PaginationComponent;
  @ViewChild('riGrid') riGrid: GridAdvancedComponent;
  @ViewChild('messageModal') public messageModal;
  public queryParams: any = {
    operation: 'Application/iCABSAContractInvoiceDetailGrid',
    module: 'invoicing',
    method: 'bill-to-cash/grid'
  };

  public pageId: string = '';
  public itemsPerPage: number = 14;
  public currentPage: number = 1;
  public totalItems: number = 10;
  public maxColumn: number = 15;
  public strGridData: any;
  public lBudgetBilling: boolean = false;
  public cExchangeParentMode: any = '';
  public tdContractNumberLabel: any = 'Contract Number';
  public trShowAll: boolean = true;
  public trAccount: boolean = false;
  public trInvoiceGroup: boolean = false;
  public trContract: boolean = false;
  public trPremise: boolean = false;
  public trProduct: boolean = false;
  public checkShowAll: String = 'False';
  public totalRecords: number = 1;
  public rowId = '';
  public search = this.getURLSearchParamObject();
  public controls = [
    { name: 'AccountNumber', readonly: true, disabled: true, required: true, type: MntConst.eTypeCode },
    { name: 'AccountName', readonly: true, disabled: true, required: true, type: MntConst.eTypeText },
    { name: 'InvoiceGroupNumber', readonly: true, disabled: true, required: true, type: MntConst.eTypeInteger },
    { name: 'InvoiceGroupDesc', readonly: true, disabled: true, required: false, type: MntConst.eTypeText },
    { name: 'ContractNumber', readonly: true, disabled: true, required: true, type: MntConst.eTypeCode },
    { name: 'ContractName', readonly: true, disabled: true, required: true, type: MntConst.eTypeText },
    { name: 'PremiseNumber', readonly: true, disabled: true, required: true, type: MntConst.eTypeInteger },
    { name: 'PremiseName', readonly: true, disabled: true, required: false, type: MntConst.eTypeText },
    { name: 'ProductCode', readonly: true, disabled: true, required: true, type: MntConst.eTypeCode },
    { name: 'ProductDesc', readonly: true, disabled: true, required: false, type: MntConst.eTypeText },
    { name: 'CompanyCode', readonly: true, disabled: true, required: true, type: MntConst.eTypeCode },
    { name: 'CompanyDesc', readonly: true, disabled: true, required: false, type: MntConst.eTypeText },
    { name: 'InvoiceNumber', readonly: true, disabled: true, required: true, type: MntConst.eTypeInteger },
    { name: 'InvoiceName', readonly: true, disabled: true, required: false, type: MntConst.eTypeText },
    { name: 'SelectedInvoice', readonly: false, disabled: false, required: false },
    { name: 'ShowAll', readonly: false, disabled: false, required: false }
  ];
  constructor(injector: Injector) {
    super(injector);
    this.pageId = PageIdentifier.ICABSACONTRACTINVOICEDETAILGRID;
    this.browserTitle = 'Invoice Detail';
  }
  ngOnInit(): void {
    super.ngOnInit();
    this.windowOnload();
    this.pageTitle = 'Invoice Details';
  }
  public pageCurrent: number = 1;
  public onCheckboxChange(event: any): void {
    if (event.target.checked) {
      this.checkShowAll = 'True';
      this.riGrid.ResetGrid();
      this.BuildGrid();
    } else {
      this.checkShowAll = 'False';
      this.riGrid.ResetGrid();
      this.BuildGrid();
    }
  }
  public windowOnload(): void {
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

      this.utils.getTranslatedval('Budget Billing - Invoice Detail - Payment Grid').then((res: string) => {
        this.utils.setTitle(res);
      });
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
          } else {
            this.attributes.SystemInvoiceNumber = this.riExchange.getParentHTMLValue('SystemInvoiceNumber');
          }

        }
        this.strGridData = {
          Mode: 'Detail',
          Level: 'InvoiceGroup',
          BusinessCode: this.riExchange.ClientSideValues.Fetch('BusinessCode'),
          AccountNumber: this.riExchange.riInputElement.GetValue(this.uiForm, 'AccountNumber'),
          InvoiceGroupNumber: this.globalize.parseIntegerToFixedFormat(this.riExchange.riInputElement.GetValue(this.uiForm, 'InvoiceGroupNumber')),
          InvoiceNumber: this.globalize.parseIntegerToFixedFormat(this.attributes.SystemInvoiceNumber),
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
          } else {
            this.attributes.SystemInvoiceNumber = this.riExchange.getParentHTMLValue('SystemInvoiceNumber');
          }
        }
        this.strGridData = {
          Mode: 'Detail',
          Level: 'Contract',
          BusinessCode: this.riExchange.ClientSideValues.Fetch('BusinessCode'),
          ContractNumber: this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'),
          InvoiceNumber: this.globalize.parseIntegerToFixedFormat(this.attributes.SystemInvoiceNumber),
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
          } else {
            this.attributes.SystemInvoiceNumber = this.riExchange.getParentHTMLValue('SystemInvoiceNumber');
          }
        }
        this.strGridData = {
          Mode: 'Detail',
          Level: 'Contract',
          BusinessCode: this.riExchange.ClientSideValues.Fetch('BusinessCode'),
          ContractNumber: this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'),
          InvoiceNumber: this.globalize.parseIntegerToFixedFormat(this.attributes.SystemInvoiceNumber),
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
          } else {
            this.attributes.SystemInvoiceNumber = this.riExchange.getParentHTMLValue('SystemInvoiceNumber');
          }
        }
        this.strGridData = {
          Mode: 'Detail',
          Level: 'Premise',
          BusinessCode: this.riExchange.ClientSideValues.Fetch('BusinessCode'),
          ContractNumber: this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'),
          PremiseNumber: this.globalize.parseIntegerToFixedFormat(this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber')),
          InvoiceNumber: this.globalize.parseIntegerToFixedFormat(this.attributes.SystemInvoiceNumber),
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
        } else {
          this.attributes.SystemInvoiceNumber = this.riExchange.getParentHTMLValue('SystemInvoiceNumber');
        }
        this.strGridData = {
          Mode: 'Detail',
          Level: 'Product',
          BusinessCode: this.riExchange.ClientSideValues.Fetch('BusinessCode'),
          ContractNumber: this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'),
          PremiseNumber: this.globalize.parseIntegerToFixedFormat(this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber')),
          ProductCode: this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode'),
          InvoiceNumber: this.globalize.parseIntegerToFixedFormat(this.attributes.SystemInvoiceNumber),
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
  }
  public riGrid_Sort(event: any): void {
    this.loadData();
  }
  public onCellClick(data: Event): void {
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
  }
  public Detail(data: any, event: any): void {
    switch (data) {
      case 'InvoicePaid':
        this.riGrid.UpdateBody = true;
        this.riGrid.UpdateFooter = true;
        this.riGrid.UpdateHeader = true;
        break;
      case 'ValueExclTax':
        this.navigate(this.cExchangeParentMode, InternalGridSearchSalesModuleRoutes.ICABSACONTRACTINVOICETURNOVERGRID, {
          SystemInvoiceNumber: this.attributes.SystemInvoiceNumber
        });
        break;
      case 'ContractNumber':
        if (this.lBudgetBilling === true) {
          this.navigate('InvoiceDetail', this.ContractManagementModuleRoutes.ICABSAJOBMAINTENANCE);
        } else {
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
  }
  public onCellKeyDown(data: any): void {
    if (this.riGrid.CurrentCell === 13) {
      this.Detail(this.riGrid.CurrentColumnName, data);
    }
  }

  public onCellClickBlur(data: any): void {
    this.loadData();
  }

  public BuildGrid(): void {

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

  }


  private loadData(): void {
    this.search = this.getURLSearchParamObject();
    this.search.set(this.serviceConstants.Action, '2');
    //set parameters
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
    // set grid building parameters
    this.search.set(this.serviceConstants.PageSize, this.itemsPerPage.toString());
    this.search.set(this.serviceConstants.PageCurrent, this.pageCurrent.toString());
    this.search.set(this.serviceConstants.GridMode, '0');
    this.search.set(this.serviceConstants.GridHandle, '527546');
    this.search.set('riSortOrder', 'Descending');
    this.search.set('HeaderClickedColumn=', '');
    this.queryParams.search = this.search;
    this.ajaxSource.next(this.ajaxconstant.START);
    this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module,
      this.queryParams.operation, this.queryParams.search)
      .subscribe(
      (data) => {
        if (data) {
          try {
            this.pageCurrent = data.pageData ? data.pageData.pageNumber : 1;
            this.totalRecords = data.pageData ? data.pageData.lastPageNumber * 10 : 1;
            this.riGrid.UpdateBody = true;
            this.riGrid.UpdateHeader = true;
            this.riGrid.UpdateFooter = true;
            if (data && data.errorMessage) {
              this.messageModal.show(data, true);
            } else {
              this.riGrid.Execute(data);
            }

          } catch (e) {
            this.logger.log('Problem in grid load', e);
          }
        }
        this.ajaxSource.next(this.ajaxconstant.COMPLETE);
      },
      error => {
        this.totalRecords = 1;
        this.ajaxSource.next(this.ajaxconstant.COMPLETE);
      });
  }

  public onGridRowClick(event: any): void {
    this.Detail(this.riGrid.CurrentColumnName, event);
    if (this.riGrid.CurrentColumnName === 'ValueExclTax') {
      this.navigate(this.cExchangeParentMode, InternalGridSearchSalesModuleRoutes.ICABSACONTRACTINVOICETURNOVERGRID, {
        SystemInvoiceNumber: this.attributes.SystemInvoiceNumber
      });
    }
  }

  public getGridInfo(info: any): void {
    this.contractInvoiceDetailPagination.totalItems = info.totalRows;
    this.totalRecords = info.totalRows;
  }

  public getCurrentPage(currentPage: any): void {
    this.currentPage = currentPage.value;
    this.loadData();
  }

  public refresh(): void {
    this.currentPage = 1;
    this.windowOnload();
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }
}


