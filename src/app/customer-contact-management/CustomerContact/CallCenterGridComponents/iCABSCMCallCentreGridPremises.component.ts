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
import { ContractManagementModuleRoutes, InternalGridSearchSalesModuleRoutes, InternalGridSearchServiceModuleRoutes, InternalMaintenanceServiceModuleRoutes } from './../../../base/PageRoutes';

@Component({
  selector: 'icabs-call-center-grid-premises',
  templateUrl: 'iCABSCMCallCentreGridPremises.html'
})

export class CallCenterGridPremisesComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('premisesGrid') premisesGrid: GridComponent;
  public formGroup: FormGroup;
  public fieldVisibility: any = {
    PremSelectedContract: true,
    CmdPremClearSelected: true,
    PremiseSearchOn: true,
    PremiseSearchValue: true,
    PremiseCommenceDateFrom: false,
    PremiseCommenceDateTo: false,
    PremiseStatusCode: true,
    PremiseContractTypeCode: true,
    CmdPremiseClearSearch: true,
    PremiseName: true,
    PremiseContactName: true,
    CmdContactPremise: false,
    PremiseAddressLine1: true,
    PremiseContactPosition: true,
    PremiseAddressLine2: true,
    PremiseAddressLine3: false,
    PremiseContactTelephone: true,
    PremiseAddressLine4: true,
    PremiseContactMobile: true,
    PremiseAddressLine5: true,
    PremiseContactFax: true,
    PremisePostcode: true,
    PremiseContactEmail: true,
    PremiseServiceCoverList: true,
    CmdGoServiceCover: true,
    FurtherRecords: false,
    PremiseForm: false
  };
  public dropdownList: any = {
    PremiseSearchOn: [
      { value: 'Address', desc: 'Address' },
      { value: 'ClientRef', desc: 'Client Reference' },
      { value: 'ContractNo', desc: 'Contract Number' },
      { value: 'InvoiceNumber', desc: 'Invoice Number' },
      { value: 'Name', desc: 'Name' },
      { value: 'PostCode', desc: 'Postcode' },
      { value: 'PurchaseOrderNo', desc: 'Purchase Order No' },
      { value: 'CompanyVATNumber', desc: 'Tax Registration No' },
      { value: 'Telephone', desc: 'Telephone' },
      { value: 'PremiseCommenceDate', desc: 'Commence Date' }
    ],
    PremiseStatusCode: [
      { value: 'All', desc: 'Client Reference' },
      { value: 'ContractNo', desc: 'Contract Number' }
    ],
    PremiseContractTypeCode: [
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
  public premiseCommenceFromDateDisplay: string = '';
  public premiseCommenceToDateDisplay: string = '';
  public dateObjectsEnabled: any = {
    PremiseCommenceDateFrom: true,
    PremiseCommenceDateTo: true
  };
  public dateObjects: any = {
    PremiseCommenceDateFrom: new Date(),
    PremiseCommenceDateTo: new Date()
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
    private riExchange: RiExchange,
    private renderer: Renderer
  ) {
    this.formGroup = this.fb.group({
      PremSelectedContract: [{ value: '', disabled: false }],
      CmdPremClearSelected: [{ disabled: false }],
      PremiseSearchOn: [{ value: 'all', disabled: false }],
      PremiseSearchValue: [{ value: '', disabled: false }],
      PremiseCommenceDateFrom: [{ value: '', disabled: false }],
      PremiseCommenceDateTo: [{ value: '', disabled: false }],
      PremiseStatusCode: [{ value: 'all', disabled: false }],
      PremiseContractTypeCode: [{ value: '', disabled: false }],
      CmdPremiseClearSearch: [{ disabled: false }],
      PremiseName: [{ value: '', disabled: false }],
      PremiseContactName: [{ value: '', disabled: false }],
      CmdContactPremise: [{ disabled: false }],
      PremiseAddressLine1: [{ value: '', disabled: false }],
      PremiseContactPosition: [{ value: '', disabled: false }],
      PremiseAddressLine2: [{ value: '', disabled: false }],
      PremiseAddressLine3: [{ value: '', disabled: false }],
      PremiseContactTelephone: [{ value: '', disabled: false }],
      PremiseAddressLine4: [{ value: '', disabled: false }],
      PremiseContactMobile: [{ value: '', disabled: false }],
      PremiseAddressLine5: [{ value: '', disabled: false }],
      PremiseContactFax: [{ value: '', disabled: false }],
      PremisePostcode: [{ value: '', disabled: false }],
      PremiseContactEmail: [{ value: '', disabled: false }],
      PremiseServiceCoverList: [{ value: '', disabled: false }],
      CmdGoServiceCover: [{ disabled: false }]
    });
  }

  ngOnInit(): void {
    this.dropdownList.PremiseSearchOn.sort(function (a: any, b: any): any { return (a.desc > b.desc) ? 1 : ((b.desc > a.desc) ? -1 : 0); });
    this.storeSubscription = this.store.select('callcentresearch').subscribe(data => {
      this.storeData = data;
      if (this.storeData['fieldVisibility'] && this.storeData['fieldVisibility'].tabPremises) {
        this.fieldVisibility = this.storeData['fieldVisibility'].tabPremises;
      }
      if (this.storeData['dateObjects'] && this.storeData['dateObjects'].tabPremises) {
        this.dateObjects = this.storeData['dateObjects'].tabPremises;
      }
      if (this.storeData['dateVisibility'] && this.storeData['dateVisibility'].tabPremises) {
        this.dateObjectsEnabled = this.storeData['dateVisibility'].tabPremises;
      }
      if (this.storeData['dropdownList'] && this.storeData['dropdownList'].tabPremises) {
        this.dropdownList = this.storeData['dropdownList'].tabPremises;
      }
      if (data && data['action']) {
        switch (data['action']) {
          case CallCenterActionTypes.BUILD_SPECIFIC_GRID:
            if (this.storeData['gridToBuild'].indexOf('Premises') > -1) {
              if (this.storeData['gridToBuild'].length === 1) {
                this.storeData['gridToBuild'] = [];
              }
              this.loadGridView();
              this.premiseSearchOnChange({});
            }
            break;
          case CallCenterActionTypes.CLEAR_SPECIFIC_GRID:
            if (this.storeData['gridToClear'].indexOf('Premises') > -1) {
              this.premisesGrid.clearGridData();
            }
            break;
          case CallCenterActionTypes.SET_PAGINATION:
            if (this.storeData['storeSavedData']['pagination']) {
              this.currentPage = this.storeData['storeSavedData']['pagination'].tabPremises;
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
        tabPremises: this.formGroup
      }
    });
    this.store.dispatch({
      type: CallCenterActionTypes.SAVE_DROPDOWN_LIST, payload: {
        tabPremises: this.dropdownList
      }
    });
    this.store.dispatch({
      type: CallCenterActionTypes.SAVE_VISIBILITY_FIELD, payload: {
        tabPremises: this.fieldVisibility
      }
    });
    this.store.dispatch({
      type: CallCenterActionTypes.SAVE_DATE_VISIBILITY, payload: {
        tabPremises: this.dateObjectsEnabled
      }
    });
    this.store.dispatch({
      type: CallCenterActionTypes.SAVE_DATE_OBJECTS, payload: {
        tabPremises: this.dateObjects
      }
    });
    this.store.dispatch({
      type: CallCenterActionTypes.INITIALIZATION, payload: {
        tabPremises: true
      }
    });
    setTimeout(() => {
      this.initComplete = true;
      this.premiseSearchOnChange({});
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
      let formArray = this.getRowAdditionalData(info.gridData.body.cells.slice(0, this.maxColumns), 0);
      //this.populateForm(formArray, null, 0, info.gridData.body.cells.slice(0, this.maxColumns));
      /*this.store.dispatch({
        type: CallCenterActionTypes.BUILD_SPECIFIC_GRID, payload: ['Logs', 'WorkOrders', 'History', 'EventHistory', 'Invoices']
      });*/
      this.onGridCellClick({
        trRowData: info.gridData.body.cells.slice(0, this.maxColumns),
        cellIndex: 0
      });
      this.setTabRefresh();
      this.storeData['gridToBuild'] = [];
      this.storeData['action'] = '';
      //this.fieldVisibility.CmdContactPremise = true;
      if (this.storeData['otherParams']['otherVariables']['currentTab'] !== this.storeData['tabsTranslation'].tabAccounts) {
        this.storeData['formGroup'].main.controls['CmdViewEmployee'].enable();
      }
    } else {
      //this.fieldVisibility.CmdContactPremise = false;
      this.fieldVisibility.PremiseForm = false;
    }
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
            if (recieved['type'] === 'Premises') {
              this.navigateToContract();
            }
            this.storeData['subject']['CmdNewCallSent'].unsubscribe();
          });
          this.storeData['subject']['CmdNewCallRecieved'].next({
            type: 'Premises'
          });
        } else {
          this.navigateToContract();
        }
      } else {
        this.store.dispatch({
          type: CallCenterActionTypes.DISPLAY_ERROR, payload: this.storeData['otherParams'].registry['gcPermissionDeniedMessage']
        });
      }
    }
    else if (data.cellIndex === 2) {
      if (this.storeData['otherParams'].otherVariables.PremiseLimitDataView === 'N') {
        if (this.storeData['otherParams'].otherVariables.CurrentCallLogID === '' && (this.storeData['formGroup'].main.controls['VisibleCurrentCallLogID'].value === '' || this.storeData['formGroup'].main.controls['VisibleCurrentCallLogID'].value === '0')) {
          /*let click = new CustomEvent('click', { bubbles: true });
          let elem = document.querySelector('#CmdNewCall');
          if (elem)
          this.renderer.invokeElementMethod(elem, 'click', [click]);*/
          this.storeData['subject']['CmdNewCallSent'].asObservable().subscribe((recieved) => {
            if (recieved['type'] === 'Premises') {
              //iCABSAPremiseMaintenance
              this.router.navigate([ContractManagementModuleRoutes.ICABSAPREMISEMAINTENANCE], {
                queryParams: {
                  parentMode: 'GridSearch',
                  PremiseNumber: data.trRowData[2].text,
                  AccountName: this.storeData['formGroup'].tabAccounts.controls['AccountName'].value,
                  AccountNumber: this.storeData['otherParams'].otherVariables.AccountNumber,
                  ContractNumber: this.storeData['otherParams'].otherVariables.ContractNumber,
                  CurrentCallLogID: this.storeData['formGroup'].main.controls['VisibleCurrentCallLogID'].value || this.storeData['otherParams'].otherVariables.CurrentCallLogID
                  // ContractName: this.storeData['otherParams'].otherVariables.ContractName
                }
              });
            }
            this.storeData['subject']['CmdNewCallSent'].unsubscribe();
          });
          this.storeData['subject']['CmdNewCallRecieved'].next({
            type: 'Premises'
          });
        } else {
          //iCABSAPremiseMaintenance
          this.router.navigate([ContractManagementModuleRoutes.ICABSAPREMISEMAINTENANCE], {
            queryParams: {
              parentMode: 'GridSearch',
              PremiseNumber: data.trRowData[2].text,
              AccountName: this.storeData['formGroup'].tabAccounts.controls['AccountName'].value,
              AccountNumber: this.storeData['otherParams'].otherVariables.AccountNumber,
              ContractNumber: this.storeData['otherParams'].otherVariables.ContractNumber,
              CurrentCallLogID: this.storeData['formGroup'].main.controls['VisibleCurrentCallLogID'].value || this.storeData['otherParams'].otherVariables.CurrentCallLogID
              // ContractName: this.storeData['otherParams'].otherVariables.ContractName
            }
          });
        }
      } else {
        this.store.dispatch({
          type: CallCenterActionTypes.DISPLAY_ERROR, payload: this.storeData['otherParams'].registry['gcPermissionDeniedMessage']
        });
      }
    }

    if ((this.maxColumns === 12 && data.cellIndex === 10) || (this.maxColumns === 13 && data.cellIndex === 11)) {
      if (this.storeData['otherParams'].otherVariables.CurrentCallLogID === '' && (this.storeData['formGroup'].main.controls['VisibleCurrentCallLogID'].value === '' || this.storeData['formGroup'].main.controls['VisibleCurrentCallLogID'].value === null)) {
        // iCABSCMTelesalesEntry
        this.fetchCallCentreDataPost('NewCall', {}, { BusinessCode: this.storeData['code'].business }).subscribe((e) => {
          if (!e['errorMessage']) {
            this.storeData['otherParams'].otherVariables.CurrentCallLogID = e.CallLogID;
            // iCABSCMTelesalesEntry
            this.router.navigate([InternalMaintenanceServiceModuleRoutes.ICABSCMTELESALESENTRY], {
              queryParams: {
                parentMode: 'PremiseTeleSalesOrder',
                AccountName: this.storeData['formGroup'].tabAccounts.controls['AccountName'].value,
                AccountNumber: this.storeData['otherParams'].otherVariables.AccountNumber,
                CurrentCallLogID: e.CallLogID
              }
            });
          }
        });
      } else {
        // iCABSCMTelesalesEntry
        this.router.navigate([InternalMaintenanceServiceModuleRoutes.ICABSCMTELESALESENTRY], {
          queryParams: {
            parentMode: 'PremiseTeleSalesOrder',
            AccountName: this.storeData['formGroup'].tabAccounts.controls['AccountName'].value,
            AccountNumber: this.storeData['otherParams'].otherVariables.AccountNumber,
            CurrentCallLogID: this.storeData['formGroup'].main.controls['VisibleCurrentCallLogID'].value || this.storeData['otherParams'].otherVariables.CurrentCallLogID
          }
        });
      }
    }

    if ((this.maxColumns === 12 && data.cellIndex === 11) || (this.maxColumns === 13 && data.cellIndex === 12)) {
      // iCABSACustomerInformationSummary
      this.router.navigate([InternalGridSearchServiceModuleRoutes.ICABSACUSTOMERINFORMATIONSUMMARY.URL_1], {
        queryParams: {
          parentMode: 'Contract',
          accountName: this.storeData['formGroup'].tabAccounts.controls['AccountName'].value,
          accountNumber: this.storeData['otherParams'].otherVariables.AccountNumber,
          contractNumber: this.storeData['otherParams'].otherVariables.ContractNumber,
          contractName: this.storeData['otherParams'].otherVariables.ContractName
        }
      });
    }
  }

  public navigateToContract(): void {
    if (this.storeData['otherParams'].otherVariables.ContractType === 'C') {
      this.router.navigate([ContractManagementModuleRoutes.ICABSACONTRACTMAINTENANCE], {
        queryParams: {
          parentMode: 'CallCentreSearch',
          ContractNumber: this.storeData['otherParams'].otherVariables.ContractNumber
        }
      });
    } else if (this.storeData['otherParams'].otherVariables.ContractType === 'J') {
      this.router.navigate([ContractManagementModuleRoutes.ICABSAJOBMAINTENANCE], {
        queryParams: {
          parentMode: 'CallCentreSearch',
          ContractNumber: this.storeData['otherParams'].otherVariables.ContractNumber
        }
      });
    } else if (this.storeData['otherParams'].otherVariables.ContractType === 'P') {
      this.router.navigate([ContractManagementModuleRoutes.ICABSAPRODUCTSALEMAINTENANCE], {
        queryParams: {
          parentMode: 'CallCentreSearch',
          ContractNumber: this.storeData['otherParams'].otherVariables.ContractNumber
        }
      });
    }
  }

  public populateForm(formArray: any, cellIndex: number, rowIndex: number, completeRowData: any): void {
    this.fieldVisibility.PremiseForm = true;
    this.storeData['otherParams'].otherVariables.ContractROWID = completeRowData[0].rowID;
    this.storeData['otherParams'].otherVariables.PremiseROWID = completeRowData[2].rowID;
    this.storeData['otherParams'].otherVariables.ContractNumber = completeRowData[0].text;
    this.storeData['otherParams'].otherVariables.ContractType = completeRowData[1].text;
    this.storeData['otherParams'].otherVariables.PremiseNumber = completeRowData[2].text;
    this.storeData['otherParams'].otherVariables.ContractName = formArray[0];
    this.storeData['formGroup'].tabPremises.controls['PremiseName'].setValue(formArray[1]);
    this.storeData['formGroup'].tabPremises.controls['PremiseAddressLine1'].setValue(formArray[2]);
    this.storeData['formGroup'].tabPremises.controls['PremiseAddressLine2'].setValue(formArray[3]);
    this.storeData['formGroup'].tabPremises.controls['PremiseAddressLine3'].setValue(formArray[4]);
    this.storeData['formGroup'].tabPremises.controls['PremiseAddressLine4'].setValue(formArray[5]);
    this.storeData['formGroup'].tabPremises.controls['PremiseAddressLine5'].setValue(formArray[6]);
    this.storeData['formGroup'].tabPremises.controls['PremisePostcode'].setValue(formArray[7]);
    this.storeData['formGroup'].tabPremises.controls['PremiseContactName'].setValue(formArray[8]);
    this.storeData['formGroup'].tabPremises.controls['PremiseContactPosition'].setValue(formArray[9]);
    this.storeData['formGroup'].tabPremises.controls['PremiseContactTelephone'].setValue(formArray[10]);
    this.storeData['formGroup'].tabPremises.controls['PremiseContactMobile'].setValue(formArray[11]);
    this.storeData['formGroup'].tabPremises.controls['PremiseContactFax'].setValue(formArray[12]);
    this.storeData['formGroup'].tabPremises.controls['PremiseContactEmail'].setValue(formArray[13]);
    this.storeData['formGroup'].tabPremises.controls['PremiseServiceCoverList'].setValue(formArray[18]);

    this.storeData['otherParams'].otherVariables.ProductCode = formArray[14];
    this.storeData['otherParams'].otherVariables.ProductDesc = formArray[15];
    this.storeData['otherParams'].otherVariables.ServiceCoverNumber = formArray[16];
    this.storeData['otherParams'].otherVariables.ServiceCoverROWID = formArray[17];
    this.storeData['otherParams'].otherVariables.ContractContactEmail = formArray[19];
    this.storeData['otherParams'].otherVariables.ContractLimitDataView = formArray[20];
    this.storeData['otherParams'].otherVariables.PremiseLimitDataView = formArray[21];
    this.storeData['otherParams'].otherVariables.SelectedPostcode = this.formGroup.controls['PremisePostcode'].value;
    this.storeData['otherParams'].otherVariables.SelectedAddressLine4 = this.formGroup.controls['PremiseAddressLine4'].value;
    this.storeData['otherParams'].otherVariables.SelectedAddressLine5 = this.formGroup.controls['PremiseAddressLine5'].value;
    if (formArray[18] === '') {
      this.formGroup.controls['CmdGoServiceCover'].disable();
    } else {
      this.formGroup.controls['CmdGoServiceCover'].enable();
    }
    if (this.storeData['currentTab'] === this.storeData['tabsTranslation'].tabPremises) {
      this.storeData['otherParams'].otherVariables.InvSelectedContract = this.storeData['otherParams'].otherVariables.ContractNumber;
      this.storeData['otherParams'].otherVariables.InvSelectedPremise = this.storeData['otherParams'].otherVariables.PremiseNumber;
      this.storeData['formGroup'].tabInvoices.controls['InvSelectedContractPremise'].setValue(this.storeData['otherParams'].otherVariables.InvSelectedContract + ' / ' + this.storeData['otherParams'].otherVariables.InvSelectedPremise);

      this.storeData['otherParams'].otherVariables.WOSelectedContract = this.storeData['otherParams'].otherVariables.ContractNumber;
      this.storeData['otherParams'].otherVariables.WOSelectedPremise = this.storeData['otherParams'].otherVariables.PremiseNumber;
      this.storeData['formGroup'].tabWorkOrders.controls['WOSelectedContractPremise'].setValue(this.storeData['otherParams'].otherVariables.WOSelectedContract + ' / ' + this.storeData['otherParams'].otherVariables.WOSelectedPremise);

      this.storeData['otherParams'].otherVariables.EventHistorySelectedContract = this.storeData['otherParams'].otherVariables.ContractNumber;
      this.storeData['otherParams'].otherVariables.EventHistorySelectedPremise = this.storeData['otherParams'].otherVariables.PremiseNumber;
      this.storeData['formGroup'].tabEventHistory.controls['EventHistorySelectedContractPremise'].setValue(this.storeData['otherParams'].otherVariables.EventHistorySelectedContract + ' / ' + this.storeData['otherParams'].otherVariables.EventHistorySelectedPremise);

      this.storeData['otherParams'].otherVariables.HistorySelectedContract = this.storeData['otherParams'].otherVariables.ContractNumber;
      this.storeData['otherParams'].otherVariables.HistorySelectedPremise = this.storeData['otherParams'].otherVariables.PremiseNumber;
      this.storeData['formGroup'].tabHistory.controls['HistorySelectedContractPremise'].setValue(this.storeData['otherParams'].otherVariables.HistorySelectedContract + ' / ' + this.storeData['otherParams'].otherVariables.HistorySelectedPremise);

      this.storeData['otherParams'].otherVariables.CallLogSelectedContract = this.storeData['otherParams'].otherVariables.ContractNumber;
      this.storeData['otherParams'].otherVariables.CallLogSelectedPremise = this.storeData['otherParams'].otherVariables.PremiseNumber;
      this.storeData['formGroup'].tabLogs.controls['CallLogSelectedContractPremise'].setValue(this.storeData['otherParams'].otherVariables.CallLogSelectedContract + ' / ' + this.storeData['otherParams'].otherVariables.CallLogSelectedPremise);

    }

    this.storeData['formGroup'].main.controls['CmdViewEmployee'].disable();
  }

  public onGridCellClick(data: any): void {
    if ((this.maxColumns === 12 && (data.cellIndex === 0 || data.cellIndex === 1 || data.cellIndex === 2 || data.cellIndex === 10 || data.cellIndex === 11)) || (this.maxColumns === 13 && (data.cellIndex === 0 || data.cellIndex === 1 || data.cellIndex === 2 || data.cellIndex === 11 || data.cellIndex === 12))) {
      this.setTabRefresh();
      let formArray = this.getRowAdditionalData(data.trRowData, 0);
      this.storeData['otherParams'].otherVariables.ContractROWID = data.trRowData[0].rowID;
      this.storeData['otherParams'].otherVariables.PremiseROWID = data.trRowData[2].rowID;
      this.storeData['otherParams'].otherVariables.ContractNumber = data.trRowData[0].text;
      this.storeData['otherParams'].otherVariables.ContractType = data.trRowData[1].text;
      this.storeData['otherParams'].otherVariables.PremiseNumber = data.trRowData[2].text;
      this.storeData['otherParams'].otherVariables.ContractName = formArray[0];
      this.storeData['formGroup'].tabPremises.controls['PremiseName'].setValue(formArray[1]);
      this.storeData['formGroup'].tabPremises.controls['PremiseAddressLine1'].setValue(formArray[2]);
      this.storeData['formGroup'].tabPremises.controls['PremiseAddressLine2'].setValue(formArray[3]);
      this.storeData['formGroup'].tabPremises.controls['PremiseAddressLine3'].setValue(formArray[4]);
      this.storeData['formGroup'].tabPremises.controls['PremiseAddressLine4'].setValue(formArray[5]);
      this.storeData['formGroup'].tabPremises.controls['PremiseAddressLine5'].setValue(formArray[6]);
      this.storeData['formGroup'].tabPremises.controls['PremisePostcode'].setValue(formArray[7]);
      this.storeData['formGroup'].tabPremises.controls['PremiseContactName'].setValue(formArray[8]);
      this.storeData['formGroup'].tabPremises.controls['PremiseContactPosition'].setValue(formArray[9]);
      this.storeData['formGroup'].tabPremises.controls['PremiseContactTelephone'].setValue(formArray[10]);
      this.storeData['formGroup'].tabPremises.controls['PremiseContactMobile'].setValue(formArray[11]);
      this.storeData['formGroup'].tabPremises.controls['PremiseContactFax'].setValue(formArray[12]);
      this.storeData['formGroup'].tabPremises.controls['PremiseContactEmail'].setValue(formArray[13]);
      this.storeData['formGroup'].tabPremises.controls['PremiseServiceCoverList'].setValue(formArray[18]);

      this.storeData['otherParams'].otherVariables.ProductCode = formArray[14];
      this.storeData['otherParams'].otherVariables.ProductDesc = formArray[15];
      this.storeData['otherParams'].otherVariables.ServiceCoverNumber = formArray[16];
      this.storeData['otherParams'].otherVariables.ServiceCoverROWID = formArray[17];
      this.storeData['otherParams'].otherVariables.ContractContactEmail = formArray[19];
      this.storeData['otherParams'].otherVariables.ContractLimitDataView = formArray[20];
      this.storeData['otherParams'].otherVariables.PremiseLimitDataView = formArray[21];
      this.storeData['otherParams'].otherVariables.SelectedPostcode = this.formGroup.controls['PremisePostcode'].value;
      this.storeData['otherParams'].otherVariables.SelectedAddressLine4 = this.formGroup.controls['PremiseAddressLine4'].value;
      this.storeData['otherParams'].otherVariables.SelectedAddressLine5 = this.formGroup.controls['PremiseAddressLine5'].value;
      if (formArray[18] === '') {
        this.formGroup.controls['CmdGoServiceCover'].disable();
      } else {
        this.formGroup.controls['CmdGoServiceCover'].enable();
      }
      this.fieldVisibility.PremiseForm = true;
      this.storeData['otherParams'].otherVariables.InvSelectedContract = this.storeData['otherParams'].otherVariables.ContractNumber;
      this.storeData['otherParams'].otherVariables.InvSelectedPremise = this.storeData['otherParams'].otherVariables.PremiseNumber;
      this.storeData['formGroup'].tabInvoices.controls['InvSelectedContractPremise'].setValue(this.storeData['otherParams'].otherVariables.InvSelectedContract + ' / ' + this.storeData['otherParams'].otherVariables.InvSelectedPremise);

      this.storeData['otherParams'].otherVariables.WOSelectedContract = this.storeData['otherParams'].otherVariables.ContractNumber;
      this.storeData['otherParams'].otherVariables.WOSelectedPremise = this.storeData['otherParams'].otherVariables.PremiseNumber;
      this.storeData['formGroup'].tabWorkOrders.controls['WOSelectedContractPremise'].setValue(this.storeData['otherParams'].otherVariables.WOSelectedContract + ' / ' + this.storeData['otherParams'].otherVariables.WOSelectedPremise);

      this.storeData['otherParams'].otherVariables.EventHistorySelectedContract = this.storeData['otherParams'].otherVariables.ContractNumber;
      this.storeData['otherParams'].otherVariables.EventHistorySelectedPremise = this.storeData['otherParams'].otherVariables.PremiseNumber;
      this.storeData['formGroup'].tabEventHistory.controls['EventHistorySelectedContractPremise'].setValue(this.storeData['otherParams'].otherVariables.EventHistorySelectedContract + ' / ' + this.storeData['otherParams'].otherVariables.EventHistorySelectedPremise);

      this.storeData['otherParams'].otherVariables.HistorySelectedContract = this.storeData['otherParams'].otherVariables.ContractNumber;
      this.storeData['otherParams'].otherVariables.HistorySelectedPremise = this.storeData['otherParams'].otherVariables.PremiseNumber;
      this.storeData['formGroup'].tabHistory.controls['HistorySelectedContractPremise'].setValue(this.storeData['otherParams'].otherVariables.HistorySelectedContract + ' / ' + this.storeData['otherParams'].otherVariables.HistorySelectedPremise);

      this.storeData['otherParams'].otherVariables.CallLogSelectedContract = this.storeData['otherParams'].otherVariables.ContractNumber;
      this.storeData['otherParams'].otherVariables.CallLogSelectedPremise = this.storeData['otherParams'].otherVariables.PremiseNumber;
      this.storeData['formGroup'].tabLogs.controls['CallLogSelectedContractPremise'].setValue(this.storeData['otherParams'].otherVariables.CallLogSelectedContract + ' / ' + this.storeData['otherParams'].otherVariables.CallLogSelectedPremise);

      /*if (this.storeData['otherParams'].otherVariables.LiveAccount) {
          ProspectContractNumber.value = ContractNumber.value
      }*/
      this.storeData['formGroup'].main.controls['CmdViewEmployee'].disable();
      /*this.store.dispatch({
        type: CallCenterActionTypes.BUILD_SPECIFIC_GRID, payload: ['Logs', 'WorkOrders', 'History', 'EventHistory', 'Invoices']
      });*/
      this.storeData['gridToBuild'] = [];
      this.storeData['action'] = '';
      if (this.storeData['otherParams']['otherVariables']['currentTab'] !== this.storeData['tabsTranslation'].tabAccounts) {
        this.storeData['formGroup'].main.controls['CmdViewEmployee'].enable();
      }
    }
  }

  public setTabRefresh(): void {
    this.storeData['refresh'].tabLogs = true;
    this.storeData['refresh'].tabDashboard = true;
    this.storeData['refresh'].tabDlContract = true;
    this.storeData['refresh'].tabEventHistory = true;
    this.storeData['refresh'].tabHistory = true;
    this.storeData['refresh'].tabInvoices = true;
    this.storeData['refresh'].tabWorkOrders = true;
  }

  public getRowAdditionalData(gridData: any, pos: number): void {
    if (gridData[pos].additionalData) {
      return gridData[pos].additionalData.split('|');
    }
  }

  public refresh(): void {
    this.fieldVisibility.PremiseForm = false;
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
            'type': MntConst.eTypeInteger,
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
            'type': MntConst.eTypeTextFree,
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
            'type': MntConst.eTypeTextFree,
            'index': 8,
            'align': 'center'
        },
        {
            'type': MntConst.eTypeTextFree,
            'index': 9,
            'align': 'center'
        }
    ];
    let additionalProperties: Array<any> = [];
    if (this.storeData['otherParams'].webSpeedVariables && this.storeData['otherParams'].webSpeedVariables.cIsPropertyCareBranch === 'Y') {
      this.maxColumns = 13;
      additionalProperties = [
        {
            'type': MntConst.eTypeImage,
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
    this.gridSortHeaders = [
      {
        'fieldName': 'PremContractNumber',
        'index': 0,
        'sortType': 'ASC'
      },
      {
        'fieldName': 'PremContractTypeCode',
        'index': 1,
        'sortType': 'ASC'
      },
      {
        'fieldName': 'PremCommenceDate',
        'index': 3,
        'sortType': 'ASC'
      },
      {
        'fieldName': 'PremExpiryDate',
        'index': 4,
        'sortType': 'ASC'
      },
      {
        'fieldName': 'PremPremiseName',
        'index': 5,
        'sortType': 'ASC'
      },
      {
        'fieldName': 'PremAddressLine1',
        'index': 6,
        'sortType': 'ASC'
      },
      {
        'fieldName': 'PremPostCode',
        'index': 7,
        'sortType': 'ASC'
      },
      {
        'fieldName': 'PremBranch',
        'index': 8,
        'sortType': 'ASC'
      },
      {
        'fieldName': 'PremStatus',
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
        'width': '60px',
        'index': 1
      },
      {
        'align': 'center',
        'width': '100px',
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

  public loadGridView(): void {
    this.setGridSettings();
    let urlParams = this.riExchange.getRouterUrlParams();
    this.inputParams.module = this.queryGrid.module;
    this.inputParams.method = this.queryGrid.method;
    this.inputParams.operation = this.queryGrid.operation;
    this.search.set(this.serviceConstants.Action, '2');
    this.search.set(this.serviceConstants.BusinessCode, this.storeData['code'].business ? this.storeData['code'].business : this.utils.getBusinessCode());
    this.search.set(this.serviceConstants.CountryCode, this.storeData['code'].country ? this.storeData['code'].country : this.utils.getCountryCode());
    this.search.set('GridName', 'Premise');
    this.search.set('AccountNumber', this.utils.checkIfValueExistAndReturn(this.storeData['otherParams'].otherVariables, 'AccountNumber'));
    this.search.set('ProspectNumber', this.utils.checkIfValueExistAndReturn(this.storeData['otherParams'].otherVariables, 'ProspectNumber'));
    this.search.set('ContractNumber', this.formGroup.controls['PremSelectedContract'].value !== '' ? this.utils.checkIfValueExistAndReturn(this.storeData['otherParams'].otherVariables, 'ContractNumber') : '');
    this.search.set('ContractTypeCode', this.formGroup.controls['PremiseContractTypeCode'].value);
    this.search.set('IsPropertyCareBranch', this.storeData['otherParams'].webSpeedVariables ? this.storeData['otherParams'].webSpeedVariables.cIsPropertyCareBranch : '');
    this.search.set('SearchOn', this.formGroup.controls['PremiseSearchOn'].value);
    this.search.set('SearchValue', this.formGroup.controls['PremiseSearchValue'].value);
    this.search.set('PortfolioStatus', this.formGroup.controls['PremiseStatusCode'].value);
    this.search.set('PremiseCommenceDateFrom', this.fieldVisibility.PremiseCommenceDateFrom ? this.formGroup.controls['PremiseCommenceDateFrom'].value : '');
    this.search.set('PremiseCommenceDateTo', this.fieldVisibility.PremiseCommenceDateTo ? this.formGroup.controls['PremiseCommenceDateTo'].value : '');
    this.search.set('riSortOrder', this.sortType);
    this.search.set('riGridMode', '0');
    this.search.set('riGridHandle', (Math.floor(Math.random() * 900000) + 100000).toString());
    this.search.set('HeaderClickedColumn', this.headerClicked);
    this.search.set('PageSize', this.pageSize.toString());
    this.search.set('PageCurrent', this.currentPage.toString());
    this.inputParams.search = this.search;
    this.premisesGrid.loadGridData(this.inputParams);
    this.storeData['pagination'].tabPremises = this.currentPage;
  }

  public premiseSearchOnChange(event: any): void {
    if (this.formGroup.controls['PremiseSearchOn'].value === 'all') {
      this.fieldVisibility.PremiseSearchValue = true;
      this.formGroup.controls['PremiseSearchValue'].disable();
      this.formGroup.controls['PremiseSearchValue'].setValue('');
      this.fieldVisibility.PremiseCommenceDateFrom = false;
      this.fieldVisibility.PremiseCommenceDateTo = false;
    } else if (this.formGroup.controls['PremiseSearchOn'].value === 'PremiseCommenceDate') {
      this.fieldVisibility.PremiseSearchValue = false;
      this.fieldVisibility.PremiseCommenceDateFrom = true;
      this.fieldVisibility.PremiseCommenceDateTo = true;
      let date = new Date();
      this.dateObjects.PremiseCommenceDateFrom = new Date(date.setDate(date.getDate() - this.storeData['otherParams'].registry.giPremiseCommenceFromDays));
      date = new Date();
      this.dateObjects.PremiseCommenceDateTo = new Date(date.setDate(date.getDate() + this.storeData['otherParams'].registry.giPremiseCommenceToDays));

    } else {
      this.fieldVisibility.PremiseSearchValue = true;
      this.formGroup.controls['PremiseSearchValue'].enable();
      this.fieldVisibility.PremiseCommenceDateFrom = false;
      this.fieldVisibility.PremiseCommenceDateTo = false;
    }
    let elem = document.querySelector('#tabCont .nav-tabs li.active a span');
    if (elem) {
      let tabText = elem['innerText'];
      if (tabText === this.storeData['tabsTranslation'].tabPremises) {
        let focus = new CustomEvent('focus', { bubbles: true });
        setTimeout(() => {
          if (document.querySelector('#PremiseSearchValue') !== null)
            this.renderer.invokeElementMethod(document.querySelector('#PremiseSearchValue'), 'focus', [focus]);
        }, 0);
      }
    }
  }

  public premiseContractTypeCodeOnChange(event: any): void {
    this.storeData['formGroup'].tabInvoices.controls['InvoiceContractTypeCode'].setValue(this.formGroup.controls['PremiseContractTypeCode'].value);
  }

  public premiseSearchOnKeyDown(event: any): void {
    if (event.keyCode === 13) {
      this.loadGridView();
    }
  }

  public premiseSearchValueOnKeyDown(event: any): void {
    if (event.keyCode === 13) {
      this.loadGridView();
    }
  }

  public premiseStatusCodeOnKeyDown(event: any): void {
    if (event.keyCode === 13) {
      this.loadGridView();
    }
  }

  public premiseContractTypeCodeOnKeyDown(event: any): void {
    if (event.keyCode === 13) {
      this.loadGridView();
    }
  }

  public cmdContactPremiseOnClick(event: any): void {
    this.store.dispatch({
      type: CallCenterActionTypes.PORTFOLIO_CONTACT_DETAILS, payload: ['PR']
    });
  }

  public cmdPremClearSelectedOnClick(event: any): void {
    if (this.formGroup.controls['PremSelectedContract'].value !== '') {
      this.formGroup.controls['PremSelectedContract'].setValue('');
      this.loadGridView();
    }
  }

  public cmdPremiseClearSearchOnClick(event: any): void {
    if (this.formGroup.controls['PremiseSearchOn'].value !== 'all' || this.formGroup.controls['PremiseSearchValue'].value !== '' || this.formGroup.controls['PremiseStatusCode'].value !== 'all') {
      this.resetPremiseSearch();
      this.paginationCurrentPage = 1;
      this.loadGridView();
    }
  }

  public cmdGoServiceCoverOnClick(event: any): void {
    if (this.storeData['otherParams'].otherVariables.ContractLimitDataView === 'N') {
      if (this.storeData['otherParams'].otherVariables.CurrentCallLogID === '' && this.storeData['formGroup'].main.controls['VisibleCurrentCallLogID'].value === '') {
        /*let click = new CustomEvent('click', { bubbles: true });
        let elem = document.querySelector('#CmdNewCall');
        if (elem)
        this.renderer.invokeElementMethod(elem, 'click', [click]);*/
        this.storeData['subject']['CmdNewCallSent'].asObservable().subscribe((recieved) => {
          if (recieved['type'] === 'Premises') {
            if (this.storeData['otherParams'].otherVariables.ContractType === 'C' || this.storeData['otherParams'].otherVariables.ContractType === 'J') {
              // iCABSAPremiseServiceSummary
              this.router.navigate([InternalGridSearchSalesModuleRoutes.ICABSAPREMISESERVICESUMMARY], {
                queryParams: {
                  parentMode: 'CallCentreSearch',
                  ContractNumber: this.storeData['otherParams'].otherVariables.ContractNumber,
                  ContractName: this.storeData['otherParams'].otherVariables.ContractName,
                  AccountNumber: this.storeData['otherParams'].otherVariables.AccountNumber,
                  PremiseNumber: this.storeData['otherParams'].otherVariables.PremiseNumber,
                  PremiseName: this.storeData['formGroup'].tabPremises.controls['PremiseName'],
                  CurrentCallLogID: this.storeData['otherParams'].otherVariables.CurrentCallLogID,
                  RunningReadOnly: 'yes'
                }
              });
            } else if (this.storeData['otherParams'].otherVariables.ContractType === 'P') {
              // iCABSAProductSalesSCEntryGrid
              this.router.navigate([InternalGridSearchServiceModuleRoutes.ICABSAPRODUCTSALESSCENTRYGRID.URL_1], {
                queryParams: {
                  parentMode: 'CallCentreSearch',
                  ContractNumber: this.storeData['otherParams'].otherVariables.ContractNumber,
                  ContractName: this.storeData['otherParams'].otherVariables.ContractName,
                  AccountNumber: this.storeData['otherParams'].otherVariables.AccountNumber,
                  PremiseNumber: this.storeData['otherParams'].otherVariables.PremiseNumber,
                  PremiseName: this.storeData['formGroup'].tabPremises.controls['PremiseName'].value,
                  CurrentCallLogID: this.storeData['otherParams'].otherVariables.CurrentCallLogID,
                  RunningReadOnly: 'yes'
                }
              });
            }
          }
          this.storeData['subject']['CmdNewCallSent'].unsubscribe();
        });
        this.storeData['subject']['CmdNewCallRecieved'].next({
          type: 'Premises'
        });
      } else {
        if (this.storeData['otherParams'].otherVariables.ContractType === 'C' || this.storeData['otherParams'].otherVariables.ContractType === 'J') {
          // iCABSAPremiseServiceSummary
          this.router.navigate([InternalGridSearchSalesModuleRoutes.ICABSAPREMISESERVICESUMMARY], {
            queryParams: {
              parentMode: 'CallCentreSearch',
              ContractNumber: this.storeData['otherParams'].otherVariables.ContractNumber,
              ContractName: this.storeData['otherParams'].otherVariables.ContractName,
              AccountNumber: this.storeData['otherParams'].otherVariables.AccountNumber,
              PremiseNumber: this.storeData['otherParams'].otherVariables.PremiseNumber,
              PremiseName: this.storeData['formGroup'].tabPremises.controls['PremiseName'].value,
              CurrentCallLogID: this.storeData['otherParams'].otherVariables.CurrentCallLogID,
              RunningReadOnly: 'yes'
            }
          });
        } else if (this.storeData['otherParams'].otherVariables.ContractType === 'P') {
          // iCABSAProductSalesSCEntryGrid
          this.router.navigate([InternalGridSearchServiceModuleRoutes.ICABSAPRODUCTSALESSCENTRYGRID.URL_1], {
            queryParams: {
              parentMode: 'CallCentreSearch',
              ContractNumber: this.storeData['otherParams'].otherVariables.ContractNumber,
              ContractName: this.storeData['otherParams'].otherVariables.ContractName,
              AccountNumber: this.storeData['otherParams'].otherVariables.AccountNumber,
              PremiseNumber: this.storeData['otherParams'].otherVariables.PremiseNumber,
              PremiseName: this.storeData['formGroup'].tabPremises.controls['PremiseName'].value,
              CurrentCallLogID: this.storeData['otherParams'].otherVariables.CurrentCallLogID
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

  public resetPremiseSearch(): void {
    this.fieldVisibility.FurtherRecords = false;
    this.formGroup.controls['PremSelectedContract'].setValue('');
    this.formGroup.controls['PremiseSearchOn'].setValue('all');
    this.formGroup.controls['PremiseSearchValue'].setValue('');
    this.formGroup.controls['PremiseStatusCode'].setValue('all');
    this.formGroup.controls['PremiseContractTypeCode'].setValue(this.storeData['storeFormDataClone'].tabPremises.PremiseContractTypeCode);
  }

  public premiseCommenceDateFromSelectedValue(value: Object): void {
    if (value && value['value']) {
      let prev = this.premiseCommenceFromDateDisplay;
      this.premiseCommenceFromDateDisplay = value['value'];
      this.formGroup.controls['PremiseCommenceDateFrom'].setValue(this.premiseCommenceFromDateDisplay);
      if (this.initComplete && this.storeData['allowAjaxOnDateChange'] && prev !== value['value'])
        this.loadGridView();
    } else {
      this.premiseCommenceFromDateDisplay = '';
      this.formGroup.controls['PremiseCommenceDateFrom'].setValue('');
    }
  }

  public premiseCommenceDateToSelectedValue(value: Object): void {
    if (value && value['value']) {
      let prev = this.premiseCommenceToDateDisplay;
      this.premiseCommenceToDateDisplay = value['value'];
      this.formGroup.controls['PremiseCommenceDateTo'].setValue(this.premiseCommenceToDateDisplay);
      if (this.initComplete && this.storeData['allowAjaxOnDateChange'] && prev !== value['value'])
        this.loadGridView();
    } else {
      this.premiseCommenceToDateDisplay = '';
      this.formGroup.controls['PremiseCommenceDateTo'].setValue('');
    }
  }
}
