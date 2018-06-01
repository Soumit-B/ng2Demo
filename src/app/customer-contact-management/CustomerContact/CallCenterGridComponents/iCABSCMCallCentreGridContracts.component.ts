import { Component, NgZone, OnInit, OnDestroy, ViewChild, AfterViewInit, Renderer } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { URLSearchParams } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
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
import { ContractManagementModuleRoutes, InternalGridSearchServiceModuleRoutes, InternalMaintenanceServiceModuleRoutes } from './../../../base/PageRoutes';

@Component({
  selector: 'icabs-call-center-grid-contracts',
  templateUrl: 'iCABSCMCallCentreGridContracts.html'
})

export class CallCenterGridContractsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('contractsGrid') contractsGrid: GridComponent;
  public formGroup: FormGroup;
  public fieldVisibility: any = {
    ContractSearchOn: true,
    ContractSearchValue: true,
    ContractCommenceDateFrom: false,
    ContractCommenceDateTo: false,
    ContractStatusCode: true,
    ContractTypeCode: true,
    CmdContractClearSearch: true,
    FurtherRecords: false
  };
  public dropdownList: any = {
    ContractSearchOn: [
      { value: 'ClientRef', desc: 'Client Reference' },
      { value: 'ContractNo', desc: 'Contract Number' },
      { value: 'InvoiceNumber', desc: 'Invoice Number' },
      { value: 'Name', desc: 'Name' },
      { value: 'PurchaseOrderNo', desc: 'Purchase Order No' },
      { value: 'CompanyVATNumber', desc: 'Tax Registration No' },
      { value: 'ContractCommenceDate', desc: 'Commence Date' }
    ],
    ContractStatusCode: [
      { value: '', desc: '' }
    ],
    ContractTypeCode: [
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
  public contractCommenceFromDateDisplay: string = '';
  public contractCommenceToDateDisplay: string = '';
  public dateObjectsEnabled: any = {
    ContractCommenceDateFrom: true,
    ContractCommenceDateTo: true
  };
  public dateObjects: any = {
    ContractCommenceDateFrom: new Date(),
    ContractCommenceDateTo: new Date()
  };
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
      ContractSearchOn: [{ value: 'all', disabled: false }],
      ContractSearchValue: [{ value: '', disabled: false }],
      ContractCommenceFromDate: [{ value: '', disabled: false }],
      ContractCommenceToDate: [{ value: '', disabled: false }],
      ContractStatusCode: [{ value: '', disabled: false }],
      ContractTypeCode: [{ value: '', disabled: false }],
      CmdContractClearSearch: [{ disabled: false }]
    });
  }

  ngOnInit(): void {
    this.dropdownList.ContractSearchOn.sort(function (a: any, b: any): any { return (a.desc > b.desc) ? 1 : ((b.desc > a.desc) ? -1 : 0); });
    this.storeSubscription = this.store.select('callcentresearch').subscribe(data => {
      this.storeData = data;
      if (this.storeData['fieldVisibility'] && this.storeData['fieldVisibility'].tabContracts) {
        this.fieldVisibility = this.storeData['fieldVisibility'].tabContracts;
      }
      if (this.storeData['dropdownList'] && this.storeData['dropdownList'].tabContracts) {
        this.dropdownList = this.storeData['dropdownList'].tabContracts;
      }
      if (this.storeData['dateObjects'] && this.storeData['dateObjects'].tabContracts) {
        this.dateObjects = this.storeData['dateObjects'].tabContracts;
      }
      if (this.storeData['dateVisibility'] && this.storeData['dateVisibility'].tabContracts) {
        this.dateObjectsEnabled = this.storeData['dateVisibility'].tabContracts;
      }
      if (data && data['action']) {
        switch (data['action']) {
          case CallCenterActionTypes.BUILD_SPECIFIC_GRID:
            if (this.storeData['gridToBuild'].indexOf('Contracts') > -1) {
              if (this.storeData['gridToBuild'].length === 1) {
                this.storeData['gridToBuild'] = [];
              }
              this.loadGridView();
            }
            break;
          case CallCenterActionTypes.CLEAR_SPECIFIC_GRID:
            if (this.storeData['gridToClear'].indexOf('Contracts') > -1) {
              this.contractsGrid.clearGridData();
            }
            this.contractSearchOnChange({});
            break;
          case CallCenterActionTypes.SET_PAGINATION:
            if (this.storeData['storeSavedData']['pagination']) {
              this.currentPage = this.storeData['storeSavedData']['pagination'].tabContracts;
            }
            break;
          default:
            break;
        }
      }
      this.contractSearchOnChange({});
    });
  }

  ngAfterViewInit(): void {
    this.store.dispatch({
      type: CallCenterActionTypes.FORM_GROUP, payload: {
        tabContracts: this.formGroup
      }
    });
    this.store.dispatch({
      type: CallCenterActionTypes.SAVE_DROPDOWN_LIST, payload: {
        tabContracts: this.dropdownList
      }
    });
    this.store.dispatch({
      type: CallCenterActionTypes.SAVE_DATE_VISIBILITY, payload: {
        tabContracts: this.dateObjectsEnabled
      }
    });
    this.store.dispatch({
      type: CallCenterActionTypes.SAVE_DATE_OBJECTS, payload: {
        tabContracts: this.dateObjects
      }
    });
    this.store.dispatch({
      type: CallCenterActionTypes.SAVE_VISIBILITY_FIELD, payload: {
        tabContracts: this.fieldVisibility
      }
    });
    this.store.dispatch({
      type: CallCenterActionTypes.INITIALIZATION, payload: {
        tabContracts: true
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
    if (info.gridData && info.gridData.body && info.gridData.body.cells.length > 0) {
      /*this.onGridCellClick({
        trRowData: info.gridData.body.cells.slice(0, this.maxColumns),
        cellIndex: 0
      });*/
      /*if (this.storeData['otherParams']['otherVariables']['currentTab'] !== this.storeData['tabsTranslation'].tabAccounts) {
        this.storeData['formGroup'].main.controls['CmdViewEmployee'].enable();
      }*/
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
          this.renderer.invokeElementMethod(elem, 'click', [click]);
          elem = null;*/
          this.storeData['subject']['CmdNewCallSent'].asObservable().subscribe((recieved) => {
            if (recieved['type'] === 'Contracts') {
              if (this.storeData['otherParams'].otherVariables.ContractType === 'C') {
                this.router.navigate([ContractManagementModuleRoutes.ICABSACONTRACTMAINTENANCE], {
                  queryParams: {
                    parentMode: 'CallCentreSearch',
                    ContractNumber: data.trRowData[0].text || this.storeData['otherParams'].otherVariables.ContractNumber,
                    CurrentCallLogID: this.storeData['otherParams'].otherVariables.CurrentCallLogID
                  }
                });
              } else if (this.storeData['otherParams'].otherVariables.ContractType === 'J') {
                this.router.navigate([ContractManagementModuleRoutes.ICABSAJOBMAINTENANCE], {
                  queryParams: {
                    parentMode: 'CallCentreSearch',
                    ContractNumber: data.trRowData[0].text || this.storeData['otherParams'].otherVariables.ContractNumber,
                    CurrentCallLogID: this.storeData['otherParams'].otherVariables.CurrentCallLogID
                  }
                });
              } else if (this.storeData['otherParams'].otherVariables.ContractType === 'P') {
                this.router.navigate([ContractManagementModuleRoutes.ICABSAPRODUCTSALEMAINTENANCE], {
                  queryParams: {
                    parentMode: 'CallCentreSearch',
                    ContractNumber: data.trRowData[0].text || this.storeData['otherParams'].otherVariables.ContractNumber,
                    CurrentCallLogID: this.storeData['otherParams'].otherVariables.CurrentCallLogID
                  }
                });
              }
            }
            this.storeData['subject']['CmdNewCallSent'].unsubscribe();
          });
          this.storeData['subject']['CmdNewCallRecieved'].next({
            type: 'Contracts'
          });
        } else {
          if (this.storeData['otherParams'].otherVariables.ContractType === 'C') {
            this.router.navigate([ContractManagementModuleRoutes.ICABSACONTRACTMAINTENANCE], {
              queryParams: {
                parentMode: 'CallCentreSearch',
                ContractNumber: data.trRowData[0].text || this.storeData['otherParams'].otherVariables.ContractNumber
              }
            });
          } else if (this.storeData['otherParams'].otherVariables.ContractType === 'J') {
            this.router.navigate([ContractManagementModuleRoutes.ICABSAJOBMAINTENANCE], {
              queryParams: {
                parentMode: 'CallCentreSearch',
                ContractNumber: data.trRowData[0].text || this.storeData['otherParams'].otherVariables.ContractNumber
              }
            });
          } else if (this.storeData['otherParams'].otherVariables.ContractType === 'P') {
            this.router.navigate([ContractManagementModuleRoutes.ICABSAPRODUCTSALEMAINTENANCE], {
              queryParams: {
                parentMode: 'CallCentreSearch',
                ContractNumber: data.trRowData[0].text || this.storeData['otherParams'].otherVariables.ContractNumber
              }
            });
          }
        }
      } else {
        this.store.dispatch({
          type: CallCenterActionTypes.DISPLAY_ERROR, payload: this.storeData['otherParams'].registry['gcPermissionDeniedMessage']
        });
      }
    }

    if ((this.maxColumns === 12 && data.cellIndex === 10) || (this.maxColumns === 13 && data.cellIndex === 11)) {
      if (this.storeData['otherParams'].otherVariables.CurrentCallLogID === '' && (this.storeData['formGroup'].main.controls['VisibleCurrentCallLogID'].value === '' || this.storeData['formGroup'].main.controls['VisibleCurrentCallLogID'].value === null)) {
        this.fetchCallCentreDataPost('NewCall', {}, { BusinessCode: this.storeData['code'].business }).subscribe((e) => {
          if (!e['errorMessage']) {
            this.storeData['otherParams'].otherVariables.CurrentCallLogID = e.CallLogID;
            // iCABSCMTelesalesEntry
            this.router.navigate([InternalMaintenanceServiceModuleRoutes.ICABSCMTELESALESENTRY], {
              queryParams: {
                parentMode: 'ContractTeleSalesOrder',
                ContractNumber: data.trRowData[0].text || this.storeData['otherParams'].otherVariables.ContractNumber,
                CurrentCallLogID: e.CallLogID
              }
            });
          }
        });
      } else {
        this.router.navigate([InternalMaintenanceServiceModuleRoutes.ICABSCMTELESALESENTRY], {
          queryParams: {
            parentMode: 'ContractTeleSalesOrder',
            ContractNumber: data.trRowData[0].text || this.storeData['otherParams'].otherVariables.ContractNumber,
            CurrentCallLogID: this.storeData['formGroup'].main.controls['VisibleCurrentCallLogID'].value
          }
        });
      }
    }

    if ((this.maxColumns === 12 && data.cellIndex === 11) || (this.maxColumns === 13 && data.cellIndex === 12)) {
      // iCABSACustomerInformationSummary
      this.router.navigate([InternalGridSearchServiceModuleRoutes.ICABSACUSTOMERINFORMATIONSUMMARY.URL_1], {
        queryParams: {
          parentMode: 'Contract',
          ContractNumber: data.trRowData[0].text || this.storeData['otherParams'].otherVariables.ContractNumber
        }
      });
    }
  }


  public onGridCellClick(data: any): void {
    if ((this.maxColumns === 12 && (data.cellIndex === 0 || data.cellIndex === 10 || data.cellIndex === 11)) || (this.maxColumns === 13 && (data.cellIndex === 0 || data.cellIndex === 11 || data.cellIndex === 12))) {
      if (this.storeData['otherParams']['otherVariables']['currentTab'] !== this.storeData['tabsTranslation'].tabAccounts) {
        this.storeData['formGroup'].main.controls['CmdViewEmployee'].enable();
      }
      this.setTabRefresh();
      this.storeData['formGroup'].main.controls['CmdViewEmployee'].enable();
      let formArray = this.getRowAdditionalData(data.trRowData, 0);
      this.storeData['otherParams'].otherVariables.PremiseNumber = formArray[0];
      this.storeData['formGroup'].tabPremises.controls['PremiseName'].setValue(formArray[1]);
      //this.storeData['otherParams'].otherVariables.PremiseName = formArray[1];
      this.storeData['otherParams'].otherVariables.ProductCode = formArray[3];
      this.storeData['otherParams'].otherVariables.ProductDesc = formArray[4];
      this.storeData['otherParams'].otherVariables.ServiceCoverNumber = formArray[5];
      this.storeData['otherParams'].otherVariables.ServiceCoverROWID = formArray[6];
      this.storeData['otherParams'].otherVariables.ContractContactEmail = formArray[7];
      this.storeData['otherParams'].otherVariables.ContractLimitDataView = formArray[8];

      this.storeData['otherParams'].otherVariables.ContractNumber = data.trRowData[0].text;
      this.storeData['otherParams'].otherVariables.ContractName = data.trRowData[2].text;
      this.storeData['otherParams'].otherVariables.ContractROWID = data.trRowData[0].rowID;
      this.storeData['otherParams'].otherVariables.ContractType = data.trRowData[1].text;

      this.storeData['formGroup'].tabPremises.controls['PremSelectedContract'].setValue(this.storeData['otherParams'].otherVariables.ContractNumber);
      this.storeData['otherParams'].otherVariables.InvSelectedContract = this.storeData['otherParams'].otherVariables.ContractNumber;
      this.storeData['otherParams'].otherVariables.InvSelectedPremise = '';
      this.storeData['formGroup'].tabInvoices.controls['InvSelectedContractPremise'].setValue(this.storeData['otherParams'].otherVariables.ContractNumber);
      this.storeData['otherParams'].otherVariables.WOSelectedContract = this.storeData['otherParams'].otherVariables.ContractNumber;
      this.storeData['otherParams'].otherVariables.WOSelectedPremise = '';
      this.storeData['formGroup'].tabWorkOrders.controls['WOSelectedContractPremise'].setValue(this.storeData['otherParams'].otherVariables.ContractNumber);
      this.storeData['formGroup'].tabPremises.controls['PremiseSearchOn'].setValue('all');
      let change = new CustomEvent('change', { bubbles: true });
      let elem = document.querySelector('#PremiseSearchOn');
      if (elem) {
        this.renderer.invokeElementMethod(elem, 'dispatchEvent', [change]);
        elem = null;
      }
      this.storeData['formGroup'].tabPremises.controls['PremiseStatusCode'].setValue(this.formGroup.controls['ContractStatusCode'].value);
      this.storeData['formGroup'].tabPremises.controls['PremiseContractTypeCode'].setValue(this.formGroup.controls['ContractTypeCode'].value);
      this.storeData['otherParams'].otherVariables.HistorySelectedContract = this.storeData['otherParams'].otherVariables.ContractNumber;
      this.storeData['otherParams'].otherVariables.HistorySelectedPremise = '';
      this.storeData['formGroup'].tabHistory.controls['HistorySelectedContractPremise'].setValue(this.storeData['otherParams'].otherVariables.ContractNumber);
      this.storeData['otherParams'].otherVariables.EventHistorySelectedContract = this.storeData['otherParams'].otherVariables.ContractNumber;
      this.storeData['otherParams'].otherVariables.EventHistorySelectedPremise = '';
      this.storeData['formGroup'].tabEventHistory.controls['EventHistorySelectedContractPremise'].setValue(this.storeData['otherParams'].otherVariables.ContractNumber);
      this.storeData['otherParams'].otherVariables.CallLogSelectedContract = this.storeData['otherParams'].otherVariables.ContractNumber;
      this.storeData['otherParams'].otherVariables.CallLogSelectedPremise = '';
      this.storeData['formGroup'].tabLogs.controls['CallLogSelectedContractPremise'].setValue(this.storeData['otherParams'].otherVariables.ContractNumber);
      //this.storeData['formGroup'].main.controls['CmdViewEmployee'].disable();
      /*this.store.dispatch({
        type: CallCenterActionTypes.BUILD_SPECIFIC_GRID, payload: ['Premises']
      });*/
      this.storeData['gridToBuild'] = [];
      this.storeData['action'] = '';
    }
  }

  public setTabRefresh(): void {
    this.storeData['refresh'].tabLogs = true;
    this.storeData['refresh'].tabDashboard = true;
    this.storeData['refresh'].tabDlContract = true;
    this.storeData['refresh'].tabEventHistory = true;
    this.storeData['refresh'].tabHistory = true;
    this.storeData['refresh'].tabInvoices = true;
    this.storeData['refresh'].tabPremises = true;
    this.storeData['refresh'].tabWorkOrders = true;
  }

  public getRowAdditionalData(gridData: any, pos: number): void {
    if (gridData[pos].additionalData) {
      return gridData[pos].additionalData.split('|');
    }
  }

  public fetchCallCentreDataPost(functionName: string, params: Object, formData: Object): any {
    let queryCallCentre = new URLSearchParams();
    let businessCode = (this.storeData['code'] && this.storeData['code'].business) ? this.storeData['code'].business : this.utils.getBusinessCode();
    let countryCode = (this.storeData['code'] && this.storeData['code'].country) ? this.storeData['code'].country : this.utils.getCountryCode();
    queryCallCentre.set(this.serviceConstants.BusinessCode, businessCode);
    queryCallCentre.set(this.serviceConstants.CountryCode, countryCode);
    if (functionName !== '') {
      queryCallCentre.set(this.serviceConstants.Action, '6');
      queryCallCentre.set('Function', functionName);
    }
    for (let key in params) {
      if (key) {
        queryCallCentre.set(key, params[key]);
      }
    }
    return this.httpService.makePostRequest(this.queryGrid.method, this.queryGrid.module, this.queryGrid.operation, queryCallCentre, formData);
  }

  public refresh(): void {
    this.fieldVisibility.CallLogsForm = false;
    this.storeData['formGroup'].main.controls['CmdViewEmployee'].disable();
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
            'type': MntConst.eTypeDate,
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
            'type': MntConst.eTypeInteger,
            'index': 6,
            'align': 'center'
        },
        {
            'type': MntConst.eTypeCurrency,
            'index': 7,
            'align': 'center'
        },
        {
            'type': MntConst.eTypeTextFree,
            'index': 8,
            'align': 'center'
        }
    ];
    let additionalProperties: Array<any> = [];
    if (this.storeData['otherParams'].webSpeedVariables && this.storeData['otherParams'].webSpeedVariables.cIsPropertyCareBranch === 'Y') {
      this.maxColumns = 13;
      additionalProperties = [
        {
            'type': MntConst.eTypeImage,
            'index': 9,
            'align': 'center'
        },
        {
            'type': MntConst.eTypeTextFree,
            'index': 10,
            'align': 'center'
        },
        {
            'type': MntConst.eTypeImage,
            'index': 11,
            'align': 'center'
        },
        {
            'type': MntConst.eTypeImage,
            'index': 12,
            'align': 'center'
        }
      ];
    } else {
      this.maxColumns = 12;
      additionalProperties = [
        {
            'type': MntConst.eTypeTextFree,
            'index': 9,
            'align': 'center'
        },
        {
            'type': MntConst.eTypeImage,
            'index': 10,
            'align': 'center'
        },
        {
            'type': MntConst.eTypeImage,
            'index': 11,
            'align': 'center'
        }
      ];
    }
    this.validateProperties = this.validateProperties.concat(additionalProperties);
    this.setGridHeaders();
  }

  private setGridHeaders(): void {
    if (this.storeData['otherParams'].webSpeedVariables && this.storeData['otherParams'].webSpeedVariables.cIsPropertyCareBranch === 'Y') {
      this.gridSortHeaders = [
        {
          'fieldName': 'ConContractNumber',
          'index': 0,
          'sortType': 'ASC'
        },
        {
          'fieldName': 'ConContractType',
          'index': 1,
          'sortType': 'ASC'
        },
        {
          'fieldName': 'ConContractName',
          'index': 2,
          'sortType': 'ASC'
        },
        {
          'fieldName': 'ConCommenceDate',
          'index': 3,
          'sortType': 'ASC'
        },
        {
          'fieldName': 'ConExpiryDate',
          'index': 4,
          'sortType': 'ASC'
        },
        {
          'fieldName': 'ConAnnivDate',
          'index': 5,
          'sortType': 'ASC'
        },
        {
          'fieldName': 'ConInvFreq',
          'index': 6,
          'sortType': 'ASC'
        },
        {
          'fieldName': 'ConValue',
          'index': 7,
          'sortType': 'ASC'
        },
        {
          'fieldName': 'ConStatus',
          'index': 8,
          'sortType': 'ASC'
        },
        {
          'fieldName': 'ConReference',
          'index': 10,
          'sortType': 'ASC'
        }
      ];
      this.headerProperties = [
        {
          'align': 'center',
          'width': '120px',
          'index': 0
        }
      ];
      for (let k = 0; k < this.gridSortHeaders.length; k++) {
        if (this.gridSortHeaders[k].fieldName === this.headerClicked) {
          this.gridSortHeaders[k].sortType = this.sortType === 'Descending' ? 'DESC' : 'ASC';
        }
      }
    } else {
      this.gridSortHeaders = [
        {
          'fieldName': 'ConContractNumber',
          'index': 0,
          'sortType': 'ASC'
        },
        {
          'fieldName': 'ConContractType',
          'index': 1,
          'sortType': 'ASC'
        },
        {
          'fieldName': 'ConContractName',
          'index': 2,
          'sortType': 'ASC'
        },
        {
          'fieldName': 'ConCommenceDate',
          'index': 3,
          'sortType': 'ASC'
        },
        {
          'fieldName': 'ConExpiryDate',
          'index': 4,
          'sortType': 'ASC'
        },
        {
          'fieldName': 'ConAnnivDate',
          'index': 5,
          'sortType': 'ASC'
        },
        {
          'fieldName': 'ConInvFreq',
          'index': 6,
          'sortType': 'ASC'
        },
        {
          'fieldName': 'ConValue',
          'index': 7,
          'sortType': 'ASC'
        },
        {
          'fieldName': 'ConStatus',
          'index': 8,
          'sortType': 'ASC'
        },
        {
          'fieldName': 'ConReference',
          'index': 9,
          'sortType': 'ASC'
        }
      ];
      this.headerProperties = [
        {
          'align': 'center',
          'width': '120px',
          'index': 0
        }
      ];
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
    this.search.set('GridName', 'Contract');
    this.search.set('AccountNumber', this.utils.checkIfValueExistAndReturn(this.storeData['otherParams'].otherVariables, 'AccountNumber'));
    this.search.set('ProspectNumber', this.utils.checkIfValueExistAndReturn(this.storeData['otherParams'].otherVariables, 'ProspectNumber'));
    this.search.set('ContractTypeCode', this.formGroup.controls['ContractTypeCode'].value);
    this.search.set('IsPropertyCareBranch', this.storeData['otherParams'].webSpeedVariables ? this.storeData['otherParams'].webSpeedVariables.cIsPropertyCareBranch : '');
    this.search.set('SearchOn', this.formGroup.controls['ContractSearchOn'].value);
    this.search.set('SearchValue', this.formGroup.controls['ContractSearchValue'].value);
    this.search.set('PortfolioStatus', this.formGroup.controls['ContractStatusCode'].value);
    this.search.set('ContractCommenceDateFrom', this.fieldVisibility.ContractCommenceDateFrom ? this.formGroup.controls['ContractCommenceFromDate'].value : '');
    this.search.set('ContractCommenceDateTo', this.fieldVisibility.ContractCommenceDateTo ? this.formGroup.controls['ContractCommenceToDate'].value : '');
    this.search.set('riSortOrder', this.sortType);
    this.search.set('riGridMode', '0');
    this.search.set('riGridHandle', (Math.floor(Math.random() * 900000) + 100000).toString());
    this.search.set('HeaderClickedColumn', this.headerClicked);
    this.search.set('PageSize', this.pageSize.toString());
    this.search.set('PageCurrent', this.currentPage.toString());
    this.inputParams.search = this.search;
    this.contractsGrid.loadGridData(this.inputParams);
    this.storeData['pagination'].tabContracts = this.currentPage;
  }

  public fetchTranslationContent(): void {
    // translation content
  }

  public contractSearchOnChange(event: any): void {
    if (this.formGroup.controls['ContractSearchOn'].value === 'all') {
      this.fieldVisibility.ContractSearchValue = true;
      this.formGroup.controls['ContractSearchValue'].disable();
      this.formGroup.controls['ContractSearchValue'].setValue('');
      this.fieldVisibility.ContractCommenceDateFrom = false;
      this.fieldVisibility.ContractCommenceDateTo = false;
    } else if (this.formGroup.controls['ContractSearchOn'].value === 'ContractCommenceDate') {
      this.fieldVisibility.ContractSearchValue = false;
      this.fieldVisibility.ContractCommenceDateFrom = true;
      this.fieldVisibility.ContractCommenceDateTo = true;
      setTimeout(() => {
        let date = new Date();
        this.dateObjects.ContractCommenceDateFrom = new Date(date.setDate(date.getDate() - this.storeData['otherParams'].registry.giContractCommenceFromDays));
        date = new Date();
        this.dateObjects.ContractCommenceDateTo = new Date(date.setDate(date.getDate() + this.storeData['otherParams'].registry.giContractCommenceToDays));
      }, 0);
    } else {
      this.fieldVisibility.ContractSearchValue = true;
      this.formGroup.controls['ContractSearchValue'].enable();
      this.fieldVisibility.ContractCommenceDateFrom = false;
      this.fieldVisibility.ContractCommenceDateTo = false;
    }
    let tabText = document.querySelector('#tabCont .nav-tabs li.active a span');
    if (tabText) {
      tabText = tabText['innerText'];
      if (tabText === this.storeData['tabsTranslation'].tabContracts) {
        let focus = new CustomEvent('focus', { bubbles: true });
        setTimeout(() => {
          let elem = document.querySelector('#ContractSearchValue');
          if (elem !== null)
            this.renderer.invokeElementMethod(elem, 'focus', [focus]);
          elem = null;
        }, 0);
      }
    }
  }

  public contractSearchOnKeyDown(event: any): void {
    if (event.keyCode === 13) {
      this.loadGridView();
    }
  }

  public contractSearchValueOnKeyDown(event: any): void {
    if (event.keyCode === 13) {
      this.loadGridView();
    }
  }

  public contractStatusCodeOnKeyDown(event: any): void {
    if (event.keyCode === 13) {
      this.loadGridView();
    }
  }

  public contractTypeCodeOnKeyDown(event: any): void {
    if (event.keyCode === 13) {
      this.loadGridView();
    }
  }

  public contractStatusCodeOnChange(event: any): void {
    this.storeData['formGroup'].tabPremises.controls['PremiseStatusCode'].setValue(this.formGroup.controls['ContractStatusCode'].value);
  }

  public contractTypeCodeOnChange(event: any): void {
    this.storeData['formGroup'].tabPremises.controls['PremiseContractTypeCode'].setValue(this.formGroup.controls['ContractTypeCode'].value);
    this.storeData['formGroup'].tabInvoices.controls['InvoiceContractTypeCode'].setValue(this.formGroup.controls['ContractTypeCode'].value);
  }

  public cmdContactContractOnClick(event: any): void {
    this.store.dispatch({
      type: CallCenterActionTypes.PORTFOLIO_CONTACT_DETAILS, payload: ['CO']
    });
  }

  public cmdContractClearSearchOnClick(event: any): void {
    if (this.formGroup.controls['ContractSearchOn'].value !== 'all' || this.formGroup.controls['ContractSearchValue'].value !== '' || this.formGroup.controls['ContractStatusCode'].value !== 'all') {
      this.resetContractSearch();
      this.paginationCurrentPage = 1;
      this.loadGridView();
    }
  }

  public resetContractSearch(): void {
    this.fieldVisibility.FurtherRecords = false;
    this.formGroup.controls['ContractSearchOn'].setValue('all');
    this.formGroup.controls['ContractSearchValue'].setValue('');
    this.formGroup.controls['ContractStatusCode'].setValue(this.storeData['storeFormDataClone'].tabContracts.ContractStatusCode);
    this.formGroup.controls['ContractTypeCode'].setValue(this.storeData['storeFormDataClone'].tabContracts.ContractTypeCode);
  }

  public contractCommenceFromDateSelectedValue(value: Object): void {
    if (value && value['value']) {
      let prev = this.contractCommenceFromDateDisplay;
      this.contractCommenceFromDateDisplay = value['value'];
      this.formGroup.controls['ContractCommenceFromDate'].setValue(this.contractCommenceFromDateDisplay);
      if (this.initComplete && this.storeData['allowAjaxOnDateChange'] && prev !== value['value']) {
        this.loadGridView();
      }

    } else {
      this.contractCommenceFromDateDisplay = '';
      this.formGroup.controls['ContractCommenceFromDate'].setValue('');
    }
  }

  public contractCommenceToDateSelectedValue(value: Object): void {
    if (value && value['value']) {
      let prev = this.contractCommenceToDateDisplay;
      this.contractCommenceToDateDisplay = value['value'];
      this.formGroup.controls['ContractCommenceToDate'].setValue(this.contractCommenceToDateDisplay);
      if (this.initComplete && this.storeData['allowAjaxOnDateChange'] && prev !== value['value']) {
        this.loadGridView();
      }

    } else {
      this.contractCommenceToDateDisplay = '';
      this.formGroup.controls['ContractCommenceToDate'].setValue('');
    }
  }
}
