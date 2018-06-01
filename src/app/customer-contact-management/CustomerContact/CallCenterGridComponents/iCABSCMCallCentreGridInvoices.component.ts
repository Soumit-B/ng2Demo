import { Component, NgZone, OnInit, OnDestroy, ViewChild, AfterViewInit, Renderer } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { URLSearchParams } from '@angular/http';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { HttpService } from '../../../../shared/services/http-service';
import { CallCenterActionTypes } from '../../../actions/call-centre-search';
import { ServiceConstants } from '../../../../shared/constants/service.constants';
import { GlobalConstant } from '../../../../shared/constants/global.constant';
import { MessageConstant } from '../../../../shared/constants/message.constant';
import { GridComponent } from '../../../../shared/components/grid/grid';
import { Utils } from '../../../../shared/services/utility';
import { RiExchange } from '../../../../shared/services/riExchange';
import { MntConst } from '../../../../shared/services/riMaintenancehelper';
import { ContractManagementModuleRoutes } from '../../../base/PageRoutes';

@Component({
  selector: 'icabs-call-center-grid-invoices',
  templateUrl: 'iCABSCMCallCentreGridInvoices.html'
})

export class CallCenterGridInvoicesComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('invoicesGrid') invoicesGrid: GridComponent;
  public formGroup: FormGroup;
  public fieldVisibility: any = {
    InvSelectedContractPremise: true,
    CmdInvClearSelected: true,
    InvoiceSearchOn: true,
    InvoiceSearchValue: true,
    InvoiceViewType: false,
    DefaultEmailFrom: false,
    InvoiceEmailAddress: false,
    InvoiceContractTypeCode: false,
    FurtherRecords: false
  };
  public dropdownList: any = {
    InvoiceContractTypeCode: [
    {
      value: '', desc: ''
    }
    ]
  };
  public search: URLSearchParams = new URLSearchParams();
  public queryGrid: any = {
      operation: 'ContactManagement/iCABSCMCallCentreGrid',
      module: 'call-centre',
      method: 'ccm/maintenance',
      contentType: 'application/x-www-form-urlencoded'
  };
  public itemsPerPage: number = 10;
  public pageSize: number = 10;
  public currentPage: number = 1;
  public paginationCurrentPage: number = 1;
  public totalRecords: number;
  public inputParams: any = {};
  public maxColumns: number = 12;
  public gridSortHeaders: Array<any> = [];
  public headerProperties: Array<any> = [];
  public validateProperties: Array<any> = [];
  private headerClicked: string;
  private sortType: string;
  private storeSubscription: Subscription;
  private translateSubscription: Subscription;
  private storeData: any;
  constructor(
    private zone: NgZone,
    private fb: FormBuilder,
    private router: Router,
    private store: Store<any>,
    private httpService: HttpService,
    private utils: Utils,
    private serviceConstants: ServiceConstants,
    private riExchange: RiExchange,
    private renderer: Renderer
    ) {
        this.formGroup = this.fb.group({
          InvSelectedContractPremise: [{ value: '', disabled: false }],
          CmdInvClearSelected: [{ disabled: false }],
          InvoiceSearchOn: [{ value: 'all', disabled: false }],
          InvoiceSearchValue: [{ value: '', disabled: false }],
          InvoiceViewType: [{ value: 'screen', disabled: false }],
          DefaultEmailFrom: [{ value: '', disabled: false }],
          InvoiceEmailAddress: [{ value: '', disabled: false }],
          InvoiceContractTypeCode: [{ value: '', disabled: false }]
        });
  }

  ngOnInit(): void {
    this.storeSubscription = this.store.select('callcentresearch').subscribe(data => {
        this.storeData = data;
        if (this.storeData['fieldVisibility'] && this.storeData['fieldVisibility'].tabInvoices) {
          this.fieldVisibility = this.storeData['fieldVisibility'].tabInvoices;
        }
        if (this.storeData['dropdownList'] && this.storeData['dropdownList'].tabInvoices) {
          this.dropdownList = this.storeData['dropdownList'].tabInvoices;
        }
        if (data && data['action']) {
            switch (data['action']) {
                case CallCenterActionTypes.BUILD_SPECIFIC_GRID:
                if (this.storeData['gridToBuild'].indexOf('Invoices') > -1) {
                  this.loadGridView();
                }
                break;
                case CallCenterActionTypes.CLEAR_SPECIFIC_GRID:
                if (this.storeData['gridToClear'].indexOf('Invoices') > -1) {
                  this.invoicesGrid.clearGridData();
                  this.invoiceSearchOnOnChange({});
                }
                break;
                case CallCenterActionTypes.SET_PAGINATION:
                if (this.storeData['storeSavedData']['pagination']) {
                  this.currentPage = this.storeData['storeSavedData']['pagination'].tabInvoices;
                }
                break;
                default:
                break;
            }
        }
    });
    this.invoiceSearchOnOnChange({});
  }

  ngAfterViewInit(): void {
    this.store.dispatch({
      type: CallCenterActionTypes.FORM_GROUP, payload: {
          tabInvoices: this.formGroup
      }
    });
    this.store.dispatch({
      type: CallCenterActionTypes.SAVE_DROPDOWN_LIST, payload: {
        tabInvoices: this.dropdownList
      }
    });
    this.store.dispatch({
      type: CallCenterActionTypes.SAVE_VISIBILITY_FIELD, payload: {
        tabInvoices: this.fieldVisibility
      }
    });
    this.store.dispatch({
      type: CallCenterActionTypes.INITIALIZATION, payload: {
        tabInvoices: true
      }
    });
  }

  ngOnDestroy(): void {
    if (this.storeSubscription)
        this.storeSubscription.unsubscribe();
    if (this.translateSubscription)
        this.translateSubscription.unsubscribe();
  }

  public getCurrentPage(event: any): void {
      this.currentPage = event.value;
      this.refresh();
  }
  public getGridInfo(info: any): void {
      this.totalRecords = info.totalRows;
      if (info.gridData && info.gridData.body && info.gridData.body.cells.length > 0) {
        this.fieldVisibility.InvoiceViewType = true;
        this.formGroup.controls['InvoiceViewType'].setValue('screen');
        this.invoiceViewTypeOnChange({});
      } else {
        this.fieldVisibility.InvoiceViewType = false;
      }
      setTimeout(() => {
          this.paginationCurrentPage = this.currentPage;
      }, 0);
  }
  public onGridRowClick(data: any): void {
    this.onGridCellClick(data);
    if (data.cellIndex === 0) {
      if (this.storeData['otherParams'].otherVariables.ContractLimitDataView === 'N') {
        if (this.storeData['otherParams'].otherVariables.CurrentCallLogID === '' && (this.storeData['formGroup'].main.controls['VisibleCurrentCallLogID'].value === '' || this.storeData['formGroup'].main.controls['VisibleCurrentCallLogID'].value === '0')) {
          /*let click = new CustomEvent('click', { bubbles: true });
          let elem = document.querySelector('#CmdNewCall');
          if (elem)
          this.renderer.invokeElementMethod(elem, 'click', [click]);*/
          this.storeData['subject']['CmdNewCallSent'].asObservable().subscribe((recieved) => {
            if (recieved['type'] === 'Invoices') {
              this.navigateToContract();
            }
            this.storeData['subject']['CmdNewCallSent'].unsubscribe();
          });
          this.storeData['subject']['CmdNewCallRecieved'].next({
            type: 'Invoices'
          });
        } else {
          this.navigateToContract();
        }
      } else {
        this.store.dispatch({
            type: CallCenterActionTypes.DISPLAY_ERROR, payload: this.storeData['otherParams'].registry['gcPermissionDeniedMessage']
          });
      }
    } else if (data.cellIndex === 2) {
      // iCABSAContractInvoiceDetailGrid
      this.router.navigate([ContractManagementModuleRoutes.ICABSACONTRACTINVOICEDETAILGRID], { queryParams: {
        parentMode: 'Account',
        AccountNumber: this.storeData['otherParams'].otherVariables.AccountNumber,
        ContractNumber: this.storeData['otherParams'].otherVariables.ContractNumber,
        PremiseNumber: this.storeData['otherParams'].otherVariables.PremiseNumber,
        ProductCode: this.storeData['otherParams'].otherVariables.ProductCode,
        ProductDesc: this.storeData['otherParams'].otherVariables.ProductDesc,
        CurrentCallLogID: this.storeData['otherParams'].otherVariables.CurrentCallLogID,
        SelectedInvoice: this.storeData['otherParams'].otherVariables.SelectedInvoice.trim(),
        InvoiceNumber: this.storeData['otherParams'].otherVariables.SelectedInvoice.trim(),
        InvoiceName: '',
        SystemInvoiceNumber: data.trRowData[2].additionalData,
        CompanyCode: data.trRowData[1].additionalData,
        ContractName: data.trRowData[3].additionalData,
        CompanyDesc: data.trRowData[4].additionalData
      }});
    }
  }

  public navigateToContract(): void {
    if (this.storeData['otherParams'].otherVariables.ContractType === 'C') {
      this.router.navigate([ContractManagementModuleRoutes.ICABSACONTRACTMAINTENANCE], { queryParams: {
        parentMode: 'CallCentreSearch',
        ContractNumber: this.storeData['otherParams'].otherVariables.ContractNumber,
        CurrentCallLogID: this.storeData['otherParams'].otherVariables.CurrentCallLogID
      }});
    } else if (this.storeData['otherParams'].otherVariables.ContractType === 'J') {
      this.router.navigate([ContractManagementModuleRoutes.ICABSAJOBMAINTENANCE], { queryParams: {
        parentMode: 'CallCentreSearch',
        ContractNumber: this.storeData['otherParams'].otherVariables.ContractNumber,
        CurrentCallLogID: this.storeData['otherParams'].otherVariables.CurrentCallLogID
      }});
    } else if (this.storeData['otherParams'].otherVariables.ContractType === 'P') {
      this.router.navigate([ContractManagementModuleRoutes.ICABSAPRODUCTSALEMAINTENANCE], { queryParams: {
        parentMode: 'CallCentreSearch',
        ContractNumber: this.storeData['otherParams'].otherVariables.ContractNumber,
        CurrentCallLogID: this.storeData['otherParams'].otherVariables.CurrentCallLogID
      }});
    }
  }

  public onGridCellClick(data: any): void {
    this.storeData['otherParams'].otherVariables.ContractROWID = data.trRowData[0].rowID;
    this.storeData['otherParams'].otherVariables.ContractType = data.trRowData[1].text;
    this.storeData['otherParams'].otherVariables.SelectedInvoice = data.trRowData[2].text;
    this.storeData['otherParams'].otherVariables.SelectedInvoiceRowID = data.trRowData[2].rowID;
    if ((this.maxColumns === 13 && data.cellIndex === 12) || (this.maxColumns === 12 && data.cellIndex === 11)) {
      if (this.formGroup.controls['InvoiceViewType'].value === 'email') {
        if (this.formGroup.controls['InvoiceEmailAddress'].value === '') {
          this.formGroup.controls['InvoiceEmailAddress'].markAsTouched();
          this.formGroup.controls['InvoiceEmailAddress'].updateValueAndValidity();
          return;
        }
        this.store.dispatch({
          type: CallCenterActionTypes.SHOW_EMAIL_INVOICE, payload: [this.storeData['otherParams'].otherVariables.SelectedInvoiceRowID]
        });
      } else {
        this.store.dispatch({
          type: CallCenterActionTypes.SHOW_PRINT_INVOICE, payload: [this.storeData['otherParams'].otherVariables.SelectedInvoiceRowID]
        });
      }
    }
  }

  public refresh(): void {
    this.fieldVisibility.InvoiceViewType = false;
    this.fieldVisibility.DefaultEmailFrom = false;
    this.fieldVisibility.InvoiceEmailAddress = false;
    this.fieldVisibility.FurtherRecords = false;
    this.loadGridView();
  }

  private setGridSettings(): void {
    this.validateProperties = [
        {
            'type': MntConst.eTypeTextFree,
            'index': 0,
            'align': 'center'
        },
        {
            'type': MntConst.eTypeTextFree,
            'index': 1,
            'align': 'center'
        },
        {
            'type': MntConst.eTypeTextFree,
            'index': 2,
            'align': 'center'
        },
        {
            'type': MntConst.eTypeInteger,
            'index': 3,
            'align': 'center'
        },
        {
            'type': MntConst.eTypeDate,
            'index': 4,
            'align': 'center'
        },
        {
            'type': MntConst.eTypeDate,
            'index': 5,
            'align': 'center'
        },
        {
            'type': MntConst.eTypeDate,
            'index': 6,
            'align': 'center'
        },
        {
            'type': MntConst.eTypeImage,
            'index': 7,
            'align': 'center'
        },
        {
            'type': MntConst.eTypeCurrency,
            'index': 8,
            'align': 'center'
        },
        {
            'type': MntConst.eTypeCurrency,
            'index': 9,
            'align': 'center'
        },
        {
            'type': MntConst.eTypeCurrency,
            'index': 10,
            'align': 'center'
        }
    ];
    let additionalColumn: Array<any> = [];
    if (this.storeData['otherParams'].registry && this.storeData['otherParams'].registry.glShowInvoiceBalance) {
      additionalColumn = [
        {
            'type': MntConst.eTypeCurrency,
            'index': 11,
            'align': 'center'
        },
        {
            'type': MntConst.eTypeImage,
            'index': 12,
            'align': 'center'
        }
      ];
      this.maxColumns = 13;
    } else {
      additionalColumn = [
        {
            'type': MntConst.eTypeImage,
            'index': 11,
            'align': 'center'
        }
      ];
      this.maxColumns = 12;
    }
    this.validateProperties = this.validateProperties.concat(additionalColumn);
    this.setGridHeaders();
  }

  private setGridHeaders(): void {
    this.gridSortHeaders = [
      {
          'fieldName': 'InvContractNumber',
          'index': 0,
          'sortType': 'ASC'
      },
      {
          'fieldName': 'InvContractTypeCode',
          'index': 1,
          'sortType': 'ASC'
      },
      {
          'fieldName': 'InvInvoiceNumber',
          'index': 2,
          'sortType': 'ASC'
      },
      {
          'fieldName': 'InvInvoiceGroupNumber',
          'index': 3,
          'sortType': 'ASC'
      },
      {
          'fieldName': 'InvExtractDate',
          'index': 4,
          'sortType': 'ASC'
      },
      {
          'fieldName': 'InvPeriodStart',
          'index': 5,
          'sortType': 'ASC'
      },
      {
          'fieldName': 'InvTaxPointDate',
          'index': 6,
          'sortType': 'ASC'
      },
      {
          'fieldName': 'InvInvoiceValue',
          'index': 10,
          'sortType': 'ASC'
      }
    ];

    this.headerProperties = [
      {
          'align': 'center',
          'width': '120px',
          'index': 0
      },
      {
          'align': 'center',
          'width': '120px',
          'index': 2
      }
    ];
    for (let k = 0; k < this.gridSortHeaders.length; k++) {
      if (this.gridSortHeaders[k].fieldName === this.headerClicked) {
          this.gridSortHeaders[k].sortType = this.sortType === 'Descending' ? 'DESC' : 'ASC';
      }
    }
  }

  public sortGrid(data: any): void {
    this.headerClicked = data.fieldname;
    this.sortType = data.sort === 'DESC' ? 'Descending' : 'Ascending';
    this.loadGridView();
  }

  public loadGridView(): void {
    this.setGridSettings();
    let urlParams = this.riExchange.getRouterUrlParams();
    this.inputParams.module = this.queryGrid.module;
    this.inputParams.method = this.queryGrid.method;
    this.inputParams.operation = this.queryGrid.operation;
    this.search.set(this.serviceConstants.Action, '2');
    this.search.set(this.serviceConstants.BusinessCode, this.storeData['code'].business ? this.storeData['code'].business : this.utils.getBusinessCode());
    this.search.set(this.serviceConstants.CountryCode, this.storeData['code'].country ? this.storeData['code'].country : this.utils.getCountryCode());
    this.search.set('GridName', 'Invoice');
    this.search.set('AccountNumber', this.utils.checkIfValueExistAndReturn(this.storeData['otherParams'].otherVariables, 'AccountNumber'));
    this.search.set('ProspectNumber', this.utils.checkIfValueExistAndReturn(this.storeData['otherParams'].otherVariables, 'ProspectNumber'));
    this.search.set('ContractNumber', this.utils.checkIfValueExistAndReturn(this.storeData['otherParams'].otherVariables, 'InvSelectedContract'));
    this.search.set('PremiseNumber', this.utils.checkIfValueExistAndReturn(this.storeData['otherParams'].otherVariables, 'InvSelectedPremise'));
    this.search.set('ContractTypeCode', this.formGroup.controls['InvoiceContractTypeCode'] ? this.formGroup.controls['InvoiceContractTypeCode'].value : '');
    this.search.set('SearchOn', this.formGroup.controls['InvoiceSearchOn'].value);
    this.search.set('SearchValue', this.formGroup.controls['InvoiceSearchValue'].value);
    this.search.set('riSortOrder', this.sortType);
    this.search.set('riGridMode', '0');
    this.search.set('riGridHandle', (Math.floor(Math.random() * 900000) + 100000).toString());
    this.search.set('HeaderClickedColumn', this.headerClicked);
    this.search.set('PageSize', this.pageSize.toString());
    this.search.set('PageCurrent', this.currentPage.toString());
    this.inputParams.search = this.search;
    this.invoicesGrid.loadGridData(this.inputParams);
    this.storeData['pagination'].tabInvoices = this.currentPage;
  }

  public invoiceViewTypeOnChange(event: any): void {
    if (this.formGroup.controls['InvoiceViewType'].value === 'email') {
      this.fieldVisibility.DefaultEmailFrom = true;
      this.fieldVisibility.InvoiceEmailAddress = true;
      this.formGroup.controls['InvoiceEmailAddress'].setValidators(Validators.required);
      this.formGroup.controls['InvoiceEmailAddress'].updateValueAndValidity();
      this.formGroup.controls['DefaultEmailFrom'].setValue('account');
      this.defaultEmailFromOnChange({});
    } else {
      this.formGroup.controls['InvoiceEmailAddress'].clearValidators();
      this.formGroup.controls['InvoiceEmailAddress'].updateValueAndValidity();
      this.fieldVisibility.DefaultEmailFrom = false;
      this.fieldVisibility.InvoiceEmailAddress = false;
    }
  }

  public defaultEmailFromOnChange(event: any): void {
    if (this.formGroup.controls['DefaultEmailFrom'].value === 'account') {
      this.formGroup.controls['InvoiceEmailAddress'].setValue(this.storeData['formGroup'].tabAccounts.controls['AccountContactEmail'].value);
    } else if (this.formGroup.controls['DefaultEmailFrom'].value === 'contract') {
      this.formGroup.controls['InvoiceEmailAddress'].setValue(this.storeData['otherParams'].otherVariables.ContractContactEmail);
    } else if (this.formGroup.controls['DefaultEmailFrom'].value === 'premise') {
      this.formGroup.controls['InvoiceEmailAddress'].setValue(this.storeData['formGroup'].tabPremises.controls['PremiseContactEmail'].value);
    }
  }

  public cmdInvClearSelectedOnClick(event: any): void {
    if (this.storeData['otherParams'].otherVariables.InvSelectedContract !== '' && this.storeData['otherParams'].otherVariables.InvSelectedPremise !== '') {
      this.storeData['otherParams'].otherVariables.InvSelectedPremise = '';
      this.formGroup.controls['InvSelectedContractPremise'].setValue(this.storeData['otherParams'].otherVariables.InvSelectedContract);
      this.loadGridView();
    } else if (this.storeData['otherParams'].otherVariables.InvSelectedContract !== '') {
      this.storeData['otherParams'].otherVariables.InvSelectedContract = '';
      this.storeData['otherParams'].otherVariables.InvSelectedPremise = '';
      this.formGroup.controls['InvSelectedContractPremise'].setValue('');
      this.loadGridView();
    }
  }

  public invoiceSearchOnOnChange(event: any): void {
    if (this.formGroup.controls['InvoiceSearchOn'].value === 'all') {
      this.formGroup.controls['InvoiceSearchValue'].setValue('');
      this.formGroup.controls['InvoiceSearchValue'].disable();
    } else {
      this.formGroup.controls['InvoiceSearchValue'].setValue('');
      this.formGroup.controls['InvoiceSearchValue'].enable();
      let tabText = document.querySelector('#tabCont .nav-tabs li.active a span')['innerText'];
      if (tabText === this.storeData['tabsTranslation'].tabInvoices) {
        let focus = new CustomEvent('focus', { bubbles: true });
        setTimeout(() => {
          this.renderer.invokeElementMethod(document.querySelector('#InvoiceSearchValue'), 'focus', [focus]);
        }, 0);
      }
    }
    this.formGroup.controls['InvoiceSearchValue'].setValue('');
  }

  public invoiceSearchOnOnKeyDown(event: any): void {
    if (event.keyCode === 13) {
       this.loadGridView();
    }
  }

  public invoiceSearchValueOnKeyDown(event: any): void {
    if (event.keyCode === 13) {
       this.loadGridView();
    }
  }

  public invoiceContractTypeCodeOnKeyDown(event: any): void {
    if (event.keyCode === 13) {
       this.loadGridView();
    }
  }

  public fetchTranslationContent(): void {
      // translation content
  }
}
