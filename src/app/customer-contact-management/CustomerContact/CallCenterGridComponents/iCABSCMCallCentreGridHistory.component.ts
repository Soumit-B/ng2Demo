import { Component, NgZone, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
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
import { RiExchange } from '../../../../shared/services/riExchange';
import { MntConst } from '../../../../shared/services/riMaintenancehelper';
import { ContractManagementModuleRoutes, InternalMaintenanceApplicationModuleRoutes } from './../../../base/PageRoutes';

@Component({
  selector: 'icabs-call-center-grid-history',
  templateUrl: 'iCABSCMCallCentreGridHistory.html'
})

export class CallCenterGridHistoryComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('historyGrid') historyGrid: GridComponent;
  public formGroup: FormGroup;
  public fieldVisibility: any = {
    HistorySelectedContractPremise: true,
    CmdHistoryClearSelected: true,
    HistoryType: true,
    FurtherRecords: false
  };
  public dateObjectsEnabled: any = {
    HistoryFromDate: true,
    HistoryToDate: true
  };
  public dateObjects: any = {
    HistoryToDate: new Date(),
    HistoryFromDate: new Date()
  };
  public historyToDateDisplay: string = '';
  public historyFromDateDisplay: string = '';
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
  public maxColumns: number = 10;
  public gridSortHeaders: Array<any> = [];
  public headerProperties: Array<any> = [];
  public validateProperties: Array<any> = [];
  private headerClicked: string;
  private sortType: string;
  private storeSubscription: Subscription;
  private translateSubscription: Subscription;
  private storeData: any;
  private initComplete: boolean = false;
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
      HistorySelectedContractPremise: [{ value: '', disabled: false }],
      CmdHistoryClearSelected: [{ value: '', disabled: false }],
      HistoryType: [{ value: 'effective', disabled: false }],
      HistoryFromDate: [{ value: '', disabled: false }],
      HistoryToDate: [{ value: '', disabled: false }]
    });
  }

  ngOnInit(): void {
    this.storeSubscription = this.store.select('callcentresearch').subscribe(data => {
      this.storeData = data;
      if (this.storeData['fieldVisibility'] && this.storeData['fieldVisibility'].tabHistory) {
        this.fieldVisibility = this.storeData['fieldVisibility'].tabHistory;
      }
      if (this.storeData['dateObjects'] && this.storeData['dateObjects'].tabHistory) {
        this.dateObjects = this.storeData['dateObjects'].tabHistory;
      }
      if (this.storeData['dateVisibility'] && this.storeData['dateVisibility'].tabHistory) {
        this.dateObjectsEnabled = this.storeData['dateVisibility'].tabHistory;
      }
      if (data && data['action']) {
        switch (data['action']) {
          case CallCenterActionTypes.BUILD_SPECIFIC_GRID:
            if (this.storeData['gridToBuild'].indexOf('History') > -1) {
              this.loadGridView();
            }
            break;
          case CallCenterActionTypes.CLEAR_SPECIFIC_GRID:
            if (this.storeData['gridToClear'].indexOf('History') > -1) {
              this.historyGrid.clearGridData();
            }
            break;
          case CallCenterActionTypes.RESET_ALL_SEARCH_DETAILS:
            this.resetDate();
            break;
          case CallCenterActionTypes.SET_PAGINATION:
            if (this.storeData['storeSavedData']['pagination']) {
              this.currentPage = this.storeData['storeSavedData']['pagination'].tabHistory;
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
        tabHistory: this.formGroup
      }
    });
    this.store.dispatch({
      type: CallCenterActionTypes.SAVE_VISIBILITY_FIELD, payload: {
        tabHistory: this.fieldVisibility
      }
    });
    this.store.dispatch({
      type: CallCenterActionTypes.SAVE_DATE_VISIBILITY, payload: {
        tabHistory: this.dateObjectsEnabled
      }
    });
    this.store.dispatch({
      type: CallCenterActionTypes.SAVE_DATE_OBJECTS, payload: {
        tabHistory: this.dateObjects
      }
    });
    this.store.dispatch({
      type: CallCenterActionTypes.INITIALIZATION, payload: {
        tabHistory: true
      }
    });
    setTimeout(() => {
      this.initComplete = true;
    }, 100);
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
  }
  public onGridRowClick(data: any): void {
    this.onGridCellClick(data);
    if (data.cellIndex === (this.maxColumns - 1)) {
      // iCABSAContractHistoryDetail
      if (this.storeData['otherParams'].otherVariables.CurrentHistoryRowid !== '') {
        this.router.navigate([ InternalMaintenanceApplicationModuleRoutes.ICABSACONTRACTHISTORYDETAIL ], {
          queryParams: {
            parentMode: 'CallCentreSearch',
            AccountNumber: this.storeData['otherParams'].otherVariables.AccountNumber,
            ContractNumber: this.storeData['otherParams'].otherVariables.ContractNumber,
            PremiseNumber: this.storeData['otherParams'].otherVariables.PremiseNumber,
            ProductCode: this.storeData['otherParams'].otherVariables.ProductCode,
            ProductDesc: this.storeData['otherParams'].otherVariables.ProductDesc,
            CurrentCallLogID: this.storeData['otherParams'].otherVariables.CurrentCallLogID,
            ContractHistoryRowID: this.storeData['otherParams'].otherVariables.CurrentHistoryRowid
          }
        });
      }
    }
  }

  public onGridCellClick(data: any): void {
    this.storeData['otherParams'].otherVariables.CurrentHistoryRowid = data.trRowData[0].rowID;
  }

  public refresh(): void {
    this.loadGridView();
  }

  private setGridSettings(): void {
    let lAccountLevel;
    let additionalProperties: Array<any> = [];
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
        }
    ];
    if (!this.formGroup.controls['HistorySelectedContractPremise'].value) {
      this.maxColumns = 6;
      additionalProperties = [
        {
            'type': MntConst.eTypeTextFree,
            'index': 2,
            'align': 'center'
        },
        {
            'type': MntConst.eTypeTextFree,
            'index': 3,
            'align': 'center'
        },
        {
            'type': MntConst.eTypeTextFree,
            'index': 4,
            'align': 'center'
        },
        {
            'type': MntConst.eTypeTextFree,
            'index': 5,
            'align': 'center'
        }
      ];
    } else {
      this.maxColumns = 15;
      additionalProperties = [
        {
            'type': MntConst.eTypeTextFree,
            'index': 2,
            'align': 'center'
        },
        {
            'type': MntConst.eTypeTextFree,
            'index': 3,
            'align': 'center'
        },
        {
            'type': MntConst.eTypeText,
            'index': 4,
            'align': 'center'
        },
        {
            'type': MntConst.eTypeText,
            'index': 5,
            'align': 'center'
        },
        {
            'type': MntConst.eTypeText,
            'index': 6,
            'align': 'center'
        },
        {
            'type': MntConst.eTypeText,
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
        },
        {
            'type': MntConst.eTypeImage,
            'index': 11,
            'align': 'center'
        },
        {
            'type': MntConst.eTypeTextFree,
            'index': 12,
            'align': 'center'
        },
        {
            'type': MntConst.eTypeTextFree,
            'index': 13,
            'align': 'center'
        },
        {
            'type': MntConst.eTypeImage,
            'index': 14,
            'align': 'center'
        }
      ];
    }
    this.validateProperties = this.validateProperties.concat(additionalProperties);
    this.setGridHeaders();
  }

  private setGridHeaders(): void {
    let obj = [];
    this.gridSortHeaders = obj;
    this.headerProperties = [
      {
        'align': 'center',
        'width': '120px',
        'index': 0
      }
    ];
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
    this.search.set('GridName', 'History');
    this.search.set('AccountNumber', this.utils.checkIfValueExistAndReturn(this.storeData['otherParams'].otherVariables, 'AccountNumber'));
    this.search.set('ProspectNumber', this.utils.checkIfValueExistAndReturn(this.storeData['otherParams'].otherVariables, 'ProspectNumber'));
    this.search.set('ContractNumber', this.utils.checkIfValueExistAndReturn(this.storeData['otherParams'].otherVariables, 'HistorySelectedContract'));
    this.search.set('PremiseNumber', this.utils.checkIfValueExistAndReturn(this.storeData['otherParams'].otherVariables, 'HistorySelectedPremise'));
    this.search.set('HistoryType', this.formGroup.controls['HistoryType'] ? this.formGroup.controls['HistoryType'].value : '');
    this.search.set('HistoryFromDate', this.formGroup.controls['HistoryFromDate'].value);
    this.search.set('HistoryToDate', this.formGroup.controls['HistoryToDate'].value);
    this.search.set('riSortOrder', 'Ascending');
    this.search.set('riGridMode', '0');
    this.search.set('riGridHandle', (Math.floor(Math.random() * 900000) + 100000).toString());
    this.search.set('HeaderClickedColumn', '');
    this.search.set('PageSize', this.pageSize.toString());
    this.search.set('PageCurrent', this.currentPage.toString());
    this.inputParams.search = this.search;
    this.historyGrid.loadGridData(this.inputParams);
    this.storeData['pagination'].tabHistory = this.currentPage;
  }

  public historyFromDateSelectedValue(value: Object): void {
    if (value && value['value']) {
      let prev = this.historyFromDateDisplay;
      this.historyFromDateDisplay = value['value'];
      this.formGroup.controls['HistoryFromDate'].setValue(this.historyFromDateDisplay);
      if (this.initComplete && this.storeData['allowAjaxOnDateChange'] && prev !== value['value'])
        this.loadGridView();
    } else {
      this.historyFromDateDisplay = '';
      this.formGroup.controls['HistoryFromDate'].setValue('');
    }
  }

  public historyToDateSelectedValue(value: Object): void {
    if (value && value['value']) {
      let prev = this.historyToDateDisplay;
      this.historyToDateDisplay = value['value'];
      this.formGroup.controls['HistoryToDate'].setValue(this.historyToDateDisplay);
      if (this.initComplete && this.storeData['allowAjaxOnDateChange'] && prev !== value['value'])
        this.loadGridView();
    } else {
      this.historyToDateDisplay = '';
      this.formGroup.controls['HistoryToDate'].setValue('');
    }
  }

  public cmdHistoryClearSelectedOnClick(event: any): void {
    if (this.storeData['otherParams'].otherVariables.HistorySelectedContract !== '' && this.storeData['otherParams'].otherVariables.HistorySelectedPremise !== '') {
      this.storeData['otherParams'].otherVariables.HistorySelectedPremise = '';
      this.formGroup.controls['HistorySelectedContractPremise'].setValue(this.storeData['otherParams'].otherVariables.HistorySelectedContract);
      this.loadGridView();
    } else if (this.storeData['otherParams'].otherVariables.HistorySelectedContract !== '') {
      this.storeData['otherParams'].otherVariables.HistorySelectedContract = '';
      this.storeData['otherParams'].otherVariables.HistorySelectedPremise = '';
      this.formGroup.controls['HistorySelectedContractPremise'].setValue('');
      this.loadGridView();
    }
  }

  private resetDate(): void {
    let date = new Date();
    this.dateObjects.HistoryFromDate = new Date(date.setDate(date.getDate() - this.storeData['otherParams'].registry.giHistoryFromDays));
    date = new Date();
    this.dateObjects.HistoryToDate = new Date(date.setDate(date.getDate() + this.storeData['otherParams'].registry.giHistoryFromDays));
  }

  public fetchTranslationContent(): void {
    // translation content
  }
}
