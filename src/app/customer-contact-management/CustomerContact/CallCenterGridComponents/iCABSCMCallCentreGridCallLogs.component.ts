import { Component, NgZone, OnInit, OnDestroy, ViewChild, AfterViewInit, ElementRef, Renderer } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpService } from '../../../../shared/services/http-service';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { URLSearchParams } from '@angular/http';
import { CallCenterActionTypes } from '../../../actions/call-centre-search';
import { ServiceConstants } from '../../../../shared/constants/service.constants';
import { GlobalConstant } from '../../../../shared/constants/global.constant';
import { GridComponent } from '../../../../shared/components/grid/grid';
import { Utils } from '../../../../shared/services/utility';
import { RiExchange } from '../../../../shared/services/riExchange';
import { MntConst } from '../../../../shared/services/riMaintenancehelper';
import { ContractManagementModuleRoutes, InternalGridSearchModuleRoutes, InternalGridSearchApplicationModuleRoutes } from './../../../base/PageRoutes';


@Component({
  selector: 'icabs-call-center-grid-calllogs',
  templateUrl: 'iCABSCMCallCentreGridCallLogs.html'
})

export class CallCenterGridCallLogsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('logsGrid') logsGrid: GridComponent;
  public formGroup: FormGroup;
  public fieldVisibility: any = {
    CallLogsForm: false,
    CallLogSelectedContractPremise: true,
    CmdCallLogClearSelected: true,
    CallLogSearchOn: true,
    RiBPSUniqueNumber: true,
    CallLogUserName: true,
    CallLogCreatedDate: true,
    CallLogCreatedTime: true,
    TicketContractNumber: true,
    TicketContractName: true,
    TicketPremiseNumber: true,
    TicketPremiseName: true,
    TicketProductCode: true,
    TicketProductDesc: true,
    TicketPostcode: true,
    TicketContactName: true,
    TicketContactPosition: true,
    TicketContactTelephone: true,
    TicketContactMobile: true,
    TicketContactEmail: true,
    TicketContactFax: true,
    FurtherRecords: false
  };
  public dateObjectsEnabled: any = {
    CallLogDate: true
  };
  public dateObjects: any = {
    CallLogDate: new Date()
  };
  public callLogDateDisplay: string = '';
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
    this.initComplete = false;
    this.formGroup = this.fb.group({
      CallLogSelectedContractPremise: [{ value: '', disabled: false }],
      CmdCallLogClearSelected: [{ value: 'Clear', disabled: false }],
      CallLogSearchOn: [{ value: 'all', disabled: false }],
      CallLogSearchValue: [{ value: '', disabled: false }],
      CallLogDate: [{ value: '', disabled: false }],
      CallLogUserName: [{ value: '', disabled: false }],
      CallLogCreatedDate: [{ value: '', disabled: false }],
      CallLogCreatedTime: [{ value: '', disabled: false }],
      TicketContractNumber: [{ value: '', disabled: false }],
      TicketContractName: [{ value: '', disabled: false }],
      TicketPremiseNumber: [{ value: '', disabled: false }],
      TicketPremiseName: [{ value: '', disabled: false }],
      TicketProductCode: [{ value: '', disabled: false }],
      TicketProductDesc: [{ value: '', disabled: false }],
      TicketPostcode: [{ value: '', disabled: false }],
      TicketContactName: [{ value: '', disabled: false }],
      TicketContactPosition: [{ value: '', disabled: false }],
      TicketContactTelephone: [{ value: '', disabled: false }],
      TicketContactMobile: [{ value: '', disabled: false }],
      TicketContactEmail: [{ value: '', disabled: false }],
      TicketContactFax: [{ value: '', disabled: false }]
    });
  }

  ngOnInit(): void {
    this.setGridHeaders();
    this.storeSubscription = this.store.select('callcentresearch').subscribe(data => {
      this.storeData = data;
      if (this.storeData['fieldVisibility'] && this.storeData['fieldVisibility'].tabLogs) {
        this.fieldVisibility = this.storeData['fieldVisibility'].tabLogs;
      }
      if (this.storeData['dateVisibility'] && this.storeData['dateVisibility'].tabLogs) {
        this.dateObjectsEnabled = this.storeData['dateVisibility'].tabLogs;
      }
      if (this.storeData['dateObjects'] && this.storeData['dateObjects'].tabLogs) {
        this.dateObjects = this.storeData['dateObjects'].tabLogs;
      }
      if (data && data['action']) {
        switch (data['action']) {
          case CallCenterActionTypes.BUILD_SPECIFIC_GRID:
            if (this.storeData['gridToBuild'].indexOf('Logs') > -1) {
              this.loadGridView();
            }
            break;
          case CallCenterActionTypes.CLEAR_SPECIFIC_GRID:
            if (this.storeData['gridToClear'].indexOf('Logs') > -1) {
              this.logsGrid.clearGridData();
            }
            break;
          case CallCenterActionTypes.RESET_ALL_SEARCH_DETAILS:
            this.resetDate();
            break;
          case CallCenterActionTypes.SET_PAGINATION:
            if (this.storeData['storeSavedData']['pagination']) {
              this.currentPage = this.storeData['storeSavedData']['pagination'].tabLogs;
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
        tabLogs: this.formGroup
      }
    });
    this.store.dispatch({
      type: CallCenterActionTypes.SAVE_VISIBILITY_FIELD, payload: {
        tabLogs: this.fieldVisibility
      }
    });
    this.store.dispatch({
      type: CallCenterActionTypes.SAVE_DATE_VISIBILITY, payload: {
        tabLogs: this.dateObjectsEnabled
      }
    });
    this.store.dispatch({
      type: CallCenterActionTypes.SAVE_DATE_OBJECTS, payload: {
        tabLogs: this.dateObjects
      }
    });
    this.store.dispatch({
      type: CallCenterActionTypes.INITIALIZATION, payload: {
        tabLogs: true
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
    } else {
      this.fieldVisibility.CallLogsForm = false;
    }
    setTimeout(() => {
      this.paginationCurrentPage = this.currentPage;
    }, 0);
  }
  public onGridRowClick(data: any): void {
    this.onGridCellClick(data);
    if (data.cellIndex === 0) {
      //iCABSCMCallCentreGridCallLogDetailView
      this.router.navigate([InternalGridSearchApplicationModuleRoutes.ICABSCMCALLCENTREGRIDCALLLOGDETAILVIEW], {
        queryParams: {
          parentMode: 'CallCentreSearch',
          SelectedCallLogID: data.cellData.text
        }
      });
      //alert('Screen part of MVP 2');
    } else if (data.cellIndex === 1) {
      if (this.storeData['otherParams'].otherVariables.CurrentCallLogID === '' && (this.storeData['formGroup'].controls['VisibleCurrentCallLogID'].value === '' || this.storeData['formGroup'].controls['VisibleCurrentCallLogID'].value === '0')) {
        /*let click = new CustomEvent('click', { bubbles: true });
        let elem = document.querySelector('#CmdNewCall');
        if (elem)
        this.renderer.invokeElementMethod(elem, 'click', [click]);*/
        this.storeData['subject']['CmdNewCallSent'].asObservable().subscribe((recieved) => {
          if (recieved['type'] === 'Logs') {
            // iCABSCMCustomerContactMaintenance
            /*this.router.navigate([ContractManagementModuleRoutes.ICABSAACCOUNTMAINTENANCE], { queryParams: {
              parentMode: 'CallCentreSearch',
              accountNumber: this.pageQueryParams['AccountNumber']
            }});*/
            alert('Screen part of MVP 2');
          }
          this.storeData['subject']['CmdNewCallSent'].unsubscribe();
        });
        this.storeData['subject']['CmdNewCallRecieved'].next({
          type: 'Logs'
        });
      } else {
        // iCABSCMCustomerContactMaintenance
        /*this.router.navigate([ContractManagementModuleRoutes.ICABSAACCOUNTMAINTENANCE], { queryParams: {
          parentMode: 'CallCentreSearch',
          accountNumber: this.pageQueryParams['AccountNumber']
        }});*/
        alert('Screen part of MVP 2');
      }
    } else if (data.cellIndex === 5) {
      if (this.storeData['otherParams'].otherVariables.CurrentCallLogID === '' && (this.storeData['formGroup'].controls['VisibleCurrentCallLogID'].value === '' || this.storeData['formGroup'].controls['VisibleCurrentCallLogID'].value === '0')) {
        /*let click = new CustomEvent('click', { bubbles: true });
        let elem = document.querySelector('#CmdNewCall');
        if (elem)
        this.renderer.invokeElementMethod(elem, 'click', [click]);*/
        this.storeData['subject']['CmdNewCallSent'].asObservable().subscribe((recieved) => {
          if (recieved['type'] === 'Logs') {
            //iCABSCMCustomerContactDetailGrid
            /*this.router.navigate([ContractManagementModuleRoutes.ICABSAACCOUNTMAINTENANCE], { queryParams: {
              parentMode: 'CallCentreSearch'
            }});*/
            alert('Screen part of MVP 2');
          }
          this.storeData['subject']['CmdNewCallSent'].unsubscribe();
        });
        this.storeData['subject']['CmdNewCallRecieved'].next({
          type: 'Logs'
        });
      } else {
        //iCABSCMCustomerContactDetailGrid
        /*this.router.navigate([ContractManagementModuleRoutes.ICABSAACCOUNTMAINTENANCE], { queryParams: {
          parentMode: 'CallCentreSearch'
        }});*/
        alert('Screen part of MVP 2');
      }
    } else if (data.cellIndex === 6) {
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
      //alert('Screen part of MVP 2');
    }
  }

  public onGridCellClick(data: any): void {
    let formArray = this.getRowAdditionalData(data.trRowData, 0);
    this.storeData['otherParams'].otherVariables.CustomerContactNumber = data.trRowData[1].text;
    this.storeData['otherParams'].otherVariables.CustomerContactRowID = data.trRowData[1].rowID;
    this.storeData['otherParams'].otherVariables.TechEmployeeCode = data.trRowData[6].additionalData;
    this.storeData['otherParams'].otherVariables.SelectedCallLogID = data.trRowData[0].text;
    this.storeData['formGroup'].tabLogs.controls['CallLogUserName'].setValue(formArray[0]);
    this.storeData['formGroup'].tabLogs.controls['CallLogCreatedDate'].setValue(formArray[1]);
    this.storeData['formGroup'].tabLogs.controls['CallLogCreatedTime'].setValue(formArray[2]);
    this.storeData['otherParams'].otherVariables.SelectedTicketNumber = formArray[3];
    this.storeData['formGroup'].tabLogs.controls['TicketContractNumber'].setValue(formArray[4]);
    this.storeData['formGroup'].tabLogs.controls['TicketContractName'].setValue(formArray[5]);
    this.storeData['formGroup'].tabLogs.controls['TicketPremiseNumber'].setValue(formArray[6]);
    this.storeData['formGroup'].tabLogs.controls['TicketPremiseName'].setValue(formArray[7]);
    this.storeData['formGroup'].tabLogs.controls['TicketProductCode'].setValue(formArray[8]);
    this.storeData['formGroup'].tabLogs.controls['TicketProductDesc'].setValue(formArray[9]);
    this.storeData['otherParams'].otherVariables.TicketServiceCoverNumber = formArray[10];
    this.storeData['otherParams'].otherVariables.TicketServiceCoverRowID = formArray[11];
    this.storeData['formGroup'].tabLogs.controls['TicketPostcode'].setValue(formArray[12]);
    this.storeData['formGroup'].tabLogs.controls['TicketContactName'].setValue(formArray[13]);
    this.storeData['formGroup'].tabLogs.controls['TicketContactPosition'].setValue(formArray[14]);
    this.storeData['formGroup'].tabLogs.controls['TicketContactTelephone'].setValue(formArray[15]);
    this.storeData['formGroup'].tabLogs.controls['TicketContactMobile'].setValue(formArray[16]);
    this.storeData['formGroup'].tabLogs.controls['TicketContactEmail'].setValue(formArray[17]);
    this.storeData['otherParams'].otherVariables.TicketAddressName = formArray[18];
    this.storeData['otherParams'].otherVariables.TicketAddressLine1 = formArray[19];
    this.storeData['otherParams'].otherVariables.TicketAddressLine2 = formArray[20];
    this.storeData['otherParams'].otherVariables.TicketAddressLine3 = formArray[21];
    this.storeData['otherParams'].otherVariables.TicketAddressLine4 = formArray[22];
    this.storeData['otherParams'].otherVariables.TicketAddressLine5 = formArray[23];
    this.storeData['otherParams'].otherVariables.TicketProspectNumber = formArray[24];
    this.storeData['otherParams'].otherVariables.TicketShortDescription = formArray[25];
    this.storeData['otherParams'].otherVariables.TicketComments = formArray[26];
    this.storeData['formGroup'].tabLogs.controls['TicketContactFax'].setValue(formArray[27]);

    this.storeData['formGroup'].main.controls['CmdViewEmployee'].disable();
    if (this.storeData['formGroup'].tabLogs.controls['CallLogUserName'].value !== '') {
      this.fieldVisibility.CallLogsForm = true;
    }
    if (data.cellIndex === 0 || data.cellIndex === 1 || data.cellIndex === 5 || data.cellIndex === 6) {
      if (this.storeData['otherParams']['otherVariables']['currentTab'] !== this.storeData['tabsTranslation'].tabAccounts) {
        this.storeData['formGroup'].main.controls['CmdViewEmployee'].enable();
      }
    }
  }

  public getRowAdditionalData(gridData: any, pos: number): void {
    if (gridData[pos].additionalData) {
      return gridData[pos].additionalData.split('|');
    }
  }

  public cmdCallLogClearSelectedOnClick(event: any): void {
    if (this.storeData['otherParams'].otherVariables.CallLogSelectedContract !== '' && this.storeData['otherParams'].otherVariables.CallLogSelectedPremise !== '') {
      this.storeData['otherParams'].otherVariables.CallLogSelectedPremise = '';
      this.formGroup.controls['CallLogSelectedContractPremise'].setValue(this.storeData['otherParams'].otherVariables.CallLogSelectedContract);
      this.loadGridView();
    } else {
      this.storeData['otherParams'].otherVariables.CallLogSelectedContract = '';
      this.storeData['otherParams'].otherVariables.CallLogSelectedPremise = '';
      this.formGroup.controls['CallLogSelectedContractPremise'].setValue('');
      this.loadGridView();
    }
  }

  public refresh(): void {
    this.fieldVisibility.CallLogsForm = false;
    this.storeData['formGroup'].main.controls['CmdViewEmployee'].disable();
    this.storeData['otherParams'].otherVariables.TechEmployeeCode = '';
    this.storeData['otherParams'].otherVariables.SelectedTicketNumber = '';
    this.loadGridView();
  }
  private setGridHeaders(): void {
    this.gridSortHeaders = [
      {
        'fieldName': 'CallDCallLogID',
        'index': 0,
        'sortType': 'ASC'
      },
      {
        'fieldName': 'CallDContactNumber',
        'index': 1,
        'sortType': 'ASC'
      },
      {
        'fieldName': 'CallDOpen',
        'index': 2,
        'sortType': 'ASC'
      },
      {
        'fieldName': 'CallDCreatedDateTime',
        'index': 3,
        'sortType': 'ASC'
      },
      {
        'fieldName': 'CallDContactTypeDesc',
        'index': 4,
        'sortType': 'ASC'
      },
      {
        'fieldName': 'CallDActionByDate',
        'index': 7,
        'sortType': 'ASC'
      },
      {
        'fieldName': 'CallDStatusCode',
        'index': 9,
        'sortType': 'ASC'
      }
    ];

    this.validateProperties = [
        {
            'type': MntConst.eTypeInteger,
            'index': 0,
            'align': 'center'
        },
        {
            'type': MntConst.eTypeInteger,
            'index': 1,
            'align': 'center'
        },
        {
            'type': MntConst.eTypeImage,
            'index': 2,
            'align': 'center'
        },
        {
            'type': MntConst.eTypeInteger,
            'index': 3,
            'align': 'center'
        },
        {
            'type': MntConst.eTypeTextFree,
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
        },
        {
            'type': MntConst.eTypeTextFree,
            'index': 9,
            'align': 'center'
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
    let urlParams = this.riExchange.getRouterUrlParams();
    this.inputParams.module = this.queryGrid.module;
    this.inputParams.method = this.queryGrid.method;
    this.inputParams.operation = this.queryGrid.operation;
    this.search.set(this.serviceConstants.Action, '2');
    this.search.set(this.serviceConstants.BusinessCode, this.storeData['code'].business ? this.storeData['code'].business : this.utils.getBusinessCode());
    this.search.set(this.serviceConstants.CountryCode, this.storeData['code'].country ? this.storeData['code'].country : this.utils.getCountryCode());
    this.search.set('GridName', 'CallLogDetail');
    this.search.set('AccountNumber', this.utils.checkIfValueExistAndReturn(this.storeData['otherParams'].otherVariables, 'AccountNumber'));
    this.search.set('ProspectNumber', this.utils.checkIfValueExistAndReturn(this.storeData['otherParams'].otherVariables, 'ProspectNumber'));
    this.search.set('ContractNumber', this.utils.checkIfValueExistAndReturn(this.storeData['otherParams'].otherVariables, 'CallLogSelectedContract'));
    this.search.set('PremiseNumber', this.utils.checkIfValueExistAndReturn(this.storeData['otherParams'].otherVariables, 'CallLogSelectedPremise'));
    this.search.set('SearchOn', this.formGroup.controls['CallLogSearchOn'].value);
    this.search.set('SearchValue', this.formGroup.controls['CallLogSearchValue'].value);
    this.search.set('CallLogDate', this.formGroup.controls['CallLogDate'].value);
    this.search.set('riSortOrder', this.sortType);
    this.search.set('riGridMode', '0');
    this.search.set('riGridHandle', (Math.floor(Math.random() * 900000) + 100000).toString());
    this.search.set('HeaderClickedColumn', this.headerClicked);
    this.search.set('PageSize', this.pageSize.toString());
    this.search.set('PageCurrent', this.currentPage.toString());
    this.inputParams.search = this.search;
    this.logsGrid.loadGridData(this.inputParams);
    this.storeData['pagination'].tabLogs = this.currentPage;
  }

  public callLogSearchOnChange(event: any): void {
    if (this.formGroup.controls['CallLogSearchOn'].value === 'all' || this.formGroup.controls['CallLogSearchOn'].value === 'OpenOnly' || this.formGroup.controls['CallLogSearchOn'].value === 'ClosedOnly') {
      this.formGroup.controls['CallLogSearchValue'].setValue('');
      this.formGroup.controls['CallLogSearchValue'].disable();
    } else {
      this.formGroup.controls['CallLogSearchValue'].enable();
      let tabText = document.querySelector('#tabCont .nav-tabs li.active a span')['innerText'];
      if (tabText === this.storeData['tabsTranslation'].tabLogs) {
        let focus = new CustomEvent('focus', { bubbles: true });
        setTimeout(() => {
          this.renderer.invokeElementMethod(document.querySelector('#CallLogSearchValue'), 'focus', [focus]);
        }, 0);
      }
    }
    //this.formGroup.controls['CallLogSearchValue'].setValue('');
  }

  public callLogSearchOnKeyDown(event: any): void {
    if (event.keyCode === 13) {
      this.loadGridView();
    }
  }

  public callLogSearchValueOnKeyDown(event: any): void {
    if (event.keyCode === 13) {
      this.loadGridView();
    }
  }

  public callLogDateSelectedValue(value: Object): void {
    if (value && value['value']) {
      let prev = this.callLogDateDisplay;
      this.callLogDateDisplay = value['value'];
      this.formGroup.controls['CallLogDate'].setValue(this.callLogDateDisplay);
      if (this.initComplete && this.storeData['allowAjaxOnDateChange'] && prev !== value['value']) {
        this.loadGridView();
      }
    } else {
      this.callLogDateDisplay = '';
      this.formGroup.controls['CallLogDate'].setValue('');
    }
  }

  private resetDate(): void {
    let date = new Date();
    this.dateObjects.CallLogDate = new Date(date.setDate(date.getDate() - this.storeData['otherParams'].registry.giCallDateDays));
  }
}
