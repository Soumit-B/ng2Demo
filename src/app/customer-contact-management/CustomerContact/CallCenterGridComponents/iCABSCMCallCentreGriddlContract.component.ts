import { Component, NgZone, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { URLSearchParams } from '@angular/http';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { HttpService } from '../../../../shared/services/http-service';
import { CallCenterActionTypes } from '../../../actions/call-centre-search';
import { ServiceConstants } from '../../../../shared/constants/service.constants';
import { GlobalConstant } from '../../../../shared/constants/global.constant';
import { GridComponent } from '../../../../shared/components/grid/grid';
import { Utils } from '../../../../shared/services/utility';
import { MntConst } from '../../../../shared/services/riMaintenancehelper';
import { RiExchange } from '../../../../shared/services/riExchange';

@Component({
  selector: 'icabs-call-center-grid-dlcontract',
  templateUrl: 'iCABSCMCallCentreGriddlContract.html'
})

export class CallCenterGriddlContractComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('dlContractGrid') dlContractGrid: GridComponent;
  public formGroup: FormGroup;
  public fieldVisibility: any = {
    DlContractViewType: false,
    DlContractEmailAddress: false,
    DlContractDocumentType: true,
    DlContractOutputType: true,
    FurtherRecords: false
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
  public maxColumns: number = 9;
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
    private riExchange: RiExchange
    ) {
      this.formGroup = this.fb.group({
        DlContractViewType: [{ value: 'view', disabled: false }],
        DlContractEmailAddress: [{ value: '', disabled: false }],
        DlContractDocumentType: [{ value: 'quote', disabled: false }],
        DlContractOutputType: [{ value: 'pdf', disabled: false }]
      });
  }

  ngOnInit(): void {
    this.setGridHeaders();
    this.storeSubscription = this.store.select('callcentresearch').subscribe(data => {
        this.storeData = data;
        if (this.storeData['fieldVisibility'] && this.storeData['fieldVisibility'].tabDlContract) {
          this.fieldVisibility = this.storeData['fieldVisibility'].tabDlContract;
        }
        if (data && data['action']) {
            switch (data['action']) {
                case CallCenterActionTypes.BUILD_SPECIFIC_GRID:
                if (this.storeData['gridToBuild'].indexOf('DlContract') > -1) {
                  this.loadGridView();
                }
                break;
                case CallCenterActionTypes.CLEAR_SPECIFIC_GRID:
                if (this.storeData['gridToClear'].indexOf('History') > -1) {
                  this.dlContractGrid.clearGridData();
                }
                break;
                case CallCenterActionTypes.SET_PAGINATION:
                if (this.storeData['storeSavedData']['pagination']) {
                  this.currentPage = this.storeData['storeSavedData']['pagination'].tabDlContract;
                }
                break;
                default:
                break;
            }
        }
    });
  }

  ngAfterViewInit(): void {
    this.store.dispatch({
        type: CallCenterActionTypes.FORM_GROUP, payload: {
            tabDlContract: this.formGroup
        }
    });
    this.store.dispatch({
        type: CallCenterActionTypes.INITIALIZATION, payload: {
          tabDlContract: true
        }
    });
    this.store.dispatch({
      type: CallCenterActionTypes.SAVE_VISIBILITY_FIELD, payload: {
        tabDlContract: this.fieldVisibility
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
      setTimeout(() => {
          this.paginationCurrentPage = this.currentPage;
      }, 0);
      if (info.gridData && info.gridData.body && info.gridData.body.cells.length > 0) {
        // statement
      }
  }
  public onGridRowClick(data: any): void {
    this.onGridCellClick(data);
  }

  public onGridCellClick(data: any): void {
    // statement
  }

  public refresh(): void {
      this.loadGridView();
  }

  private setGridHeaders(): void {
    let obj = [
      {
          'fieldName': 'QuoteRef',
          'index': 0,
          'sortType': 'ASC'
      },
      {
          'fieldName': 'QuoteDate',
          'index': 1,
          'sortType': 'ASC'
      },
      {
          'fieldName': 'ContractValue',
          'index': 2,
          'sortType': 'ASC'
      },
      {
          'fieldName': 'JobValue',
          'index': 3,
          'sortType': 'ASC'
      },
      {
          'fieldName': 'TotalPrem',
          'index': 4,
          'sortType': 'ASC'
      },
      {
          'fieldName': 'TotalSCover',
          'index': 5,
          'sortType': 'ASC'
      },
      {
          'fieldName': 'ServiceDetails',
          'index': 6,
          'sortType': 'ASC'
      },
      {
          'fieldName': 'QuoteStage',
          'index': 7,
          'sortType': 'ASC'
      },
      {
          'fieldName': 'PrintSendQuote',
          'index': 8,
          'sortType': 'ASC'
      }
    ];

    this.validateProperties = [
        {
            'type': MntConst.eTypeTextFree,
            'index': 0,
            'align': 'center'
        },
        {
            'type': MntConst.eTypeDate,
            'index': 1,
            'align': 'center'
        },
        {
            'type': MntConst.eTypeCurrency,
            'index': 2,
            'align': 'center'
        },
        {
            'type': MntConst.eTypeCurrency,
            'index': 3,
            'align': 'center'
        },
        {
            'type': MntConst.eTypeInteger,
            'index': 4,
            'align': 'center'
        },
        {
            'type': MntConst.eTypeInteger,
            'index': 5,
            'align': 'center'
        },
        {
            'type': MntConst.eTypeTextFree,
            'index': 6,
            'align': 'center'
        },
        {
            'type': MntConst.eTypeTextFree,
            'index': 7,
            'align': 'center'
        },
        {
            'type': MntConst.eTypeImage,
            'index': 8,
            'align': 'center'
        }
    ];
    this.headerProperties = [];
    this.gridSortHeaders = obj;
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
    this.setGridHeaders();
    let urlParams = this.riExchange.getRouterUrlParams();
    this.inputParams.module = this.queryGrid.module;
    this.inputParams.method = this.queryGrid.method;
    this.inputParams.operation = this.queryGrid.operation;
    this.search.set(this.serviceConstants.Action, '2');
    this.search.set(this.serviceConstants.BusinessCode, this.storeData['code'].business ? this.storeData['code'].business : this.utils.getBusinessCode());
    this.search.set(this.serviceConstants.CountryCode, this.storeData['code'].country ? this.storeData['code'].country : this.utils.getCountryCode());
    this.search.set('GridName', 'dlContract');
    this.search.set('AccountNumber', this.utils.checkIfValueExistAndReturn(this.storeData['otherParams'].otherVariables, 'AccountNumber'));
    this.search.set('ProspectNumber', this.utils.checkIfValueExistAndReturn(this.storeData['otherParams'].otherVariables, 'ProspectNumber'));
    this.search.set('ContractNumber', this.utils.checkIfValueExistAndReturn(this.storeData['otherParams'].otherVariables, 'WOSelectedContract'));
    this.search.set('PremiseNumber', this.utils.checkIfValueExistAndReturn(this.storeData['otherParams'].otherVariables, 'WOSelectedPremise'));
    this.search.set('DlContractViewType', this.formGroup.controls['DlContractViewType'].value);
    this.search.set('DlContractEmailAddress', this.formGroup.controls['DlContractEmailAddress'].value);
    this.search.set('DlContractDocumentType', this.formGroup.controls['DlContractDocumentType'].value);
    this.search.set('DlContractOutputType', this.formGroup.controls['DlContractOutputType'].value);
    this.search.set('riSortOrder', this.sortType);
    this.search.set('riGridMode', '0');
    this.search.set('riGridHandle', (Math.floor(Math.random() * 900000) + 100000).toString());
    this.search.set('HeaderClickedColumn', this.headerClicked);
    this.search.set('PageSize', this.pageSize.toString());
    this.search.set('PageCurrent', this.currentPage.toString());
    this.inputParams.search = this.search;
    this.dlContractGrid.loadGridData(this.inputParams);
    this.storeData['pagination'].tabDlContract = this.currentPage;
  }

  public dlContractViewTypeOnChange(event: any): void {
    if (this.formGroup.controls['DlContractViewType'].value === 'email') {
      this.fieldVisibility.DlContractEmailAddress = true;
      this.formGroup.controls['DlContractEmailAddress'].setValidators(Validators.required);
      this.formGroup.controls['DlContractEmailAddress'].updateValueAndValidity();
      this.defaultEmailFromOnChange({});
    } else {
      this.formGroup.controls['DlContractEmailAddress'].clearValidators();
      this.formGroup.controls['DlContractEmailAddress'].updateValueAndValidity();
      this.fieldVisibility.DlContractEmailAddress = false;
    }
  }

  public defaultEmailFromOnChange(event: any): void {
    this.formGroup.controls['DlContractEmailAddress'].setValue(this.storeData['formGroup'].tabAccounts.controls['AccountContactEmail'].value);
  }
}
