import { Component, NgZone, OnInit, OnDestroy, ViewChild, AfterViewInit, Renderer } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
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
import { ContractManagementModuleRoutes, InternalGridSearchModuleRoutes, InternalGridSearchSalesModuleRoutes, InternalGridSearchApplicationModuleRoutes, InternalGridSearchServiceModuleRoutes } from './../../../base/PageRoutes';

@Component({
  selector: 'icabs-call-center-grid-work-orders',
  templateUrl: 'iCABSCMCallCentreGridWorkOrders.html'
})

export class CallCenterGridWorkOrdersComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('workGrid') workGrid: GridComponent;
  public formGroup: FormGroup;
  public fieldVisibility: any = {
    WorkOrderType: true,
    WOSelectedContractPremise: true,
    CmdWOClearSelected: true,
    FurtherRecords: false
  };
  public dateObjectsEnabled: any = {
    WOFromDate: true,
    WOToDate: true
  };
  public dateObjects: any = {
    WOFromDate: new Date(),
    WOToDate: new Date()
  };
  public wOFromDateDisplay: string = '';
  public wOToDateDisplay: string = '';
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
  public maxColumns: number = 15;
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
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<any>,
    private httpService: HttpService,
    private utils: Utils,
    private serviceConstants: ServiceConstants,
    private riExchange: RiExchange,
    private renderer: Renderer
  ) {
    this.formGroup = this.fb.group({
      WorkOrderType: [{ value: 'all', disabled: false }],
      WOFromDate: [{ value: 'all', disabled: false }],
      WOToDate: [{ value: 'all', disabled: false }],
      WOSelectedContractPremise: [{ value: '', disabled: false }],
      CmdWOClearSelected: [{ disabled: false }]
    });
  }

  ngOnInit(): void {
    this.storeSubscription = this.store.select('callcentresearch').subscribe(data => {
      this.storeData = data;
      if (this.storeData['fieldVisibility'] && this.storeData['fieldVisibility'].tabWorkOrders) {
        this.fieldVisibility = this.storeData['fieldVisibility'].tabWorkOrders;
      }
      if (this.storeData['dateObjects'] && this.storeData['dateObjects'].tabWorkOrders) {
        this.dateObjects = this.storeData['dateObjects'].tabWorkOrders;
      }
      if (this.storeData['dateVisibility'] && this.storeData['dateVisibility'].tabWorkOrders) {
        this.dateObjectsEnabled = this.storeData['dateVisibility'].tabWorkOrders;
      }
      if (data && data['action']) {
        switch (data['action']) {
          case CallCenterActionTypes.SAVE_OTHER_PARAMS:
            this.setGridSettings();
            break;
          case CallCenterActionTypes.BUILD_SPECIFIC_GRID:
            if (this.storeData['gridToBuild'].indexOf('WorkOrders') > -1) {
              this.loadGridView();
            }
            break;
          case CallCenterActionTypes.RESET_ALL_SEARCH_DETAILS:
            this.resetDate();
            break;
          case CallCenterActionTypes.CLEAR_SPECIFIC_GRID:
            if (this.storeData['gridToClear'].indexOf('WorkOrders') > -1) {
              this.workGrid.clearGridData();
            }
            break;
          case CallCenterActionTypes.SET_PAGINATION:
            if (this.storeData['storeSavedData']['pagination']) {
              this.currentPage = this.storeData['storeSavedData']['pagination'].tabWorkOrders;
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
        tabWorkOrders: this.formGroup
      }
    });
    this.store.dispatch({
      type: CallCenterActionTypes.SAVE_VISIBILITY_FIELD, payload: {
        tabWorkOrders: this.fieldVisibility
      }
    });
    this.store.dispatch({
      type: CallCenterActionTypes.SAVE_DATE_VISIBILITY, payload: {
        tabWorkOrders: this.dateObjectsEnabled
      }
    });
    this.store.dispatch({
      type: CallCenterActionTypes.SAVE_DATE_OBJECTS, payload: {
        tabWorkOrders: this.dateObjects
      }
    });
    this.store.dispatch({
      type: CallCenterActionTypes.INITIALIZATION, payload: {
        tabWorkOrders: true
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
    if (info.gridData && info.gridData.body && info.gridData.body.cells.length > 0) {
      /*if (this.storeData['otherParams']['otherVariables']['currentTab'] !== this.storeData['tabsTranslation'].tabAccounts) {
        this.storeData['formGroup'].main.controls['CmdViewEmployee'].enable();
      }*/
    }
  }

  public onGridRowClick(data: any): void {
    this.onGridCellClick(data);
    let formArray = this.getRowAdditionalData(data.trRowData, 0);
    if (data.cellIndex === 0) {
      if (this.storeData['otherParams'].otherVariables.WORunType === 'SOWO') {
        //iCABSCMWorkOrderMaintenance
        /*this.router.navigate([ContractManagementModuleRoutes.ICABSAACCOUNTMAINTENANCE], { queryParams: {
          parentMode: 'CallCentreSearch',
          accountNumber: this.storeData['otherParams'].otherVariables.AccountNumber
        }});*/
      } else if (this.storeData['otherParams'].otherVariables.WORunType === 'PLVC') {
        //iCABSAPlanVisitGridYear
        this.router.navigate([InternalGridSearchSalesModuleRoutes.ICABSAPLANVISITGRIDYEAR], {
          queryParams: {
            parentMode: 'ServiceVisitMaintenance',
            AccountNumber: this.storeData['otherParams'].otherVariables.AccountNumber,
            AccountName: this.storeData['formGroup'].tabAccounts.controls['AccountName'].value,
            ContractNumber: this.storeData['otherParams'].otherVariables.ContractNumber,
            ContractName: this.storeData['otherParams'].otherVariables.ContractName,
            IntervalShortFirstDate: formArray[7],
            IntervalLongFirstDate: formArray[8],
            PlanVisitRowId: formArray[2],
            ProductCode: this.storeData['otherParams'].otherVariables.ProductCode,
            ProductDesc: this.storeData['otherParams'].otherVariables.ProductDesc,
            ServiceCoverRowID: this.storeData['otherParams'].otherVariables.ServiceCoverRowID,
            PremiseNumber: this.storeData['otherParams'].otherVariables.PremiseNumber
          }
        });
      }
    } else if (data.cellIndex === 2) {
      let tabText = document.querySelector('#tabCont .nav-tabs li.active a span')['innerText'];
      let parentMode;
      if (tabText === this.storeData['tabsTranslation'].tabLogs || tabText === this.storeData['tabsTranslation'].tabWorkOrders) {
        parentMode = 'PassTechnician';
      } else {
        parentMode = 'CallCentreSearch';
      }
      // iCABSCMCallCentreGridEmployeeView
      this.router.navigate([InternalGridSearchApplicationModuleRoutes.ICABSCMCALLCENTERGRIDEMPLOYEEVIEW], {
        queryParams: {
          parentMode: parentMode,
          AccountNumber: this.storeData['otherParams'].otherVariables.AccountNumber,
          ContractNumber: this.storeData['otherParams'].otherVariables.ContractNumber,
          PremiseNumber: this.storeData['otherParams'].otherVariables.PremiseNumber,
          TechEmployeeCode: this.storeData['otherParams'].otherVariables.TechEmployeeCode,
          AccountProspectNumber: this.storeData['formGroup'].main.controls['AccountProspectNumber'].value,
          AccountProspectName: this.storeData['formGroup'].main.controls['AccountProspectName'].value,
          ContractName: this.storeData['otherParams'].otherVariables.ContractName,
          PremiseName: this.storeData['formGroup'].tabPremises.controls['PremiseName'].value,
          AccountProspectContactName: this.storeData['formGroup'].main.controls['AccountProspectContactName'].value,
          CurrentCallLogID: this.storeData['otherParams'].otherVariables.CurrentCallLogID
        }
      });
    }
    if (this.maxColumns === 10) {
      if (data.cellIndex === 5) {
        this.runContractMaintenance(data.cellData.text);
      } else if (data.cellIndex === 7) {
        this.runPremiseMaintenance(data.cellData.text);
      }
    } else if (this.maxColumns === 11) {
      if (data.cellIndex === 6) {
        this.runContractMaintenance(data.cellData.text);
      } else if (data.cellIndex === 8) {
        this.runPremiseMaintenance(data.cellData.text);
      }
      if (this.storeData['otherParams'].registry.glShowRecommendations) {
        if (this.storeData['otherParams'].otherVariables.WORecommendationsExist === 'Y') {
          // iCABSARecommendationGrid
          this.router.navigate([InternalGridSearchServiceModuleRoutes.ICABSARECOMMENDATIONGRID.URL_1], {
            queryParams: {
              parentMode: 'CallCentreSearch',
              AccountNumber: this.storeData['otherParams'].otherVariables.AccountNumber,
              ContractNumber: this.storeData['otherParams'].otherVariables.ContractNumber,
              ContractName: this.storeData['otherParams'].otherVariables.ContractName
            }
          });
        }
      }
    } else if (this.maxColumns === 12) {
      if (data.cellIndex === 7) {
        this.runContractMaintenance(data.cellData.text);
      } else if (data.cellIndex === 9) {
        this.runPremiseMaintenance(data.cellData.text);
      } else if (data.cellIndex === 6) {
        if (this.storeData['otherParams'].otherVariables.WORecommendationsExist === 'Y') {
          // iCABSARecommendationGrid
          this.router.navigate([InternalGridSearchServiceModuleRoutes.ICABSARECOMMENDATIONGRID.URL_1], {
            queryParams: {
              parentMode: 'CallCentreSearch',
              AccountNumber: this.storeData['otherParams'].otherVariables.AccountNumber,
              ContractNumber: this.storeData['otherParams'].otherVariables.ContractNumber,
              ContractName: this.storeData['otherParams'].otherVariables.ContractName
            }
          });
        }
      }
    }

  }

  public onGridCellClick(data: any): void {
    if (this.maxColumns === 10) {
      if (data.cellIndex === 0 || data.cellIndex === 1 || data.cellIndex === 5 || data.cellIndex === 7) {
        if (this.storeData['otherParams']['otherVariables']['currentTab'] !== this.storeData['tabsTranslation'].tabAccounts) {
          this.storeData['formGroup'].main.controls['CmdViewEmployee'].enable();
        }
      }
    } else if (this.maxColumns === 11) {
      if (data.cellIndex === 0 || data.cellIndex === 1 || data.cellIndex === 6 || data.cellIndex === 8) {
        if (this.storeData['otherParams']['otherVariables']['currentTab'] !== this.storeData['tabsTranslation'].tabAccounts) {
          this.storeData['formGroup'].main.controls['CmdViewEmployee'].enable();
        }
      }
    } else if (this.maxColumns === 12) {
      if (data.cellIndex === 0 || data.cellIndex === 1 || data.cellIndex === 7 || data.cellIndex === 9) {
        if (this.storeData['otherParams']['otherVariables']['currentTab'] !== this.storeData['tabsTranslation'].tabAccounts) {
          this.storeData['formGroup'].main.controls['CmdViewEmployee'].enable();
        }
      }
    }
    let formArray = this.getRowAdditionalData(data.trRowData, 0);
    this.storeData['otherParams'].otherVariables.WORunType = formArray[0];
    if (this.storeData['otherParams'].otherVariables.WORunType === 'SOWO') {
      this.storeData['otherParams'].otherVariables.WONumber = formArray[1];
    }
    if (this.storeData['otherParams'].otherVariables.WORunType === 'PLVC') {
      this.storeData['otherParams'].otherVariables.ProductCode = formArray[1];
      this.storeData['otherParams'].otherVariables.ServiceCoverRowID = formArray[2];
      this.storeData['otherParams'].otherVariables.ContractName = formArray[3];
      this.storeData['otherParams'].otherVariables.PremiseName = formArray[4];
      this.storeData['formGroup'].tabPremises.controls['PremiseName'].setValue(formArray[4]);
      this.storeData['otherParams'].otherVariables.ProductCode = formArray[5];
      this.storeData['otherParams'].otherVariables.ProductDesc = formArray[6];
      this.storeData['otherParams'].otherVariables.ServiceDateStartFrom = formArray[7];
      this.storeData['otherParams'].otherVariables.ServiceDateStartTo = formArray[8];
      this.storeData['otherParams'].otherVariables.WORecommendationsExist = formArray[9];
    }
    if (this.maxColumns === 10) {
      this.storeData['otherParams'].otherVariables.ContractNumber = data.trRowData[5].text;
      this.storeData['otherParams'].otherVariables.ContractROWID = data.trRowData[5].rowID;
      this.storeData['otherParams'].otherVariables.ContractType = data.trRowData[6].text;
      this.storeData['otherParams'].otherVariables.PremiseROWID = data.trRowData[7].rowID;
      this.storeData['otherParams'].otherVariables.PremiseNumber = data.trRowData[7].text;
      this.storeData['otherParams'].otherVariables.TechEmployeeCode = data.trRowData[2].additionalData;
    } else if (this.maxColumns === 11) {
      this.storeData['otherParams'].otherVariables.ContractNumber = data.trRowData[6].text;
      this.storeData['otherParams'].otherVariables.ContractROWID = data.trRowData[6].rowID;
      this.storeData['otherParams'].otherVariables.ContractType = data.trRowData[7].text;
      this.storeData['otherParams'].otherVariables.PremiseROWID = data.trRowData[8].rowID;
      this.storeData['otherParams'].otherVariables.PremiseNumber = data.trRowData[8].text;
      this.storeData['otherParams'].otherVariables.TechEmployeeCode = data.trRowData[2].additionalData;
    } else if (this.maxColumns === 12) {
      this.storeData['otherParams'].otherVariables.ContractNumber = data.trRowData[7].text;
      this.storeData['otherParams'].otherVariables.ContractROWID = data.trRowData[7].rowID;
      this.storeData['otherParams'].otherVariables.ContractType = data.trRowData[8].text;
      this.storeData['otherParams'].otherVariables.PremiseROWID = data.trRowData[9].rowID;
      this.storeData['otherParams'].otherVariables.PremiseNumber = data.trRowData[9].text;
      this.storeData['otherParams'].otherVariables.TechEmployeeCode = data.trRowData[2].additionalData;
    }
  }

  public getRowAdditionalData(gridData: any, pos: number): void {
    if (gridData[pos].additionalData) {
      return gridData[pos].additionalData.split('|');
    }
  }

  public runContractMaintenance(contractNumber: any): void {
    if (this.storeData['otherParams'].otherVariables.ContractLimitDataView === 'N') {
      if (this.storeData['otherParams'].otherVariables.CurrentCallLogID === '' && (this.storeData['formGroup'].main.controls['VisibleCurrentCallLogID'].value === '' || this.storeData['formGroup'].main.controls['VisibleCurrentCallLogID'].value === '0')) {
        /*let click = new CustomEvent('click', { bubbles: true });
        let elem = document.querySelector('#CmdNewCall');
        if (elem)
        this.renderer.invokeElementMethod(elem, 'click', [click]);*/
        this.storeData['subject']['CmdNewCallSent'].asObservable().subscribe((recieved) => {
          if (recieved['type'] === 'WorkOrders') {
            this.navigateToContract(contractNumber);
          }
          this.storeData['subject']['CmdNewCallSent'].unsubscribe();
        });
        this.storeData['subject']['CmdNewCallRecieved'].next({
          type: 'WorkOrders'
        });
      } else {
        this.navigateToContract(contractNumber);
      }
    } else {
      this.store.dispatch({
        type: CallCenterActionTypes.DISPLAY_ERROR, payload: this.storeData['otherParams'].registry['gcPermissionDeniedMessage']
      });
    }
  }

  public navigateToContract(contractNumber: any): void {
    if (this.storeData['otherParams'].otherVariables.ContractType === 'C') {
      this.router.navigate([ContractManagementModuleRoutes.ICABSACONTRACTMAINTENANCE], {
        queryParams: {
          parentMode: 'CallCentreSearch',
          ContractNumber: contractNumber
        }
      });
    } else if (this.storeData['otherParams'].otherVariables.ContractType === 'J') {
      this.router.navigate([ContractManagementModuleRoutes.ICABSAJOBMAINTENANCE], {
        queryParams: {
          parentMode: 'CallCentreSearch',
          ContractNumber: contractNumber
        }
      });
    } else if (this.storeData['otherParams'].otherVariables.ContractType === 'P') {
      this.router.navigate([ContractManagementModuleRoutes.ICABSAPRODUCTSALEMAINTENANCE], {
        queryParams: {
          parentMode: 'CallCentreSearch',
          ContractNumber: contractNumber
        }
      });
    }
  }

  public runPremiseMaintenance(premiseNumber: any): void {
    if (this.storeData['otherParams'].otherVariables.PremiseLimitDataView === 'N') {
      if (this.storeData['otherParams'].otherVariables.CurrentCallLogID === '' && (this.storeData['formGroup'].main.controls['VisibleCurrentCallLogID'].value === '' || this.storeData['formGroup'].main.controls['VisibleCurrentCallLogID'].value === '0')) {
        /*let click = new CustomEvent('click', { bubbles: true });
        let elem = document.querySelector('#CmdNewCall');
        if (elem)
        this.renderer.invokeElementMethod(elem, 'click', [click]);*/
        this.storeData['subject']['CmdNewCallSent'].asObservable().subscribe((recieved) => {
          if (recieved['type'] === 'WorkOrders') {
            /*this.router.navigate(['/contractmanagement/maintenance/contract'], { queryParams: {
              parentMode: 'CallCentreSearch',
              premiseNumber: premiseNumber,
              currentContractType: this.otherVariables.ContractType
            }});*/
            this.router.navigate([ContractManagementModuleRoutes.ICABSAPREMISEMAINTENANCE], {
              queryParams: {
                parentMode: 'CallCentreSearch',
                ContractNumber: this.storeData['otherParams'].otherVariables['ContractNumber'],
                AccountNumber: this.storeData['otherParams'].otherVariables['AccountNumber'],
                AccountName: this.storeData['formGroup'].tabAccounts.controls['AccountName'].value,
                PremiseNumber: premiseNumber,
                contractTypeCode: this.storeData['otherParams'].otherVariables.ContractType,
                CurrentCallLogID: this.storeData['formGroup'].main.controls['VisibleCurrentCallLogID'].value || this.storeData['otherParams'].otherVariables.CurrentCallLogID
              }
            });
          }
          this.storeData['subject']['CmdNewCallSent'].unsubscribe();
        });
        this.storeData['subject']['CmdNewCallRecieved'].next({
          type: 'WorkOrders'
        });
      } else {
        this.router.navigate([ContractManagementModuleRoutes.ICABSAPREMISEMAINTENANCE], {
          queryParams: {
            parentMode: 'CallCentreSearch',
            ContractNumber: this.storeData['otherParams'].otherVariables['ContractNumber'],
            AccountNumber: this.storeData['otherParams'].otherVariables['AccountNumber'],
            AccountName: this.storeData['formGroup'].tabAccounts.controls['AccountName'].value,
            PremiseNumber: premiseNumber,
            contractTypeCode: this.storeData['otherParams'].otherVariables.ContractType,
            CurrentCallLogID: this.storeData['formGroup'].main.controls['VisibleCurrentCallLogID'].value || this.storeData['otherParams'].otherVariables.CurrentCallLogID
          }
        });
      }
    } else {
      this.store.dispatch({
        type: CallCenterActionTypes.DISPLAY_ERROR, payload: this.storeData['otherParams'].registry['gcPermissionDeniedMessage']
      });
    }
  }
  public refresh(): void {
    this.storeData['formGroup'].main.controls['CmdViewEmployee'].disable();
    this.storeData['otherParams'].otherVariables.TechEmployeeCode = '';
    this.storeData['otherParams'].otherVariables.WORunType = '';
    this.fieldVisibility.FurtherRecords = false;
    this.loadGridView();
  }

  private setGridSettings(): void {
    this.maxColumns = 10;
    this.validateProperties = [
        {
            'type': MntConst.eTypeDate,
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
            'type': MntConst.eTypeDate,
            'index': 3,
            'align': 'center'
        },
        {
            'type': MntConst.eTypeImage,
            'index': 4,
            'align': 'center'
        }
    ];
    let additionalProperties: Array<any> = [];
    let aLength: number = 0;
    if (this.storeData['otherParams'].registry && (this.storeData['otherParams'].registry.glSCShowInfestations || this.storeData['otherParams'].registry.giNumBusinesses > 1)) {
      this.maxColumns++;
      additionalProperties = [
        {
            'type': MntConst.eTypeTextFree,
            'index': 5,
            'align': 'center'
        }
      ];
    }
    if (this.storeData['otherParams'].registry && this.storeData['otherParams'].registry.glShowRecommendations) {
      this.maxColumns++;
      if (additionalProperties.length > 0) {
        additionalProperties = additionalProperties.concat([
          {
              'type': MntConst.eTypeTextFree,
              'index': 6,
              'align': 'center'
          }
        ]);
      } else {
        additionalProperties = [
          {
              'type': MntConst.eTypeImage,
              'index': 5,
              'align': 'center'
          }
        ];
      }
    }
    aLength = additionalProperties.length;
    additionalProperties.concat([
        {
            'type': MntConst.eTypeTextFree,
            'index': (5 + aLength),
            'align': 'center'
        },
        {
            'type': MntConst.eTypeTextFree,
            'index': (6 + aLength),
            'align': 'center'
        },
        {
            'type': MntConst.eTypeTextFree,
            'index': (7 + aLength),
            'align': 'center'
        },
        {
            'type': MntConst.eTypeTextFree,
            'index': (8 + aLength),
            'align': 'center'
        },
        {
            'type': MntConst.eTypeTextFree,
            'index': (9 + aLength),
            'align': 'center'
        }
    ]);
    this.setGridHeaders();
  }

  private setGridHeaders(): void {
    if (this.maxColumns === 10) {
      this.gridSortHeaders = [
        {
          'fieldName': 'WOWODate',
          'index': 0,
          'sortType': 'ASC'
        },
        {
          'fieldName': 'WOVisitTimes',
          'index': 1,
          'sortType': 'ASC'
        },
        {
          'fieldName': 'WOEmployeeName',
          'index': 2,
          'sortType': 'ASC'
        },
        {
          'fieldName': 'WOWOActualDate',
          'index': 3,
          'sortType': 'ASC'
        },
        {
          'fieldName': 'WOContractNumber',
          'index': 5,
          'sortType': 'ASC'
        },
        {
          'fieldName': 'WOContractTypeCode',
          'index': 6,
          'sortType': 'ASC'
        },
        {
          'fieldName': 'WOPremiseNumber',
          'index': 7,
          'sortType': 'ASC'
        },
        {
          'fieldName': 'WOWOTypeDesc',
          'index': 8,
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
          'index': 1
        },
        {
          'align': 'center',
          'width': '250px',
          'index': 2
        },
        {
          'align': 'center',
          'width': '120px',
          'index': 5
        },
        {
          'align': 'center',
          'width': '60px',
          'index': 7
        }
      ];
    } else if (this.maxColumns === 11) {
      this.gridSortHeaders = [
        {
          'fieldName': 'WOWODate',
          'index': 0,
          'sortType': 'ASC'
        },
        {
          'fieldName': 'WOVisitTimes',
          'index': 1,
          'sortType': 'ASC'
        },
        {
          'fieldName': 'WOEmployeeName',
          'index': 2,
          'sortType': 'ASC'
        },
        {
          'fieldName': 'WOWOActualDate',
          'index': 3,
          'sortType': 'ASC'
        },
        {
          'fieldName': 'WOContractNumber',
          'index': 6,
          'sortType': 'ASC'
        },
        {
          'fieldName': 'WOContractTypeCode',
          'index': 7,
          'sortType': 'ASC'
        },
        {
          'fieldName': 'WOPremiseNumber',
          'index': 8,
          'sortType': 'ASC'
        },
        {
          'fieldName': 'WOWOTypeDesc',
          'index': 9,
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
          'index': 1
        },
        {
          'align': 'center',
          'width': '250px',
          'index': 2
        },
        {
          'align': 'center',
          'width': '120px',
          'index': 6
        },
        {
          'align': 'center',
          'width': '60px',
          'index': 8
        }
      ];
    } else if (this.maxColumns === 12) {
      this.gridSortHeaders = [
        {
          'fieldName': 'WOWODate',
          'index': 0,
          'sortType': 'ASC'
        },
        {
          'fieldName': 'WOVisitTimes',
          'index': 1,
          'sortType': 'ASC'
        },
        {
          'fieldName': 'WOEmployeeName',
          'index': 2,
          'sortType': 'ASC'
        },
        {
          'fieldName': 'WOWOActualDate',
          'index': 3,
          'sortType': 'ASC'
        },
        {
          'fieldName': 'WOContractNumber',
          'index': 7,
          'sortType': 'ASC'
        },
        {
          'fieldName': 'WOContractTypeCode',
          'index': 8,
          'sortType': 'ASC'
        },
        {
          'fieldName': 'WOPremiseNumber',
          'index': 9,
          'sortType': 'ASC'
        },
        {
          'fieldName': 'WOWOTypeDesc',
          'index': 10,
          'sortType': 'ASC'
        }
      ];
    }
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
    this.search.set('GridName', 'WorkOrder');
    this.search.set('AccountNumber', this.utils.checkIfValueExistAndReturn(this.storeData['otherParams'].otherVariables, 'AccountNumber'));
    this.search.set('ProspectNumber', this.utils.checkIfValueExistAndReturn(this.storeData['otherParams'].otherVariables, 'ProspectNumber'));
    this.search.set('ContractNumber', this.utils.checkIfValueExistAndReturn(this.storeData['otherParams'].otherVariables, 'WOSelectedContract'));
    this.search.set('PremiseNumber', this.utils.checkIfValueExistAndReturn(this.storeData['otherParams'].otherVariables, 'WOSelectedPremise'));
    this.search.set('WorkOrderType', this.formGroup.controls['WorkOrderType'] ? this.formGroup.controls['WorkOrderType'].value : '');
    this.search.set('WOFromDate', this.formGroup.controls['WOFromDate'].value);
    this.search.set('WOToDate', this.formGroup.controls['WOToDate'].value);
    this.search.set('riSortOrder', this.sortType);
    this.search.set('riGridMode', '0');
    this.search.set('riGridHandle', (Math.floor(Math.random() * 900000) + 100000).toString());
    this.search.set('HeaderClickedColumn', this.headerClicked);
    this.search.set('PageSize', this.pageSize.toString());
    this.search.set('PageCurrent', this.currentPage.toString());
    this.inputParams.search = this.search;
    this.workGrid.loadGridData(this.inputParams);
    this.storeData['pagination'].tabWorkOrders = this.currentPage;
  }

  public cmdWOClearSelectedOnClick(event: any): void {
    if (this.storeData['otherParams'].otherVariables.WOSelectedContract !== '' && this.storeData['otherParams'].otherVariables.WOSelectedPremise !== '') {
      this.storeData['otherParams'].otherVariables.WOSelectedPremise = '';
      this.formGroup.controls['WOSelectedContractPremise'].setValue(this.storeData['otherParams'].otherVariables.WOSelectedContract);
      this.loadGridView();
      this.store.dispatch({
        type: CallCenterActionTypes.BUILD_SPECIFIC_GRID, payload: ['DlContract']
      });
    } else if (this.storeData['otherParams'].otherVariables.WOSelectedContract !== '') {
      this.storeData['otherParams'].otherVariables.WOSelectedPremise = '';
      this.storeData['otherParams'].otherVariables.WOSelectedContract = '';
      this.formGroup.controls['WOSelectedContractPremise'].setValue('');
      this.loadGridView();
      this.store.dispatch({
        type: CallCenterActionTypes.BUILD_SPECIFIC_GRID, payload: ['DlContract']
      });
    }
  }

  public wOFromDateSelectedValue(value: Object): void {
    if (value && value['value']) {
      let prev = this.wOFromDateDisplay;
      this.wOFromDateDisplay = value['value'];
      this.formGroup.controls['WOFromDate'].setValue(this.wOFromDateDisplay);
      if (this.initComplete && this.storeData['allowAjaxOnDateChange'] && prev !== value['value'])
        this.loadGridView();
    } else {
      this.wOFromDateDisplay = '';
      this.formGroup.controls['WOFromDate'].setValue('');
    }
  }

  public wOToDateSelectedValue(value: Object): void {
    if (value && value['value']) {
      let prev = this.wOToDateDisplay;
      this.wOToDateDisplay = value['value'];
      this.formGroup.controls['WOToDate'].setValue(this.wOToDateDisplay);
      if (this.initComplete && this.storeData['allowAjaxOnDateChange'] && prev !== value['value'])
        this.loadGridView();
    } else {
      this.wOToDateDisplay = '';
      this.formGroup.controls['WOToDate'].setValue('');
    }
  }

  private resetDate(): void {
    let date = new Date();
    this.dateObjects.WOFromDate = new Date(date.setDate(date.getDate() - this.storeData['otherParams'].registry.giWOFromDays));
    date = new Date();
    this.dateObjects.WOToDate = new Date(date.setDate(date.getDate() + this.storeData['otherParams'].registry.giWOToDays));
  }

  public fetchTranslationContent(): void {
    // translation content
  }
}
