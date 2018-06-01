import { Component, NgZone, OnInit, OnDestroy, ViewChild, AfterViewInit, Renderer } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from '../../../../shared/services/http-service';
import { Store } from '@ngrx/store';
import { TranslateService } from 'ng2-translate/ng2-translate';
import { Subscription } from 'rxjs/Subscription';
import { URLSearchParams } from '@angular/http';
import { CallCenterActionTypes } from '../../../actions/call-centre-search';
import { ServiceConstants } from '../../../../shared/constants/service.constants';
import { GlobalConstant } from '../../../../shared/constants/global.constant';
import { GridComponent } from '../../../../shared/components/grid/grid';
import { Utils } from '../../../../shared/services/utility';
import { RiExchange } from '../../../../shared/services/riExchange';
import { MntConst } from '../../../../shared/services/riMaintenancehelper';
import { ContractManagementModuleRoutes, InternalGridSearchServiceModuleRoutes, InternalMaintenanceServiceModuleRoutes } from './../../../base/PageRoutes';

@Component({
  selector: 'icabs-call-center-grid-accounts',
  templateUrl: 'iCABSCMCallCentreGridAccounts.html'
})

export class CallCenterGridAccountsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('accountsGrid') accountsGrid: GridComponent;
  public formGroup: FormGroup;
  public fieldVisibility: any = {
    AccountForm: false,
    AccountSearchOn: true,
    AccountSearchValue: true,
    AccountStatus: true,
    AccountNational: true,
    AccountContractType: true,
    AccountSearchOn2: true,
    AccountSearchValue2: true,
    AccountDataSet: true,
    CmdClearSearch: true,
    AccountName: true,
    AccountContactName: true,
    CmdContactAccount: false,
    AccountAddressLine1: true,
    AccountContactPosition: true,
    AccountAddressLine2: true,
    AccountContactTelephone: true,
    AccountAddressLine3: false,
    AccountContactMobile: true,
    AccountAddressLine4: true,
    AccountContactFax: true,
    AccountAddressLine5: true,
    AccountContactEmail: true,
    AccountPostcode: true,
    NoneAccountComments: false,
    FurtherRecords: false
  };
  public dropdownList: any = {
    AccountSearchOn: [
      { value: 'AccountNo', desc: 'Account Number' },
      { value: 'Address', desc: 'Address' },
      { value: 'CallRef', desc: 'Log Reference' },
      { value: 'ClientRef', desc: 'Client Reference' },
      { value: 'ContractNo', desc: 'Contract Number' },
      { value: 'CustomerContactNo', desc: 'Ticket Number' },
      { value: 'TicketReference', desc: 'Ticket Reference (Customer)' },
      { value: 'InvoiceNumber', desc: 'Invoice Number' },
      { value: 'Name', desc: 'Name' },
      { value: 'PostCode', desc: 'Postcode' },
      { value: 'ProspectNo', desc: 'Prospect Number' },
      { value: 'PurchaseOrderNo', desc: 'Purchase Order No' },
      { value: 'SOQuoteRef', desc: 'Sales Quote Reference' },
      { value: 'CompanyVATNumber', desc: 'Tax Registration No' },
      { value: 'Telephone', desc: 'Telephone' },
      { value: 'TelesalesOrderNumber', desc: 'Telesales Order Number' },
      { value: 'GroupAccountNo', desc: 'Group Account Number' },
      { value: 'WONumber', desc: 'Work Order Number' },
      { value: 'CustomerVisitRef', desc: 'Customer Visit Reference' }
    ],
    AccountContractType: [
      {
        value: '', desc: ''
      }]
  };
  public maxLength: any = {
    AccountSearchValue: 40
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
  public displayCountryBusiness: boolean = false;
  public gridSortHeaders: Array<any> = [];
  public headerProperties: Array<any> = [];
  public validateProperties: Array<any> = [];
  public sortIndex: Array<any> = [];
  private headerClicked: string;
  private sortType: string;
  private storeSubscription: Subscription;
  private translateSubscription: Subscription;
  private storeData: any;
  private triggerFromAccount: boolean = false;
  constructor(
    private zone: NgZone,
    private fb: FormBuilder,
    private router: Router,
    private store: Store<any>,
    private httpService: HttpService,
    private utils: Utils,
    private renderer: Renderer,
    private serviceConstants: ServiceConstants,
    private riExchange: RiExchange,
    public translate: TranslateService
  ) {
    this.formGroup = this.fb.group({
      AccountSearchOn: [{ value: '', disabled: false }],
      AccountSearchValue: [{ value: '', disabled: false }],
      AccountStatus: [{ value: 'all', disabled: false }],
      AccountNational: [{ value: 'all', disabled: false }],
      AccountContractType: [{ value: '', disabled: false }],
      AccountSearchOn2: [{ value: 'none', disabled: false }],
      AccountSearchValue2: [{ value: '', disabled: false }],
      AccountDataSet: [{ value: 'all', disabled: false }],
      CmdClearSearch: [{ disabled: false }],
      AccountName: [{ value: '', disabled: true }],
      AccountContactName: [{ value: '', disabled: true }],
      CmdContactAccount: [{ value: '', disabled: false }],
      AccountAddressLine1: [{ value: '', disabled: true }],
      AccountContactPosition: [{ value: '', disabled: true }],
      AccountAddressLine2: [{ value: '', disabled: true }],
      AccountContactTelephone: [{ value: '', disabled: true }],
      AccountAddressLine3: [{ value: '', disabled: true }],
      AccountContactMobile: [{ value: '', disabled: true }],
      AccountAddressLine4: [{ value: '', disabled: true }],
      AccountContactFax: [{ value: '', disabled: true }],
      AccountAddressLine5: [{ value: '', disabled: true }],
      AccountContactEmail: [{ value: '', disabled: true }],
      AccountPostcode: [{ value: '', disabled: true }],
      NoneAccountComments: [{ value: '', disabled: true }],
      AccountFurtherRecords: [{ value: '', disabled: true }]
    });
  }

  ngOnInit(): void {
    this.setGridHeaders();
    this.dropdownList.AccountSearchOn.sort(function (a: any, b: any): any { return (a.desc > b.desc) ? 1 : ((b.desc > a.desc) ? -1 : 0); });
    this.storeSubscription = this.store.select('callcentresearch').subscribe(data => {
      this.storeData = data;
      if (this.storeData['fieldVisibility'] && this.storeData['fieldVisibility'].tabAccounts) {
        this.fieldVisibility = this.storeData['fieldVisibility'].tabAccounts;
      }
      if (this.storeData['dropdownList'] && this.storeData['dropdownList'].tabAccounts) {
        this.dropdownList = this.storeData['dropdownList'].tabAccounts;
      }
      /*if (this.storeData['formGroup'] && this.storeData['formGroup'].tabAccounts) {
        this.formGroup = this.storeData['dropdownList'].tabAccounts;
      }*/
      if (data && data['action']) {
        switch (data['action']) {
          case CallCenterActionTypes.BUILD_GRID:
            if (!this.triggerFromAccount) {
              this.loadGridView();
            } else {
              this.triggerFromAccount = false;
            }
            break;
          case CallCenterActionTypes.BUILD_SPECIFIC_GRID:
            if (this.storeData['gridToBuild'].indexOf('Accounts') > -1) {
              this.currentPage = 1;
              this.loadGridView();
            }
            break;
          case CallCenterActionTypes.CLEAR_SPECIFIC_GRID:
            if (this.storeData['gridToClear'].indexOf('Accounts') > -1) {
              this.accountsGrid.clearGridData();
            }
            break;
          case CallCenterActionTypes.SET_PAGINATION:
            if (this.storeData['storeSavedData']['pagination']) {
              this.currentPage = this.storeData['storeSavedData']['pagination'].tabAccounts;
              this.loadGridView();
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
        tabAccounts: this.formGroup
      }
    });
    this.store.dispatch({
      type: CallCenterActionTypes.SAVE_VISIBILITY_FIELD, payload: {
        tabAccounts: this.fieldVisibility
      }
    });
    this.store.dispatch({
      type: CallCenterActionTypes.SAVE_DROPDOWN_LIST, payload: {
        tabAccounts: this.dropdownList
      }
    });
    this.store.dispatch({
      type: CallCenterActionTypes.INITIALIZATION, payload: {
        tabAccounts: true
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
      let formArray = [];
      let indexFactorForAllBusiness = 0;
      if (this.storeData['code'].multiBusiness === 'All') {
        this.maxColumns = 14;
        indexFactorForAllBusiness = 2;
        formArray = this.getRowAdditionalData(info.gridData.body.cells.slice(0, this.maxColumns), 4);
      } else {
        this.maxColumns = 12;
        formArray = this.getRowAdditionalData(info.gridData.body.cells.slice(0, this.maxColumns), 2);
      }
      if (!(this.storeData['storeSavedData'] && this.storeData['storeSavedData'].main && !(Object.keys(this.storeData['storeSavedData'].main).length === 0 && this.storeData['storeSavedData'].main.constructor === Object))) {
        this.populateForm(formArray, 0, 0, info.gridData.body.cells.slice(0, this.maxColumns), indexFactorForAllBusiness);
        this.storeData['index'].tabAccounts['rowIndex'] = 0;
        this.storeData['index'].tabAccounts['cellIndex'] = 0;
        this.triggerFromAccount = true;
      } else {
        if (this.storeData['storeSavedData']['index'] && this.storeData['storeSavedData']['index']['tabAccounts'] && !(Object.keys(this.storeData['storeSavedData']['index']['tabAccounts']).length === 0 && this.storeData['storeSavedData']['index']['tabAccounts'].constructor === Object)) {
          if (this.storeData['storeSavedData']['index']['tabAccounts'].rowIndex !== undefined && this.storeData['storeSavedData']['index']['tabAccounts'].rowIndex !== null && this.storeData['storeSavedData']['index']['tabAccounts'].cellIndex !== undefined && this.storeData['storeSavedData']['index']['tabAccounts'].cellIndex !== null) {
            this.onGridCellClick({
              trRowData: info.gridData.body.cells.slice(((this.storeData['storeSavedData']['index']['tabAccounts'].rowIndex) * this.maxColumns), (((this.storeData['storeSavedData']['index']['tabAccounts'].rowIndex) * this.maxColumns) + this.maxColumns)),
              cellIndex: this.storeData['storeSavedData']['index']['tabAccounts'].cellIndex,
              rowIndex: this.storeData['storeSavedData']['index']['tabAccounts'].rowIndex
            });
          }
          //this.storeData['storeSavedData']['index']['tabAccounts'] = {};
        }
      }
      this.setTabRefresh();

    } else {
      this.fieldVisibility.AccountForm = false;
    }
    if (this.formGroup.controls['AccountSearchOn2'].value === 'none') {
      this.formGroup.controls['AccountSearchValue2'].setValue('');
      this.formGroup.controls['AccountSearchValue2'].disable();
    }
  }

  public getRowAdditionalData(gridData: any, pos: number): any {
    if (gridData[pos].additionalData) {
      return gridData[pos].additionalData.split('|');
    }
  }

  public onGridRowDblClick(data: any): void {
    this.onGridCellClick(data);
    let formArray = this.getRowAdditionalData(data.trRowData, 2);
    if (data.cellIndex === 0) {
      if (data.trRowData[data.cellIndex].text !== '' && data.trRowData[data.cellIndex].drillDown) {
        if (this.storeData['otherParams'].otherVariables.AccountNumber !== null && this.storeData['otherParams'].otherVariables.AccountNumber.toString().indexOf('-') === -1) {
          if (this.storeData['otherParams'].otherVariables.CurrentCallLogID === '' && (this.storeData['formGroup'].main.controls['VisibleCurrentCallLogID'].value === '' || this.storeData['formGroup'].main.controls['VisibleCurrentCallLogID'].value === '0')) {
            //this.cmdNewCallOnClick({});
            /*let click = new CustomEvent('click', { bubbles: true });
            let elem = document.querySelector('#CmdNewCall');
            if (elem)
            this.renderer.invokeElementMethod(elem, 'click', [click]);*/
            this.storeData['subject']['CmdNewCallSent'].asObservable().subscribe((recieved) => {
              if (recieved['type'] === 'Accounts') {
                if (this.storeData['otherParams'].otherVariables.AccountNumber !== '') {
                  this.router.navigate([ContractManagementModuleRoutes.ICABSAACCOUNTMAINTENANCE], {
                    queryParams: {
                      parentMode: 'CallCentreSearch',
                      AccountNumber: this.storeData['formGroup'].main.controls['AccountProspectNumber'].value || data.trRowData[0].text,
                      AccountName: formArray[1],
                      CurrentCallLogID: this.storeData['otherParams'].otherVariables.CurrentCallLogID
                    }
                  });
                }
              }
              this.storeData['subject']['CmdNewCallSent'].unsubscribe();
            });
            this.storeData['subject']['CmdNewCallRecieved'].next({
              type: 'Accounts'
            });
          } else {
            if (this.storeData['otherParams'].otherVariables.AccountNumber !== '') {
              this.router.navigate([ContractManagementModuleRoutes.ICABSAACCOUNTMAINTENANCE], {
                queryParams: {
                  parentMode: 'CallCentreSearch',
                  AccountNumber: this.storeData['formGroup'].main.controls['AccountProspectNumber'].value || data.trRowData[0].text,
                  AccountName: formArray[1]
                }
              });
            }
          }
        }
      }
    } else if (data.cellIndex === 1) {
      if (data.trRowData[data.cellIndex].text !== '' && data.trRowData[data.cellIndex].drillDown) {
        let prospectAction = false;
        if (this.storeData['otherParams'].otherVariables.CurrentCallLogID === '' && this.storeData['formGroup'].main.controls['VisibleCurrentCallLogID'].value === '') {
          this.fetchCallCentreDataPost('NewCall', {}, { BusinessCode: this.storeData['code'].business }).subscribe((e) => {
            if (!e['errorMessage']) {
              this.storeData['otherParams'].otherVariables.CurrentCallLogID = e.CallLogID;
              let parentMode;
              if (prospectAction) {
                parentMode = 'CallCentreSearchNew';
              } else {
                parentMode = 'CallCentreSearch';
              }
              // PipelineProspect
              this.router.navigate(['/prospecttocontract/maintenance/prospect'], {
                queryParams: {
                  parentMode: parentMode,
                  AccountNumber: this.storeData['formGroup'].main.controls['AccountProspectNumber'].value || data.trRowData[0].text,
                  AccountName: formArray[1],
                  ProspectNumber: data.trRowData[data.cellIndex].text,
                  CurrentCallLogID: e.CallLogID,
                  CallContactName: formArray[8],
                  CallContactPosition: formArray[9],
                  CallContactTelephone: formArray[10],
                  CallContactMobile: formArray[11],
                  CallContactFax: formArray[12],
                  CallContactEmail: formArray[13],
                  ContactRowID: data.trRowData[1].rowID
                }
              });
            }
          });
        }
      }
    } else if (data.cellIndex === 11) {
      // iCABSACustomerInformationSummary
      this.router.navigate([InternalGridSearchServiceModuleRoutes.ICABSACUSTOMERINFORMATIONSUMMARY.URL_1], {
        queryParams: {
          parentMode: 'Account',
          AccountName: formArray[1],
          AccountNumber: this.storeData['formGroup'].main.controls['AccountProspectNumber'].value || data.trRowData[0].text || this.storeData['otherParams'].otherVariables.AccountNumber
        }
      });
    } else if (data.cellIndex === 9) {
      if (this.storeData['otherParams'].otherVariables.CurrentCallLogID === '' && (this.storeData['formGroup'].main.controls['VisibleCurrentCallLogID'].value === '' || this.storeData['formGroup'].main.controls['VisibleCurrentCallLogID'].value === null)) {
        this.fetchCallCentreDataPost('NewCall', {}, { BusinessCode: this.storeData['code'].business }).subscribe((e) => {
          if (!e['errorMessage']) {
            this.storeData['otherParams'].otherVariables.CurrentCallLogID = e.CallLogID;
            // iCABSCMTelesalesEntry
            this.router.navigate([InternalMaintenanceServiceModuleRoutes.ICABSCMTELESALESENTRY], {
              queryParams: {
                parentMode: 'AccountTeleSalesOrder',
                AccountName: formArray[1],
                AccountNumber: this.storeData['formGroup'].main.controls['AccountProspectNumber'].value || data.trRowData[0].text || this.storeData['otherParams'].otherVariables.AccountNumber,
                CurrentCallLogID: e.CallLogID
              }
            });
          }
        });
      } else {
        // iCABSCMTelesalesEntry
        this.router.navigate([InternalMaintenanceServiceModuleRoutes.ICABSCMTELESALESENTRY], {
          queryParams: {
            parentMode: 'AccountTeleSalesOrder',
            AccountName: formArray[1],
            AccountNumber: this.storeData['formGroup'].main.controls['AccountProspectNumber'].value || data.trRowData[0].text || this.storeData['otherParams'].otherVariables.AccountNumber,
            CurrentCallLogID: this.storeData['formGroup'].main.controls['VisibleCurrentCallLogID'].value || this.storeData['otherParams'].otherVariables.CurrentCallLogID
          }
        });
      }
    }
  }

  public onGridCellClick(data: any): void {
    let formArray = [];
    let indexFactorForAllBusiness = 0;
    if (this.storeData['code'].multiBusiness === 'All') {
      formArray = this.getRowAdditionalData(data.trRowData, 4);
      indexFactorForAllBusiness = 2;
    } else {
      formArray = this.getRowAdditionalData(data.trRowData, 2);
    }
    this.setTabRefresh();
    if ((data.cellIndex === (0 + indexFactorForAllBusiness) && data.trRowData[1 + indexFactorForAllBusiness].text === '') || (data.cellIndex === (1 + indexFactorForAllBusiness) && data.trRowData[1 + indexFactorForAllBusiness].text !== '') || data.cellIndex === (6 + indexFactorForAllBusiness) || data.cellIndex === (7 + indexFactorForAllBusiness) || data.cellIndex === (8 + indexFactorForAllBusiness) || data.cellIndex === (9 + indexFactorForAllBusiness) || data.cellIndex === (11 + indexFactorForAllBusiness)) {
      this.populateForm(formArray, data.cellIndex, data.rowIndex, data.trRowData, indexFactorForAllBusiness);
      this.storeData['index'].tabAccounts['rowIndex'] = data.rowIndex;
      this.storeData['index'].tabAccounts['cellIndex'] = data.cellIndex;
    }
  }

  public setTabRefresh(): void {
    this.storeData['refresh'].tabContracts = true;
    this.storeData['refresh'].tabLogs = true;
    this.storeData['refresh'].tabDashboard = true;
    this.storeData['refresh'].tabDlContract = true;
    this.storeData['refresh'].tabEventHistory = true;
    this.storeData['refresh'].tabHistory = true;
    this.storeData['refresh'].tabInvoices = true;
    this.storeData['refresh'].tabPremises = true;
    this.storeData['refresh'].tabWorkOrders = true;
    this.storeData['refresh'].tabDlContract = true;
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

  public populateForm(formArray: any, cellIndex: number, rowIndex: number, completeRowData: any, indexFactorForAllBusiness: number): void {
    let contactManagementWarningInd;
    if (indexFactorForAllBusiness === 2) {
      this.storeData['code'].business = completeRowData[1].text;
    }
    this.storeData['otherParams'].otherVariables.ContractNumber = '';
    this.storeData['otherParams'].otherVariables.ContractName = '';
    this.storeData['otherParams'].otherVariables.PremiseNumber = '';
    this.storeData['otherParams'].otherVariables.PremiseName = '';
    if (this.storeData['formGroup'].tabPremises.controls['PremiseName']) {
      this.storeData['formGroup'].tabPremises.controls['PremiseName'].setValue('');
    }
    this.storeData['otherParams'].otherVariables.ProductCode = '';
    this.storeData['otherParams'].otherVariables.ProductDesc = '';
    this.storeData['otherParams'].otherVariables.ServiceCoverNumber = '';
    this.storeData['otherParams'].otherVariables.ServiceCoverROWID = '';
    this.storeData['otherParams'].otherVariables.AccountNumber = completeRowData[0].text;
    this.storeData['formGroup'].tabAccounts.controls['AccountName'].setValue(formArray[1]);
    this.storeData['formGroup'].main.controls['AccountProspectNumber'].setValue(completeRowData[0].text || formArray[0]);
    this.storeData['formGroup'].main.controls['AccountProspectName'].setValue(formArray[1]);
    this.storeData['formGroup'].tabAccounts.controls['AccountAddressLine1'].setValue(formArray[2]);
    this.storeData['formGroup'].tabAccounts.controls['AccountAddressLine2'].setValue(formArray[3]);
    this.storeData['formGroup'].tabAccounts.controls['AccountAddressLine3'].setValue(formArray[4]);
    this.storeData['formGroup'].tabAccounts.controls['AccountAddressLine4'].setValue(formArray[5]);
    this.storeData['formGroup'].tabAccounts.controls['AccountAddressLine5'].setValue(formArray[6]);
    this.storeData['formGroup'].tabAccounts.controls['AccountPostcode'].setValue(formArray[7]);
    this.storeData['otherParams'].otherVariables.SelectedPostcode = formArray[7];
    this.storeData['otherParams'].otherVariables.SelectedAddressLine4 = formArray[5];
    this.storeData['otherParams'].otherVariables.SelectedAddressLine5 = formArray[6];
    this.storeData['formGroup'].tabAccounts.controls['AccountContactName'].setValue(formArray[8]);
    this.storeData['formGroup'].main.controls['AccountProspectContactName'].setValue(formArray[8]);
    this.storeData['formGroup'].tabAccounts.controls['AccountContactPosition'].setValue(formArray[9]);
    this.storeData['formGroup'].tabAccounts.controls['AccountContactTelephone'].setValue(formArray[10]);
    this.storeData['formGroup'].tabAccounts.controls['AccountContactMobile'].setValue(formArray[11]);
    this.storeData['formGroup'].tabAccounts.controls['AccountContactFax'].setValue(formArray[12]);
    this.storeData['formGroup'].tabAccounts.controls['AccountContactEmail'].setValue(formArray[13]);

    this.storeData['formGroup'].tabInvoices.controls['InvoiceEmailAddress'].setValue(formArray[13]);
    this.storeData['formGroup'].tabAccounts.controls['AccountContactEmail'].setValue(formArray[13]);

    this.storeData['otherParams'].otherVariables.LiveAccount = formArray[14];
    this.storeData['otherParams'].otherVariables.CustomerContactNumber = formArray[15];
    this.storeData['otherParams'].otherVariables.CustomerContactNumber = formArray[16];
    contactManagementWarningInd = formArray[17];
    if (contactManagementWarningInd === 'Y') {
      this.storeData['fieldVisibility'].main.TdContactManagementWarning = true;
      this.storeData['fieldVisibility'].main.TdBlankWarning = false;
    } else {
      this.storeData['fieldVisibility'].main.TdContactManagementWarning = false;
      this.storeData['fieldVisibility'].main.TdBlankWarning = true;
    }
    if (cellIndex !== null && cellIndex !== undefined) {
      if (cellIndex === (0 + indexFactorForAllBusiness)) {
        this.storeData['otherParams'].otherVariables.ProspectNumber = '';
        this.storeData['otherParams'].otherVariables.AccountNumberType = 'A';
        //document.querySelector('label[for="AccountProspectNumber"]')['innerText'] = 'Account';
        if (completeRowData[0].text.toString().trim() === '') {
          this.fetchTranslationContent('Prospect');
          if (completeRowData[1].text.toString().trim() !== '') {
            cellIndex += 1;
          }
        } else {
          this.fetchTranslationContent('Account');
        }
        this.triggerFromAccount = true;
        this.storeData['fieldVisibility'].tabAccounts.NoneAccountComments = false;
        this.storeData['fieldVisibility'].tabAccounts.AccountAddressLine1 = true;
        this.storeData['fieldVisibility'].tabAccounts.AccountAddressLine2 = true;
        this.storeData['fieldVisibility'].tabAccounts.AccountAddressLine5 = true;
        this.storeData['formGroup'].main.controls['CmdUpdateAccount'].enable();
        this.storeData['formGroup'].main.controls['CmdNewCContact'].enable();
        this.storeData['formGroup'].main.controls['CmdUpdateProspect'].disable();
        this.storeData['formGroup'].main.controls['CmdViewEmployee'].disable();
        /*let tabTextElements = document.querySelectorAll('#tabCont .nav-tabs li a span');
        for (let i = 0; i < tabTextElements.length; i++) {
          tabTextElements[i].parentElement.parentElement['style'].display = 'block';
        }*/
        let tabTextList = [];
        tabTextList.push(this.storeData['tabsTranslation'].tabAccounts);
        if (this.storeData['otherParams'].otherVariables.AccountNumberType === 'A') {
          tabTextList.push(this.storeData['tabsTranslation'].tabDashboard);
          tabTextList.push(this.storeData['tabsTranslation'].tabContracts);
          tabTextList.push(this.storeData['tabsTranslation'].tabInvoices);
          tabTextList.push(this.storeData['tabsTranslation'].tabPremises);
        }
        tabTextList.push(this.storeData['tabsTranslation'].tabLogs);
        if (this.storeData['otherParams'].otherVariables.AccountNumberType === 'A') {
          tabTextList.push(this.storeData['tabsTranslation'].tabEventHistory);
        }
        if (this.storeData['otherParams'].otherVariables.AccountNumberType !== 'NA') {
          tabTextList.push(this.storeData['tabsTranslation'].tabWorkOrders);
        }
        if (this.storeData['otherParams'].otherVariables.AccountNumberType === 'A') {
          tabTextList.push(this.storeData['tabsTranslation'].tabHistory);
        }
        if (this.storeData['otherParams'].otherVariables.AccountNumberType === 'P' && this.storeData['otherParams'].registry.gcShowAdvantageQuotes === 'Y') {
          tabTextList.push(this.storeData['tabsTranslation'].advantage);
        }
        let tabTextElements = document.querySelectorAll('#tabCont .nav-tabs li a span');
        for (let i = 0; i < tabTextElements.length; i++) {
          tabTextElements[i].parentElement.parentElement['style'].display = 'none';
          for (let j = 0; j < tabTextList.length; j++) {
            if (tabTextElements[i]['innerText'] === tabTextList[j]) {
              tabTextElements[i].parentElement.parentElement['style'].display = 'block';
            }
          }
        }
      }

      if ((cellIndex === (1 + indexFactorForAllBusiness) && completeRowData[1 + indexFactorForAllBusiness].text !== '') || formArray[0 + indexFactorForAllBusiness] === '') {
        let arrayItem = (rowIndex * this.maxColumns) + cellIndex;
        this.storeData['otherParams'].otherVariables.ProspectNumber = completeRowData[1 + indexFactorForAllBusiness].text;
        this.storeData['otherParams'].otherVariables.AccountNumberType = 'P';
        this.storeData['otherParams'].otherVariables.AccountNumber = completeRowData[0 + indexFactorForAllBusiness].text;
        this.storeData['formGroup'].main.controls['AccountProspectNumber'].setValue(this.storeData['otherParams'].otherVariables.ProspectNumber);
        //document.querySelector('label[for="AccountProspectNumber"]')['innerText'] = 'Prospect';
        this.fetchTranslationContent('Prospect');
        this.triggerFromAccount = true;
        this.storeData['formGroup'].main.controls['CmdUpdateAccount'].disable();
        this.storeData['formGroup'].main.controls['CmdNewCContact'].enable();
        this.storeData['formGroup'].main.controls['CmdUpdateProspect'].enable();
        this.storeData['formGroup'].main.controls['CmdViewEmployee'].disable();

        let tabTextList = [];
        tabTextList.push(this.storeData['tabsTranslation'].tabAccounts);
        if (this.storeData['otherParams'].otherVariables.AccountNumberType === 'A') {
          tabTextList.push(this.storeData['tabsTranslation'].tabDashboard);
          tabTextList.push(this.storeData['tabsTranslation'].tabContracts);
          tabTextList.push(this.storeData['tabsTranslation'].tabInvoices);
          tabTextList.push(this.storeData['tabsTranslation'].tabPremises);
        }
        tabTextList.push(this.storeData['tabsTranslation'].tabLogs);
        if (this.storeData['otherParams'].otherVariables.AccountNumberType === 'A') {
          tabTextList.push(this.storeData['tabsTranslation'].tabEventHistory);
        }
        if (this.storeData['otherParams'].otherVariables.AccountNumberType !== 'NA') {
          tabTextList.push(this.storeData['tabsTranslation'].tabWorkOrders);
        }
        if (this.storeData['otherParams'].otherVariables.AccountNumberType === 'A') {
          tabTextList.push(this.storeData['tabsTranslation'].tabHistory);
        }
        if (this.storeData['otherParams'].otherVariables.AccountNumberType === 'P' && this.storeData['otherParams'].registry.gcShowAdvantageQuotes === 'Y') {
          tabTextList.push(this.storeData['tabsTranslation'].advantage);
        }
        let tabTextElements = document.querySelectorAll('#tabCont .nav-tabs li a span');
        for (let i = 0; i < tabTextElements.length; i++) {
          tabTextElements[i].parentElement.parentElement['style'].display = 'none';
          for (let j = 0; j < tabTextList.length; j++) {
            if (tabTextElements[i]['innerText'] === tabTextList[j]) {
              tabTextElements[i].parentElement.parentElement['style'].display = 'block';
            }
          }
        }

      }
    }

    if (formArray[18] !== '') {
      this.storeData['otherParams'].otherVariables.ContractNumber = formArray[18];
      this.storeData['otherParams'].otherVariables.ContractType = formArray[19];
      this.storeData['otherParams'].otherVariables.ContractName = formArray[20];
      this.storeData['otherParams'].otherVariables.PremiseNumber = formArray[21];
      this.storeData['otherParams'].otherVariables.PremiseName = formArray[22];
      this.storeData['otherParams'].otherVariables.ProductCode = formArray[23];
      this.storeData['otherParams'].otherVariables.ProductDesc = formArray[24];
      this.storeData['otherParams'].otherVariables.ServiceCoverNumber = formArray[25];
      this.storeData['otherParams'].otherVariables.ServiceCoverROWID = formArray[26];
    }

    this.fieldVisibility.AccountForm = true;
    if (this.storeData['otherParams'].triggerClear) {
      this.store.dispatch({
        type: CallCenterActionTypes.RESET_ALL_SEARCH_DETAILS, payload: {}
      });
    } else {
      if (this.storeData.storeSavedData && this.storeData.storeSavedData['otherParams']) {
        this.storeData['otherParams'] = JSON.parse(JSON.stringify(this.storeData.storeSavedData['otherParams']));
      }
    }
    this.storeData['otherParams'].triggerClear = true;
    if (this.storeData['otherParams'].registry.gcEmployeeLimitChildDrillOptions !== 'Y' && this.storeData['otherParams'].registry.gcAccountPassSearchTypeValue === 'Y') {
      this.storeData['formGroup'].tabInvoices.controls['InvoiceSearchOn'].setValue('all');
      if (this.storeData['otherParams'].registry.gcDefaultCallSearchType !== null && this.storeData['otherParams'].registry.gcDefaultCallSearchType !== undefined)
        this.storeData['formGroup'].tabLogs.controls['CallLogSearchOn'].setValue(document.querySelectorAll('#CallLogSearchOn option')[this.storeData['otherParams'].registry.gcDefaultCallSearchType]['value']);
      this.storeData['formGroup'].tabLogs.controls['CallLogSearchValue'].setValue('');

      if (this.storeData['formGroup'].tabAccounts.controls['AccountSearchOn'].value === 'ClientRef' || this.storeData['formGroup'].tabAccounts.controls['AccountSearchOn'].value === 'CompanyVATNumber') {
        this.storeData['formGroup'].tabContracts.controls['ContractSearchOn'].setValue(this.storeData['formGroup'].tabAccounts.controls['AccountSearchOn'].value);
        this.storeData['formGroup'].tabContracts.controls['ContractSearchValue'].setValue(this.storeData['formGroup'].tabAccounts.controls['AccountSearchValue'].value);
        this.storeData['formGroup'].tabPremises.controls['PremiseSearchOn'].setValue(this.storeData['formGroup'].tabAccounts.controls['AccountSearchOn'].value);
        this.storeData['formGroup'].tabPremises.controls['PremiseSearchValue'].setValue(this.storeData['formGroup'].tabAccounts.controls['AccountSearchValue'].value);
        let change = new CustomEvent('change', { bubbles: true });
        this.renderer.invokeElementMethod(document.querySelector('#ContractSearchOn'), 'dispatchEvent', [change]);
        this.renderer.invokeElementMethod(document.querySelector('#PremiseSearchOn'), 'dispatchEvent', [change]);
      }
      if (this.storeData['formGroup'].tabAccounts.controls['AccountSearchOn'].value === 'ContractNo' || this.storeData['formGroup'].tabAccounts.controls['AccountSearchOn'].value === 'ContractRef' || this.storeData['formGroup'].tabAccounts.controls['AccountSearchOn'].value === 'InvoiceNumber') {
        this.storeData['formGroup'].tabContracts.controls['ContractSearchOn'].setValue(this.storeData['formGroup'].tabAccounts.controls['AccountSearchOn'].value);
        this.storeData['formGroup'].tabContracts.controls['ContractSearchValue'].setValue(this.storeData['formGroup'].tabAccounts.controls['AccountSearchValue'].value);
        this.storeData['formGroup'].tabPremises.controls['PremiseSearchOn'].setValue(this.storeData['formGroup'].tabAccounts.controls['AccountSearchOn'].value);
        this.storeData['formGroup'].tabPremises.controls['PremiseSearchValue'].setValue(this.storeData['formGroup'].tabAccounts.controls['AccountSearchValue'].value);
        if (this.storeData['formGroup'].tabAccounts.controls['AccountSearchOn'].value === 'InvoiceNumber') {
          this.storeData['formGroup'].tabInvoices.controls['InvoiceSearchOn'].setValue(this.storeData['formGroup'].tabAccounts.controls['AccountSearchOn'].value);
          this.storeData['formGroup'].tabInvoices.controls['InvoiceSearchValue'].setValue(this.storeData['formGroup'].tabAccounts.controls['AccountSearchValue'].value);
          let change = new CustomEvent('change', { bubbles: true });
          this.renderer.invokeElementMethod(document.querySelector('#InvoiceSearchOn'), 'dispatchEvent', [change]);
        }
      }
      if (this.storeData['formGroup'].tabAccounts.controls['AccountSearchOn'].value === 'CallRef') {
        if (!(this.storeData['otherParams'].otherVariables.AccountNumber.toString().indexOf('-') !== -1 || (this.storeData['otherParams'].otherVariables.ProspectNumber !== '' && this.storeData['otherParams'].otherVariables.ProspectNumber !== null))) {
          this.storeData['formGroup'].tabLogs.controls['CallLogSearchOn'].setValue(this.storeData['formGroup'].tabAccounts.controls['AccountSearchOn'].value);
          this.storeData['formGroup'].tabLogs.controls['CallLogSearchValue'].setValue(this.storeData['formGroup'].tabAccounts.controls['AccountSearchValue'].value);
          let change = new CustomEvent('change', { bubbles: true });
          this.renderer.invokeElementMethod(document.querySelector('#CallLogSearchOn'), 'dispatchEvent', [change]);
        }
      }

      if (this.storeData['formGroup'].tabAccounts.controls['AccountSearchOn'].value === 'PurchaseOrderNo') {
        this.storeData['formGroup'].tabContracts.controls['ContractSearchOn'].setValue(this.storeData['formGroup'].tabAccounts.controls['AccountSearchOn'].value);
        this.storeData['formGroup'].tabContracts.controls['ContractSearchValue'].setValue(this.storeData['formGroup'].tabAccounts.controls['AccountSearchValue'].value);
        let change = new CustomEvent('change', { bubbles: true });
        this.renderer.invokeElementMethod(document.querySelector('#ContractSearchOn'), 'dispatchEvent', [change]);
      }

      if (completeRowData[10].additionalData === 'CON') {
        if (this.storeData['formGroup'].tabAccounts.controls['AccountSearchOn'].value === 'Name') {
          this.storeData['formGroup'].tabContracts.controls['ContractSearchOn'].setValue(this.storeData['formGroup'].tabAccounts.controls['AccountSearchOn'].value);
          this.storeData['formGroup'].tabContracts.controls['ContractSearchValue'].setValue(this.storeData['formGroup'].tabAccounts.controls['AccountSearchValue'].value);
          let change = new CustomEvent('change', { bubbles: true });
          this.renderer.invokeElementMethod(document.querySelector('#ContractSearchOn'), 'dispatchEvent', [change]);
        }
      }

      if (completeRowData[10].additionalData === 'PRE') {
        if (this.storeData['formGroup'].tabAccounts.controls['AccountSearchOn'].value === 'Address' || this.storeData['formGroup'].tabAccounts.controls['AccountSearchOn'].value === 'Name' || this.storeData['formGroup'].tabAccounts.controls['AccountSearchOn'].value === 'PostCode' || this.storeData['formGroup'].tabAccounts.controls['AccountSearchOn'].value === 'PurchaseOrderNo' || this.storeData['formGroup'].tabAccounts.controls['AccountSearchOn'].value === 'Telephone') {
          this.storeData['formGroup'].tabPremises.controls['PremiseSearchOn'].setValue(this.storeData['formGroup'].tabAccounts.controls['AccountSearchOn'].value);
          this.storeData['formGroup'].tabPremises.controls['PremiseSearchValue'].setValue(this.storeData['formGroup'].tabAccounts.controls['AccountSearchValue'].value);
          let change = new CustomEvent('change', { bubbles: true });
          this.renderer.invokeElementMethod(document.querySelector('#PremiseSearchOn'), 'dispatchEvent', [change]);
        }
      }
    }

    this.storeData['otherParams'].otherVariables.PassContactROWID = completeRowData[1 + indexFactorForAllBusiness].text;
    this.storeData['otherParams'].otherVariables.PassProspectNumber = completeRowData[1 + indexFactorForAllBusiness].rowID;

    if (this.storeData['otherParams'].otherVariables.AccountNumber !== null) {
      if (this.storeData['otherParams'].otherVariables.AccountNumber.toString().indexOf('-') !== -1) {
        this.storeData['otherParams'].otherVariables.AccountNumberType = 'NA';
        this.triggerFromAccount = true;
        this.storeData['formGroup'].main.controls['CmdUpdateAccount'].disable();
        this.storeData['formGroup'].main.controls['CmdUpdateProspect'].enable();
        this.storeData['formGroup'].main.controls['CmdNewCContact'].enable();
        this.storeData['formGroup'].main.controls['CmdViewEmployee'].disable();
      } else {
        this.storeData['fieldVisibility'].tabAccounts.AccountAddressLine1 = true;
        this.storeData['fieldVisibility'].tabAccounts.AccountAddressLine2 = true;
        this.storeData['fieldVisibility'].tabAccounts.AccountAddressLine4 = true;
        this.storeData['fieldVisibility'].tabAccounts.AccountAddressLine5 = true;
      }
    }
    this.triggerFromAccount = true;
    /*this.store.dispatch({
      type: CallCenterActionTypes.BUILD_SPECIFIC_GRID, payload: ['Contracts']
    });*/
    this.storeData['gridToBuild'] = [];
    this.storeData['action'] = '';

  }

  public refresh(): void {
    let error = false;
    if (this.storeData['otherParams'].otherVariables.CCMChangesMade) {
      if (this.storeData['otherParams'].registry.gcWarnNewSearchAndCurrentLogID === 'Y') {
        if (this.storeData['otherParams'].otherVariables.CreateCallLogInCCMInd === 'Y' && this.storeData['formGroup'].main.controls['VisibleCurrentCallLogID'].value !== null && this.storeData['formGroup'].main.controls['VisibleCurrentCallLogID'].value !== '' && this.storeData['otherParams'].otherVariables.CurrentCallLogID !== '') {
          this.store.dispatch({
            type: CallCenterActionTypes.DISPLAY_PROMPT_ERROR, payload: {
              errorMessage: 'You have a current Log Reference. Do you want to close this before proceeding?'
            }
          });
          error = true;
        }
      }
    }
    if (!error) {
      this.store.dispatch({
        type: CallCenterActionTypes.RESET_ALL_SEARCH_DETAILS, payload: {}
      });
      this.loadGridView();
    }
  }

  private setGridHeaders(): void {
    if (this.storeData && this.storeData['code']) {
      if (this.storeData['code'].multiBusiness === 'All') {
        this.sortIndex = [
          {
            'fieldName': 'SeaAccountNumber',
            'index': 2,
            'sortType': 'ASC'
          },
          {
            'fieldName': 'SeaProspectNumber',
            'index': 3,
            'sortType': 'ASC'
          },
          {
            'fieldName': 'SeaName',
            'index': 4,
            'sortType': 'ASC'
          },
          {
            'fieldName': 'SeaAddressLine1',
            'index': 5,
            'sortType': 'ASC'
          },
          {
            'fieldName': 'SeaAddressLine2',
            'index': 6,
            'sortType': 'ASC'
          },
          {
            'fieldName': 'SeaPostCode',
            'index': 7,
            'sortType': 'ASC'
          },
          {
            'fieldName': 'SeaKeyAccount',
            'index': 9,
            'sortType': 'ASC'
          },
          {
            'fieldName': 'SeaLiveAccount',
            'index': 10,
            'sortType': 'ASC'
          }
        ];
        this.headerProperties = [
          {
            'align': 'center',
            'width': '120px',
            'index': 2
          },
          {
            'fieldName': 'center',
            'width': '120px',
            'index': 3
          }
        ];
      } else {
        this.sortIndex = [
          {
            'fieldName': 'SeaAccountNumber',
            'index': 0,
            'sortType': 'ASC'
          },
          {
            'fieldName': 'SeaProspectNumber',
            'index': 1,
            'sortType': 'ASC'
          },
          {
            'fieldName': 'SeaName',
            'index': 2,
            'sortType': 'ASC'
          },
          {
            'fieldName': 'SeaAddressLine1',
            'index': 3,
            'sortType': 'ASC'
          },
          {
            'fieldName': 'SeaAddressLine2',
            'index': 4,
            'sortType': 'ASC'
          },
          {
            'fieldName': 'SeaPostCode',
            'index': 5,
            'sortType': 'ASC'
          },
          {
            'fieldName': 'SeaKeyAccount',
            'index': 7,
            'sortType': 'ASC'
          },
          {
            'fieldName': 'SeaLiveAccount',
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
            'fieldName': 'center',
            'width': '120px',
            'index': 1
          }
        ];
      }
    }
    for (let k = 0; k < this.sortIndex.length; k++) {
      if (this.sortIndex[k].fieldName === this.headerClicked) {
        this.sortIndex[k].sortType = this.sortType === 'Descending' ? 'DESC' : 'ASC';
      }
    }
  }

  public sortGrid(data: any): void {
    this.headerClicked = data.fieldname;
    this.sortType = data.sort === 'DESC' ? 'Descending' : 'Ascending';
    this.sortIndex = data.sortIndex;
    this.loadGridView();
  }

  public loadGridView(): void {
      this.setGridHeaders();
      let urlParams = this.riExchange.getRouterUrlParams();
      this.inputParams.module = this.queryGrid.module;
      this.inputParams.method = this.queryGrid.method;
      this.inputParams.operation = this.queryGrid.operation;
      this.search.set(this.serviceConstants.Action, '2');
      let additionalColumns: number = 0;
      if (this.storeData['code'].multiBusiness === 'All') {
        this.displayCountryBusiness = true;
        this.maxColumns = 14;
        this.itemsPerPage = (10 * this.storeData['code'].numberOfBusiness);
        additionalColumns += 2;
      } else {
        this.displayCountryBusiness = false;
        this.maxColumns = 12;
        this.itemsPerPage = 10;
        additionalColumns = 0;
      }
      this.validateProperties = [
        {
            'type': MntConst.eTypeTextFree,
            'index': (0 + additionalColumns),
            'align': 'center'
        },
        {
            'type': MntConst.eTypeTextFree,
            'index': (1 + additionalColumns),
            'align': 'center'
        },
        {
            'type': MntConst.eTypeTextFree,
            'index': (2 + additionalColumns),
            'align': 'center'
        },
        {
            'type': MntConst.eTypeTextFree,
            'index': (3 + additionalColumns),
            'align': 'center'
        },
        {
            'type': MntConst.eTypeTextFree,
            'index': (4 + additionalColumns),
            'align': 'center'
        },
        {
            'type': MntConst.eTypeTextFree,
            'index': (5 + additionalColumns),
            'align': 'center'
        },
        {
            'type': MntConst.eTypeImage,
            'index': (6 + additionalColumns),
            'align': 'center'
        },
        {
            'type': MntConst.eTypeImage,
            'index': (7 + additionalColumns),
            'align': 'center'
        },
        {
            'type': MntConst.eTypeImage,
            'index': (8 + additionalColumns),
            'align': 'center'
        },
        {
            'type': MntConst.eTypeImage,
            'index': (9 + additionalColumns),
            'align': 'center'
        },
        {
            'type': MntConst.eTypeTextFree,
            'index': (10 + additionalColumns),
            'align': 'center'
        },
        {
            'type': MntConst.eTypeImage,
            'index': (11 + additionalColumns),
            'align': 'center'
        }
    ];
      this.search.set(this.serviceConstants.BusinessCode, this.storeData['code'].multiBusiness ? this.storeData['code'].multiBusiness : this.utils.getBusinessCode());
      this.search.set(this.serviceConstants.CountryCode, this.storeData['code'].country ? this.storeData['code'].country : this.utils.getCountryCode());
      this.search.set('GridName', 'Account');
      this.search.set('SearchOn', this.formGroup.controls['AccountSearchOn'].value);
      this.search.set('SearchValue', this.formGroup.controls['AccountSearchValue'].value);
      this.search.set('SearchOn2', this.formGroup.controls['AccountSearchOn2'].value);
      this.search.set('SearchValue2', this.formGroup.controls['AccountSearchValue2'].value);
      this.search.set('AccountStatus', this.formGroup.controls['AccountStatus'].value);
      this.search.set('AccountNational', this.formGroup.controls['AccountNational'].value);
      this.search.set('AccountDataSet', this.formGroup.controls['AccountDataSet'].value);
      this.search.set('ContractTypeCode', this.formGroup.controls['AccountContractType'].value);
      this.search.set('riSortOrder', this.sortType);
      this.search.set('riGridMode', '0');
      this.search.set('riGridHandle', (Math.floor(Math.random() * 900000) + 100000).toString());
      this.search.set('HeaderClickedColumn', this.headerClicked);
      this.search.set('PageSize', this.pageSize.toString());
      this.search.set('PageCurrent', this.currentPage.toString());
      this.inputParams.search = this.search;
      this.accountsGrid.loadGridData(this.inputParams);
      this.storeData['pagination'].tabAccounts = this.currentPage;
  }

  public cmdClearSearchOnClick(event: any): void {
    this.paginationCurrentPage = 1;
    this.resetCallDetails();
    this.loadGridView();
    let focus = new CustomEvent('focus', { bubbles: false });
    setTimeout(() => {
      this.renderer.invokeElementMethod(document.getElementById('AccountSearchValue'), 'focus', [focus]);
    }, 0);
  }

  public cmdContactAccountOnClick(event: any): void {
    this.store.dispatch({
      type: CallCenterActionTypes.PORTFOLIO_CONTACT_DETAILS, payload: ['AC']
    });
  }

  public accountSearchOnChange(event: any): void {
    this.formGroup.controls['AccountSearchValue'].setValue('');
    this.formGroup.controls['AccountSearchOn2'].setValue('none');
    this.formGroup.controls['AccountSearchValue2'].setValue('');
    let tabText = document.querySelector('#tabCont .nav-tabs li.active a span')['innerText'];
    if (tabText === this.storeData['tabsTranslation'].tabAccounts) {
      let focus = new CustomEvent('focus', { bubbles: false });
      setTimeout(() => {
        this.renderer.invokeElementMethod(document.querySelector('#AccountSearchValue'), 'focus', [focus]);
      }, 0);
    }
  }

  public accountSearchValueOnChange(event: any): void {
    let cSaveValue, cTempContract, cTempPremise, iDelim;
    if (this.formGroup.controls['AccountSearchValue'].value !== '') {
      if (this.formGroup.controls['AccountSearchOn'].value === 'AccountNo') {
        this.storeData['otherParams'].otherVariables.AccountNumber = this.utils.numberPadding(this.formGroup.controls['AccountSearchValue'].value, 9);
        this.formGroup.controls['AccountSearchValue'].setValue(this.storeData['otherParams'].otherVariables.AccountNumber);
      } else if (this.formGroup.controls['AccountSearchOn'].value === 'ContractNo') {
        this.formGroup.controls['AccountSearchValue'].setValue(this.utils.numberPadding(this.formGroup.controls['AccountSearchValue'].value, 8));
      }
    }
    let tempPremise, tempContract;
    if (this.formGroup.controls['AccountSearchOn'].value === 'ContractNo') {
      if (this.formGroup.controls['AccountSearchValue'].value !== '' && this.storeData['otherParams'].registry.gcContractPremiseSearchDelim !== null && this.storeData['otherParams'].registry.gcContractPremiseSearchDelim !== '') {
        let index = this.formGroup.controls['AccountSearchValue'].value.indexOf(this.storeData['otherParams'].registry.gcContractPremiseSearchDelim);
        if (index > 0) {
          tempContract = this.formGroup.controls['AccountSearchValue'].value.substring(0, index);
          tempContract = this.utils.numberPadding(tempContract, 8);
          tempPremise = this.formGroup.controls['AccountSearchValue'].value.substring((index + 1), this.formGroup.controls['AccountSearchValue'].value.length);
        } else {
          tempContract = this.utils.numberPadding(this.formGroup.controls['AccountSearchValue'].value, 8);
        }
      }
    }
    if (tempContract) {
      this.formGroup.controls['AccountSearchValue'].setValue(tempContract);
      if (tempPremise) {
        this.formGroup.controls['AccountSearchValue'].setValue(this.formGroup.controls['AccountSearchValue'].value + this.storeData['otherParams'].registry.gcContractPremiseSearchDelim + tempPremise);
      }
    }
  }

  public accountSearchOnKeyDown(event: any): void {
    if (event.keyCode === 13) {
      this.loadGridView();
    }
  }

  public accountSearchOn2KeyDown(event: any): void {
    if (event.keyCode === 13) {
      this.loadGridView();
    }
  }

  public accountSearchOn2Change(event: any): void {
    if (this.formGroup.controls['AccountSearchOn2'].value === 'none') {
      this.formGroup.controls['AccountSearchValue2'].setValue('');
      this.formGroup.controls['AccountSearchValue2'].disable();
    } else {
      this.formGroup.controls['AccountSearchValue2'].enable();
      let focus = new CustomEvent('focus', { bubbles: false });
      setTimeout(() => {
        this.renderer.invokeElementMethod(document.querySelector('#AccountSearchValue2'), 'focus', [focus]);
      }, 0);
    }
  }

  public accountSearchValueKeyDown(event: any): void {
    if (this.formGroup.controls['AccountSearchOn'].value === 'AccountNo') {
      this.maxLength.AccountSearchValue = this.storeData['otherParams'].otherVariables.ConstAccountNoMaxLength;
    } else if (this.formGroup.controls['AccountSearchOn'].value === 'ContractNo') {
      this.maxLength.AccountSearchValue = this.storeData['otherParams'].otherVariables.ConstContractNoMaxLength + 5;
    } else {
      this.maxLength.AccountSearchValue = this.storeData['otherParams'].otherVariables.ConstAccountSearchValueMaxLength;
    }

    if (event.keyCode === 13) {
      this.accountSearchValueOnChange({});
      this.loadGridView();
    }
  }

  public accountSearchValue2KeyDown(event: any): void {
    if (event.keyCode === 13) {
      this.loadGridView();
    }
  }

  public accountStatusOnKeyDown(event: any): void {
    if (event.keyCode === 13) {
      this.loadGridView();
    }
  }

  public accountStatusOnChange(event: any): void {
    if (this.storeData['otherParams'].registry.gcAccountPassLiveAccount === 'Y') {
      if (this.storeData['formGroup'].tabAccounts.controls['AccountStatus'].value === 'liveonly') {
        this.storeData['formGroup'].tabContracts.controls['ContractStatusCode'].setValue('CurrentAll');
        this.storeData['formGroup'].tabPremises.controls['PremiseStatusCode'].setValue('CurrentAll');
      } else {
        this.storeData['formGroup'].tabContracts.controls['ContractStatusCode'].setValue('all');
        this.storeData['formGroup'].tabPremises.controls['PremiseStatusCode'].setValue('all');
      }
      this.storeData['otherParams'].webSpeedVariables.lRefreshContractGrid = true;
      this.storeData['otherParams'].webSpeedVariables.lRefreshPremiseGrid = true;

    }
  }

  public accountNationalOnKeyDown(event: any): void {
    if (event.keyCode === 13) {
      this.loadGridView();
    }
  }

  public accountContractTypeOnKeyDown(event: any): void {
    if (event.keyCode === 13) {
      this.loadGridView();
    }
  }

  public accountContractTypeOnChange(event: any): void {
    if (this.storeData['otherParams'].registry.gcAccountPassContractType === 'Y') {
      this.storeData['formGroup'].tabContracts.controls['ContractTypeCode'].setValue(this.storeData['formGroup'].tabAccounts.controls['AccountContractType'].value);
      this.storeData['formGroup'].tabPremises.controls['PremiseContractTypeCode'].setValue(this.storeData['formGroup'].tabAccounts.controls['AccountContractType'].value);
      this.storeData['formGroup'].tabInvoices.controls['InvoiceContractTypeCode'].setValue(this.storeData['formGroup'].tabAccounts.controls['AccountContractType'].value);
      this.storeData['otherParams'].webSpeedVariables.lRefreshContractGrid = true;
      this.storeData['otherParams'].webSpeedVariables.lRefreshPremiseGrid = true;
      this.storeData['otherParams'].webSpeedVariables.lRefreshInvoiceGrid = true;
    }
  }

  public resetCallDetails(): void {
    this.store.dispatch({
      type: CallCenterActionTypes.RESET_CALL_DETAILS, payload: {}
    });
    setTimeout(() => {
      this.storeData['action'] = '';
    }, 0);
  }

  public fetchTranslationContent(text: string): void {
    this.getTranslatedValue(text, null).subscribe((res: string) => {
      if (res) {
        document.querySelector('label[for="AccountProspectNumber"]')['innerText'] = res;
      }
    });
  }

  public getTranslatedValue(key: any, params?: any): any {
    if (params) {
      return this.translate.get(key, { value: params });
    } else {
      return this.translate.get(key);
    }

  }
}
