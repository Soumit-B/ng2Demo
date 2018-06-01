import { Component, NgZone, OnInit, OnDestroy, ViewChild, AfterViewInit, ElementRef, Renderer } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { URLSearchParams } from '@angular/http';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { HttpService } from '../../../../shared/services/http-service';
import { CallCenterActionTypes } from '../../../actions/call-centre-search';
import { ServiceConstants } from '../../../../shared/constants/service.constants';
import { GlobalConstant } from '../../../../shared/constants/global.constant';
import { GridComponent } from '../../../../shared/components/grid/grid';
import { Utils } from '../../../../shared/services/utility';
import { RiExchange } from '../../../../shared/services/riExchange';
import { ContractManagementModuleRoutes, CCMModuleRoutes, AppModuleRoutes, InternalMaintenanceApplicationModuleRoutes } from './../../../base/PageRoutes';
import { MntConst } from '../../../../shared/services/riMaintenancehelper';

@Component({
  selector: 'icabs-call-center-grid-event-history',
  templateUrl: 'iCABSCMCallCentreGridEventHistory.html'
})

export class CallCenterGridEventHistoryComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('eventHistoryGrid') eventHistoryGrid: GridComponent;
  public formGroup: FormGroup;
  public fieldVisibility: any = {
    EventHistoryForm: false,
    EventHistorySelectedContractPremise: true,
    EventHistoryType: true,
    EventHistoryViewType: true,
    DefaultEventHistoryEmailFrom: true,
    EventHistoryEmailAddress: true,
    FurtherRecords: false
  };
  public fieldRequired: any = {
    EventHistoryEmailAddress: false
  };
  public dateObjectsEnabled: any = {
    EventHistoryFromDate: true,
    EventHistoryToDate: true
  };
  public dateObjects: any = {
    EventHistoryFromDate: new Date(),
    EventHistoryToDate: new Date()
  };
  public eventHistoryFromDateDisplay: string = '';
  public eventHistoryToDateDisplay: string = '';
  public search: URLSearchParams = new URLSearchParams();
  public queryCallCentre: URLSearchParams = new URLSearchParams();
  public queryGrid: any = {
    operation: 'ContactManagement/iCABSCMCallCentreGrid',
    module: 'call-centre',
    method: 'ccm/maintenance',
    contentType: 'application/x-www-form-urlencoded'
  };
  public queryParamsCallCentre: any = {
    action: '0',
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
  public maxColumns: number = 5;
  public gridSortHeaders: Array<any> = [];
  public headerProperties: Array<any> = [];
  public validateProperties: Array<any> = [];
  private headerClicked: string;
  private sortType: string;
  private currentContractType: string = '';
  private currentContractTypeURLParameter: string = '';
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
      EventHistorySelectedContractPremise: [{ value: '', disabled: false }],
      EventHistoryType: [{ value: 'all', disabled: false }],
      EventHistoryToDate: [{ disabled: false }],
      EventHistoryFromDate: [{ disabled: false }],
      EventHistoryViewType: [{ value: 'screen', disabled: false }],
      DefaultEventHistoryEmailFrom: [{ value: '', disabled: false }],
      EventHistoryEmailAddress: [{ value: '', disabled: false }]
    });
  }

  ngOnInit(): void {
    this.setGridHeaders();
    this.storeSubscription = this.store.select('callcentresearch').subscribe(data => {
      this.storeData = data;
      if (this.storeData['fieldVisibility'] && this.storeData['fieldVisibility'].tabEventHistory) {
        this.fieldVisibility = this.storeData['fieldVisibility'].tabEventHistory;
      }
      if (this.storeData['dateObjects'] && this.storeData['dateObjects'].tabEventHistory) {
        this.dateObjects = this.storeData['dateObjects'].tabEventHistory;
      }
      if (this.storeData['dateVisibility'] && this.storeData['dateVisibility'].tabEventHistory) {
        this.dateObjectsEnabled = this.storeData['dateVisibility'].tabEventHistory;
      }
      if (data && data['action']) {
        switch (data['action']) {
          case CallCenterActionTypes.BUILD_SPECIFIC_GRID:
            if (this.storeData['gridToBuild'].indexOf('EventHistory') > -1) {
              this.loadGridView();
            }
            break;
          case CallCenterActionTypes.CLEAR_SPECIFIC_GRID:
            if (this.storeData['gridToClear'].indexOf('EventHistory') > -1) {
              this.eventHistoryGrid.clearGridData();
            }
            break;
          case CallCenterActionTypes.RESET_ALL_SEARCH_DETAILS:
            this.resetDate();
            break;
          case CallCenterActionTypes.SET_PAGINATION:
            if (this.storeData['storeSavedData']['pagination']) {
              this.currentPage = this.storeData['storeSavedData']['pagination'].tabEventHistory;
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
        tabEventHistory: this.formGroup
      }
    });
    this.store.dispatch({
      type: CallCenterActionTypes.SAVE_DATE_VISIBILITY, payload: {
        tabEventHistory: this.dateObjectsEnabled
      }
    });
    this.store.dispatch({
      type: CallCenterActionTypes.SAVE_VISIBILITY_FIELD, payload: {
        tabEventHistory: this.fieldVisibility
      }
    });
    this.store.dispatch({
      type: CallCenterActionTypes.SAVE_DATE_OBJECTS, payload: {
        tabEventHistory: this.dateObjects
      }
    });
    this.store.dispatch({
      type: CallCenterActionTypes.INITIALIZATION, payload: {
        tabEventHistory: true
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
      this.fieldVisibility.EventHistoryForm = true;
      this.formGroup.controls['EventHistoryViewType'].setValue('screen');
      this.eventHistoryViewTypeOnChange({});
    }
    setTimeout(() => {
      this.paginationCurrentPage = this.currentPage;
    }, 0);
  }
  public onGridRowClick(data: any): void {
    this.onGridCellClick(data);
    if (data.cellIndex === 0) {
      if (this.storeData['otherParams'].otherVariables.CurrentEventHistoryType === 'InvoiceHeader') {
        this.store.dispatch({
          type: CallCenterActionTypes.SHOW_PRINT_INVOICE, payload: [this.storeData['otherParams'].otherVariables.CurrentEventHistoryRowid]
        });
      }
      if (this.storeData['otherParams'].otherVariables.CurrentEventHistoryType === 'ContactAction') {
        //iCABSCMContactActionMaintenance
        this.router.navigate([AppModuleRoutes.CCM + CCMModuleRoutes.ICABSCMCONTACTACTIONMAINTENANCE], {
          queryParams: {
            parentMode: 'ContactHistory',
            ROWID: this.storeData['otherParams'].otherVariables.AccountNumber
          }
        });
        /*this.router.navigate(['/contractmanagement/account/maintenance'], { queryParams: {
          parentMode: 'ContactHistory',
          accountNumber: this.storeData['otherParams'].otherVariables.AccountNumber
        }});*/
        alert('Page not part of current sprint');
      }
      if (this.storeData['otherParams'].otherVariables.CurrentEventHistoryType === 'CustomerContact') {
        //iCABSCMCustomerContactDetailGrid
        /*this.router.navigate([ContractManagementModuleRoutes.ICABSAACCOUNTMAINTENANCE], { queryParams: {
          parentMode: 'ContactHistory',
          accountNumber: this.storeData['otherParams'].otherVariables.AccountNumber
        }});*/
        alert('Page not part of current sprint');
      }
      if (this.storeData['otherParams'].otherVariables.CurrentEventHistoryType === 'PlanVisit') {
        //iCABSAPlanVisitMaintenance
        this.router.navigate([InternalMaintenanceApplicationModuleRoutes.ICABSAPLANVISITMAINTENANCE], {
          queryParams: {
            parentMode: 'ContactHistory',
            AccountNumber: this.storeData['otherParams'].otherVariables.AccountNumber,
            PlanVisitRowId: data.trRowData[0].rowID
          }
        });
      }
      if (this.storeData['otherParams'].otherVariables.CurrentEventHistoryType === 'ServiceVisit') {
        //iCABSSeServiceVisitMaintenance
        /*this.router.navigate([ContractManagementModuleRoutes.ICABSAACCOUNTMAINTENANCE], { queryParams: {
          parentMode: 'ContactHistory',
          AccountNumber: this.storeData['otherParams'].otherVariables.AccountNumber
        }});*/
        alert('Page not part of current sprint');
      }
    }

    if (data.cellIndex === 4) {
      if (this.storeData['otherParams'].otherVariables.CurrentEventHistoryType === 'ServiceVisit') {
        if (this.storeData['formGroup'].tabEventHistory.controls['EventHistoryViewType'].value === 'email') {
          if (this.storeData['formGroup'].tabEventHistory.controls['EventHistoryViewType'].value === '') {
            this.storeData['formGroup'].tabEventHistory.controls['EventHistoryViewType'].markAsTouched();
            this.storeData['formGroup'].tabEventHistory.controls['EventHistoryViewType'].updateValueAndValidity();
            return;
          }
          this.showServiceVisitViaEmail(data.cellData.rowID);
        } else {
          this.showServiceVisitToScreen(data.cellData.rowID);
        }
      }

      if (this.storeData['otherParams'].otherVariables.CurrentEventHistoryType === 'InvoiceHeader') {
        if (this.storeData['formGroup'].tabEventHistory.controls['EventHistoryViewType'].value === 'email') {
          this.storeData['formGroup'].tabInvoices.controls['InvoiceEmailAddress'].setValue(this.storeData['formGroup'].tabEventHistory.controls['EventHistoryEmailAddress'].value);
          this.storeData['otherParams'].otherVariables.SelectedInvoiceRowID = this.storeData['otherParams'].otherVariables.CurrentEventHistoryRowid;
          this.store.dispatch({
            type: CallCenterActionTypes.SHOW_EMAIL_INVOICE, payload: [this.storeData['otherParams'].otherVariables.CurrentEventHistoryRowid]
          });
        } else {
          this.store.dispatch({
            type: CallCenterActionTypes.SHOW_PRINT_INVOICE, payload: [this.storeData['otherParams'].otherVariables.CurrentEventHistoryRowid]
          });
        }
      }

      if (this.storeData['otherParams'].otherVariables.CurrentEventHistoryType === 'ContractRenewal') {
        this.contractRenewalPrint(data.cellData.additionalData);
      }
    }
  }
  public getCellDataOnBlur(data: any): void {
    // statement
  }
  public onGridCellClick(data: any): void {
    this.storeData['otherParams'].otherVariables.CurrentEventHistoryType = data.trRowData[0].additionalData;
    this.storeData['otherParams'].otherVariables.CurrentEventHistoryRowid = data.trRowData[0].rowID;
    this.currentContractType = data.trRowData[3].additionalData;
    switch (this.currentContractType) {
      case 'C':
        this.currentContractTypeURLParameter = '';
        break;
      case 'J':
        this.currentContractTypeURLParameter = '<job>';
        break;
      case 'P':
        this.currentContractTypeURLParameter = '<product>';
        break;
      default:
        // code...
        break;
    }

  }

  public cmdEventHistoryClearSelectedOnClick(event: any): void {
    if (this.storeData['otherParams'].otherVariables.EventHistorySelectedContract !== '' && this.storeData['otherParams'].otherVariables.EventHistorySelectedPremise !== '') {
      this.storeData['otherParams'].otherVariables.EventHistorySelectedPremise = '';
      this.formGroup.controls['EventHistorySelectedContractPremise'].setValue(this.storeData['otherParams'].otherVariables.EventHistorySelectedContract);
      this.loadGridView();
    } else if (this.storeData['otherParams'].otherVariables.EventHistorySelectedContract !== '') {
      this.storeData['otherParams'].otherVariables.EventHistorySelectedContract = '';
      this.storeData['otherParams'].otherVariables.EventHistorySelectedPremise = '';
      this.formGroup.controls['EventHistorySelectedContractPremise'].setValue('');
      this.loadGridView();
    }
  }

  public eventHistoryViewTypeOnChange(event: any): void {
    if (this.formGroup.controls['EventHistoryViewType'].value === 'email') {
      this.fieldVisibility.DefaultEventHistoryEmailFrom = true;
      this.fieldVisibility.EventHistoryEmailAddress = true;
      this.formGroup.controls['EventHistoryEmailAddress'].setValidators(Validators.required);
      this.fieldRequired.EventHistoryEmailAddress = true;
      this.formGroup.controls['DefaultEventHistoryEmailFrom'].setValue('account');
      this.defaultEventHistoryEmailFromOnChange({});
    } else {
      this.formGroup.controls['EventHistoryEmailAddress'].clearValidators();
      this.fieldRequired.EventHistoryEmailAddress = false;
      this.fieldVisibility.DefaultEventHistoryEmailFrom = false;
      this.fieldVisibility.EventHistoryEmailAddress = false;
    }
  }

  public defaultEventHistoryEmailFromOnChange(event: any): void {
    if (this.formGroup.controls['DefaultEventHistoryEmailFrom'].value === 'account') {
      this.formGroup.controls['EventHistoryEmailAddress'].setValue(this.storeData['formGroup'].tabAccounts.controls['AccountContactEmail'].value);
    }

    if (this.formGroup.controls['DefaultEventHistoryEmailFrom'].value === 'contract') {
      this.formGroup.controls['EventHistoryEmailAddress'].setValue(this.storeData['otherParams'].otherVariables.ContractContactEmail);
    }

    if (this.formGroup.controls['DefaultEventHistoryEmailFrom'].value === 'premise') {
      this.formGroup.controls['EventHistoryEmailAddress'].setValue(this.storeData['formGroup'].tabPremises.controls['PremiseContactEmail'].value);
    }
  }

  public contractRenewalPrint(property: any): void {
    this.fetchCallCentreDataGet('', { action: 0, ReportNumber: property }).subscribe((data) => {
      if (data['status'] === GlobalConstant.Configuration.Failure) {
        this.store.dispatch({
          type: CallCenterActionTypes.DISPLAY_ERROR, payload: data['oResponse']
        });
      } else {
        if (!data['errorMessage']) {
          if (data.url) {
            window.open(data.url, '_blank');
          }
        }
      }
    });
  }

  public showServiceVisitViaEmail(rowId: any): void {
    if (this.storeData['otherParams'].otherVariables.CurrentCallLogID === '' && this.storeData['formGroup'].main.controls['VisibleCurrentCallLogID'].value === '') {
      /*let click = new CustomEvent('click', { bubbles: true });
      let elem = document.querySelector('#CmdNewCall');
      if (elem)
        this.renderer.invokeElementMethod(elem, 'click', [click]);*/
      this.storeData['subject']['CmdNewCallSent'].asObservable().subscribe((recieved) => {
        if (recieved['type'] === 'Events') {
          this.serviceVisitViaEmail(rowId);
        }
        this.storeData['subject']['CmdNewCallSent'].unsubscribe();
      });
      this.storeData['subject']['CmdNewCallRecieved'].next({
        type: 'Events'
      });
    } else {
      this.serviceVisitViaEmail(rowId);
    }
  }

  public serviceVisitViaEmail(rowId: any): void {
    this.fetchCallCentreDataPost('EmailServiceVisit', {}, {
      BusinessCode: this.storeData['code'].business,
      CallLogID: this.storeData['formGroup'].main.controls['VisibleCurrentCallLogID'].value || this.storeData['otherParams'].otherVariables.CurrentCallLogID,
      PremiseVisitROWID: rowId,
      EmailAddress: this.formGroup.controls['EventHistoryEmailAddress'].value
    }).subscribe((data) => {
      if (data['status'] === GlobalConstant.Configuration.Failure) {
        this.store.dispatch({
          type: CallCenterActionTypes.DISPLAY_ERROR, payload: data['oResponse']
        });
      } else {
        if (!data['errorMessage']) {
          this.store.dispatch({
            type: CallCenterActionTypes.DISPLAY_MESSAGE, payload: data['ReturnMessage']
          });
          this.storeData['otherParams'].otherVariables.CCMChangesMade = 'Y';
          //this.formGroup.controls['VisibleCurrentCallLogID'].setValue(data.CallLogID);

          let click = new CustomEvent('click', { bubbles: true });
          this.renderer.invokeElementMethod(document.querySelector('#CmdEndCall'), 'dispatchEvent', [click]);
        } else {
          this.store.dispatch({
            type: CallCenterActionTypes.DISPLAY_ERROR, payload: data['errorMessage']
          });
        }
      }
    });
  }

  public showServiceVisitToScreen(rowId: any): void {
    let strURL;
    let strServiceReceipt;
    this.fetchCallCentreDataPost('GetVisitWork', {}, {
      BusinessCode: this.storeData['code'].business,
      PremiseVisitROWID: rowId
    }).subscribe((data) => {
      if (data['status'] === GlobalConstant.Configuration.Failure) {
        this.store.dispatch({
          type: CallCenterActionTypes.DISPLAY_ERROR, payload: data['oResponse']
        });
      } else {
        if (!data['errorMessage']) {
          if (data['ServiceReceipt'] !== null && data['ServiceReceipt'] !== '') {
            strServiceReceipt = data['ServiceReceipt'];
            let reportParams = '&riCacheControlMaxAge=0' + '&BusinessCode=' + this.storeData['code'].business + '&ServiceReceipt=' + strServiceReceipt;
            // iCABSCMCallCentreGridServiceReceiptReport
            /*this.router.navigate(['/billtocash/contract/invoice'], { queryParams: reportParams});*/
          } else {
            this.fetchCallCentreDataGet('Single', { action: 0, PremiseVisitRowID: rowId, BusinessCode: this.storeData['code'].business }).subscribe((data) => {
              if (data['status'] === GlobalConstant.Configuration.Failure) {
                this.store.dispatch({
                  type: CallCenterActionTypes.DISPLAY_ERROR, payload: data['oResponse']
                });
              } else {
                if (!data['errorMessage']) {
                  if (data.url) {
                    window.open(data.url, '_blank');
                  }
                }
              }
            });
          }
        }
      }
    });
  }
  public refresh(): void {
    this.loadGridView();
  }

  public fetchCallCentreDataPost(functionName: string, params: Object, formData: Object): any {
    this.queryCallCentre = new URLSearchParams();
    let businessCode = (this.storeData['code'] && this.storeData['code'].business) ? this.storeData['code'].business : this.utils.getBusinessCode();
    let countryCode = (this.storeData['code'] && this.storeData['code'].country) ? this.storeData['code'].country : this.utils.getCountryCode();
    this.queryCallCentre.set(this.serviceConstants.BusinessCode, businessCode);
    this.queryCallCentre.set(this.serviceConstants.CountryCode, countryCode);
    if (functionName !== '') {
      this.queryCallCentre.set(this.serviceConstants.Action, '6');
      this.queryCallCentre.set('Function', functionName);
    }
    for (let key in params) {
      if (key) {
        this.queryCallCentre.set(key, params[key]);
      }
    }
    return this.httpService.makePostRequest(this.queryParamsCallCentre.method, this.queryParamsCallCentre.module, this.queryParamsCallCentre.operation, this.queryCallCentre, formData);
  }

  public fetchCallCentreDataGet(functionName: string, params: Object): any {
    this.queryCallCentre = new URLSearchParams();
    let businessCode = (this.storeData['code'] && this.storeData['code'].business) ? this.storeData['code'].business : this.utils.getBusinessCode();
    let countryCode = (this.storeData['code'] && this.storeData['code'].country) ? this.storeData['code'].country : this.utils.getCountryCode();
    this.queryCallCentre.set(this.serviceConstants.BusinessCode, businessCode);
    this.queryCallCentre.set(this.serviceConstants.CountryCode, countryCode);
    if (functionName !== '') {
      this.queryCallCentre.set(this.serviceConstants.Action, '6');
      this.queryCallCentre.set('Function', functionName);
    }
    for (let key in params) {
      if (key) {
        this.queryCallCentre.set(key, params[key]);
      }
    }
    return this.httpService.makeGetRequest(this.queryParamsCallCentre.method, this.queryParamsCallCentre.module, this.queryParamsCallCentre.operation, this.queryCallCentre);
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
            'type': MntConst.eTypeImage,
            'index': 2,
            'align': 'center'
        },
        {
            'type': MntConst.eTypeTextFree,
            'index': 3,
            'align': 'center'
        },
        {
            'type': MntConst.eTypeImage,
            'index': 4,
            'align': 'center'
        }
    ];
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
    this.search.set('GridName', 'EventHistory');
    this.search.set('AccountNumber', this.utils.checkIfValueExistAndReturn(this.storeData['otherParams'].otherVariables, 'AccountNumber'));
    this.search.set('ProspectNumber', this.utils.checkIfValueExistAndReturn(this.storeData['otherParams'].otherVariables, 'ProspectNumber'));
    this.search.set('ContractNumber', this.utils.checkIfValueExistAndReturn(this.storeData['otherParams'].otherVariables, 'EventHistorySelectedContract'));
    this.search.set('PremiseNumber', this.utils.checkIfValueExistAndReturn(this.storeData['otherParams'].otherVariables, 'EventHistorySelectedPremise'));
    this.search.set('EventHistoryType', this.formGroup.controls['EventHistoryType'] ? this.formGroup.controls['EventHistoryType'].value : '');
    this.search.set('EventHistoryFromDate', this.formGroup.controls['EventHistoryFromDate'].value);
    this.search.set('EventHistoryToDate', this.formGroup.controls['EventHistoryToDate'].value);
    this.search.set('riSortOrder', 'Ascending');
    this.search.set('riGridMode', '0');
    this.search.set('riGridHandle', (Math.floor(Math.random() * 900000) + 100000).toString());
    this.search.set('HeaderClickedColumn', '');
    this.search.set('PageSize', this.pageSize.toString());
    this.search.set('PageCurrent', this.currentPage.toString());
    this.inputParams.search = this.search;
    this.eventHistoryGrid.loadGridData(this.inputParams);
    this.storeData['pagination'].tabEventHistory = this.currentPage;
  }

  public eventHistoryFromDateSelectedValue(value: Object): void {
    if (value && value['value']) {
      let prev = this.eventHistoryFromDateDisplay;
      this.eventHistoryFromDateDisplay = value['value'];
      this.formGroup.controls['EventHistoryFromDate'].setValue(this.eventHistoryFromDateDisplay);
      if (this.initComplete && this.storeData['allowAjaxOnDateChange'] && prev !== value['value'])
        this.loadGridView();
    } else {
      this.eventHistoryFromDateDisplay = '';
      this.formGroup.controls['EventHistoryFromDate'].setValue('');
    }
  }

  public eventHistoryToDateSelectedValue(value: Object): void {
    if (value && value['value']) {
      let prev = this.eventHistoryToDateDisplay;
      this.eventHistoryToDateDisplay = value['value'];
      this.formGroup.controls['EventHistoryToDate'].setValue(this.eventHistoryToDateDisplay);
      if (this.initComplete && this.storeData['allowAjaxOnDateChange'] && prev !== value['value'])
        this.loadGridView();
    } else {
      this.eventHistoryToDateDisplay = '';
      this.formGroup.controls['EventHistoryToDate'].setValue('');
    }
  }

  public eventHistoryTypeOnKeyDown(event: any): void {
    if (event.keyCode === 13) {
      this.loadGridView();
    }
  }

  private resetDate(): void {
    let date = new Date();
    this.dateObjects.EventHistoryFromDate = new Date(date.setDate(date.getDate() - this.storeData['otherParams'].registry.giEventHistoryFromDays));
    this.dateObjects.EventHistoryToDate = new Date();
  }
}
