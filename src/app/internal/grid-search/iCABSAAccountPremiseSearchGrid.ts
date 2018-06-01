import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Logger } from '@nsalaun/ng2-logger';
import { Subscription } from 'rxjs/Rx';
import { Store } from '@ngrx/store';
import { SpeedScript } from '../../../shared/services/speedscript';
import { LookUp } from '../../../shared/services/lookup';
import { Utils } from '../../../shared/services/utility';
import { SysCharConstants } from './../../../shared/constants/syscharservice.constant';
import { GlobalConstant } from '../../../shared/constants/global.constant';
import { HttpService } from '../../../shared/services/http-service';
import { GridComponent } from './../../../shared/components/grid/grid';
import { URLSearchParams } from '@angular/http';
import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';
import { LocaleTranslationService } from './../../../shared/services/translation.service';
import { SelectedDataEvent } from './../../../shared/events/ellipsis-event-emitter';
import { ActionTypes } from '../../actions/account';
import { ContractManagementModuleRoutes } from '../../base/PageRoutes';
import { MntConst } from './../../../shared/services/riMaintenancehelper';

@Component({
  selector: 'icabs-premise-grid',
  templateUrl: 'iCABSAAccountPremiseSearchGrid.html',
  styles: [`
    :host /deep/ .gridtable tbody tr td:nth-child(6) input,
    :host /deep/ .gridtable tbody tr td:nth-child(5) input,
    :host /deep/ .gridtable tbody tr td:nth-child(7) input,
    :host /deep/ .gridtable tbody tr td:nth-child(9) input {
        text-align: left;
    }
    :host /deep/ .gridtable thead tr:nth-child(2) th:nth-child(5),
    :host /deep/ .gridtable thead tr:nth-child(2) th:nth-child(6) {
        width:28% !important;
    }
    :host /deep/ .gridtable thead tr:nth-child(2) th:nth-child(3) {
        width:7% !important;
    }
    :host /deep/ .gridtable tbody tr td:nth-child(2) input {
        text-align: center;
    }
    :host /deep/ .gridtable thead tr:nth-child(2) th:nth-child(6) {
        width:20% !important;
    }
    :host /deep/ .gridtable thead tr:nth-child(2) th:nth-child(7) {
        width:8% !important;
    }
    :host /deep/ .gridtable thead tr:nth-child(2) th:nth-child(9) {
        width:12% !important;
    }
  `]
})

export class AccountPremiseSearchComponent extends SelectedDataEvent implements OnInit, OnDestroy {

  @ViewChild('accountPremise') accountPremise: GridComponent;
  @ViewChild('accountPremisePagination') accountPremisePagination: PaginationComponent;

  public selectedrowdata: any;
  // public method: string = 'accountPremiseSearchGrid';
  public method: string = 'contract-management/search';
  public module: string = 'account';
  public operation: string = 'Application/iCABSAAccountPremiseSearchGrid';
  public search: URLSearchParams = new URLSearchParams();
  public queryLookUp: URLSearchParams = new URLSearchParams();
  public storeSubscription: Subscription;
  public validateProperties: Array<any> = [];
  public storeData: any;
  public maxColumn: number = 9;
  public totalItems: number = 11;
  public itemsPerPage: number = 10;
  public currentPage: number = 1;
  public page: number = 1;
  public AccountNumber: string = '';
  public AccountName: string = '';
  public accountPremiseForm: FormGroup;
  public contracttypecode: string;
  public ExchangeMode: string = 'AccountPremiseSearch';
  public searchData: any;
  public errorMessage: string;
  public showHeader: boolean = true;
  public totalRecords: Number;
  private ellipsis: any;

  public inputParams: any = {
    'Function': 'GeneralSearch',
    'riGridMode': '0',
    'riGridHandle': '',
    'PageSize': '10',
    'PageCurrent': '1',
    'riSortOrder': 'Descending',
    'parentMode': 'Account',
    'businessCode': 'D',
    'countryCode': 'UK',
    'AccountNumber': this.AccountNumber,
    'AccountName': this.AccountName,
    'ExchangeMode': this.ExchangeMode,
    'Action': 2
  };
  public gridSortHeaders: Array<any>;
  public queryParamsSubscription: any;
  constructor(
    private serviceConstants: ServiceConstants,
    private _formBuilder: FormBuilder,
    private _router: Router,
    private httpService: HttpService,
    private logger: Logger,
    private global: GlobalConstant,
    private localeTranslateService: LocaleTranslationService,
    private store: Store<any>,
    private sysCharConstants: SysCharConstants,
    private activatedRoute: ActivatedRoute,
    private utils: Utils,
    private LookUp: LookUp,
    private SpeedScript: SpeedScript
  ) {
    super();
    this.getUrlParams();
    this.storeSubscription = store.select('account').subscribe(data => {
      this.storeData = data;
      this.setFormData(this.storeData);
    });
  }

  public getData(params: any): any {
    return this.httpService.makeGetRequest(params.method, params.module, params.operation, params.search);
  }
  public getUrlParams(): void {
    this.queryParamsSubscription = this.activatedRoute.queryParams.subscribe((params: Params) => {
      if (params['parentMode'] !== undefined)
        this.inputParams.parentMode = params['parentMode'];
      if (params['AccountNumber'] !== undefined) {
        this.AccountNumber = params['AccountNumber'];
        this.onAccountBlur('AccountNumber');
      }
    });
  }
  public setFormData(data: any): void {
    if (data) {
      this.inputParams.businessCode = this.utils.getBusinessCode();
      this.inputParams.countryCode = this.utils.getCountryCode();
      if (data.hasOwnProperty('sentFromParent')) {
        if (data['sentFromParent'].hasOwnProperty('AccountNumber')) {
          this.AccountNumber = data['sentFromParent'].AccountNumber;
          this.inputParams.AccountNumber = this.AccountName;
        }
        if (data['sentFromParent'].hasOwnProperty('AccountName')) {
          this.AccountName = data['sentFromParent'].AccountName;
          this.inputParams.AccountName = this.AccountName;
        }
        if (data['sentFromParent'].hasOwnProperty('parentMode')) {
          this.inputParams.parentMode = data['sentFromParent'].parentMode;
        }
      }
    }
  }

  ngOnInit(): void {
    let params = this.inputParams;
    this.utils.setTitle('Account Premises Search');
    this.inputParams['riGridHandle'] = (Math.floor(Math.random() * 900000) + 100000).toString();
    this.updateView(this.inputParams);
    this.search.set(this.serviceConstants.Action, '2');
    this.localeTranslateService.setUpTranslation();
    this.gridSortHeaders = [{
      'fieldName': 'ContractNumber',
      'index': 2,
      'sortType': 'ASC'
    },
    {
      'fieldName': 'PremiseName',
      'index': 4,
      'sortType': 'ASC'
    },
    {
      'fieldName': 'AddressLine1',
      'index': 5,
      'sortType': 'ASC'
    },
    {
      'fieldName': 'PremisePostcode',
      'index': 6,
      'sortType': 'ASC'
    }];

    this.validateProperties = [
        {
            'type': MntConst.eTypeCode,
            'index': 0,
            'align': 'center'
        },
        {
            'type': MntConst.eTypeText,
            'index': 1,
            'align': 'center'
        },
        {
            'type': MntConst.eTypeCode,
            'index': 2,
            'align': 'center'
        },
        {
            'type': MntConst.eTypeInteger,
            'index': 3,
            'align': 'center'
        },
        {
            'type': MntConst.eTypeInteger,
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
            'type': MntConst.eTypeInteger,
            'index': 7,
            'align': 'center'
        },
        {
            'type': MntConst.eTypeText,
            'index': 8,
            'align': 'center'
        }
    ];
  }

  ngOnDestroy(): void {
    if (this.queryParamsSubscription) {
      this.queryParamsSubscription.unsubscribe();
    }

    if (this.storeSubscription) {
      this.storeSubscription.unsubscribe();
    }
  }

  updateView(params: any): void {
    if (params['AccountNumber'] !== undefined && params['AccountNumber'] !== '') {
      this.AccountNumber = params['AccountNumber'];
      if (params['AccountName'] !== undefined && params['AccountName'] !== '') {
        this.AccountName = params['AccountName'];
      } else {
        this.onAccountBlur('AccountNumber');
      }

    }
    if (params['parentMode']) {
      this.inputParams.parentMode = params['parentMode'];
    }
    this.inputParams.module = this.module;
    this.inputParams.method = this.method;
    this.inputParams.operation = this.operation;
    this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
    this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
    this.search.set('Function', 'GeneralSearch');
    this.search.set('riGridMode', '0');
    this.search.set('riGridHandle', this.inputParams['riGridHandle']);
    this.search.set('riCacheRefresh', 'true');
    this.search.set('PageSize', '10');
    this.search.set('PageCurrent', '1');
    //this.search.set('AccountNumber', '000562165');
    this.search.set('AccountNumber', this.AccountNumber);
    this.search.set(this.serviceConstants.Action, '2');
    this.inputParams.search = this.search;
    this.accountPremise.loadGridData(this.inputParams);
  }

  // On Row Click of GRID ******************************************
  public selectedDataOnClick(event: any): void {
    let returnGrpObj: any;
    let parentMode = this.inputParams.parentMode;
    let groupAccountNumber = event.trRowData[0].text;
    let contractTypeCode = event.trRowData[1].text;
    let contractNumber = event.trRowData[2].text;
    let premiseNumber = event.trRowData[3].text;
    let premiseName = event.trRowData[4].text;
    let premiseAddressLine1 = event.trRowData[5].text;
    let rowID = event.cellData['rowID'];
    this.search = new URLSearchParams();
    this.search.set(this.serviceConstants.Action, '0');
    this.search.set('Function', 'GetFullPremiseAddress');
    this.search.set('PremiseNumber', premiseNumber);
    if (contractNumber !== undefined && contractNumber !== null) {
      this.search.set('ContractNumber', contractNumber);
    }
    this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
    this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
    this.search.set(this.serviceConstants.MethodType, this.serviceConstants.Method.Maintenance);
    this.search.set('action', '6');
    this.search.set('Function', 'GetFullPremiseAddress');
    this.search.set('ContractNumber', contractNumber);
    this.search.set('methodtype', 'maintenance');
    this.search.set('premiseNumber', premiseNumber);
    this.inputParams.search = this.search;
    switch (contractTypeCode) {
      case 'C':
      case 'P':
        returnGrpObj = {
          'strURLExtra': '<product>'
        };
        break;
      case 'J':
        returnGrpObj = {
          'strURLExtra': '<job>'
        };
        break;
    }
    if (event.cellIndex === 5 && premiseAddressLine1 === '') {
      returnGrpObj = {
          'GroupAccountNumber': groupAccountNumber,
          'Object': event.rowData
      };
      this.store.dispatch({ type: ActionTypes.SAVE_DATA_FROM, payload: returnGrpObj });
      return;
    }
    switch (parentMode) {
      case 'Account':
        returnGrpObj = {
          'ExchangeMode': this.inputParams.ExchangeMode
        };
        this._router.navigate([ContractManagementModuleRoutes.ICABSAPREMISEMAINTENANCE], {
          queryParams: {
            'parentMode': this.inputParams.ExchangeMode,
            'PremiseRowID': rowID,
            'ContractTypeCode': contractTypeCode
          }
        });
        break;
      case 'Prospect':
        returnGrpObj = {
          'PremiseNumber': premiseNumber,
          'PremiseName': premiseName,
          'ContractNumber': contractNumber
        };
        this.store.dispatch({ type: ActionTypes.SAVE_DATA_FROM, payload: returnGrpObj });
        break;
      case 'PipelineProspect':
        returnGrpObj = {
          'PremiseNumber': premiseNumber,
          'PremiseName': premiseName,
          'PremiseAddressLine1': premiseAddressLine1,
          'ContractNumber': contractNumber
        };
        this.getData(this.inputParams).subscribe(
          (e) => {
            if (e && !e.errorNumber) {
              this.store.dispatch({ type: ActionTypes.SAVE_DATA_FROM, payload: e });
              this.search.set('Function', 'GeneralSearch');
              this.inputParams.search = this.search;
            }
          }
        );
        break;
      default:
        returnGrpObj = {
          'GroupAccountNumber': groupAccountNumber,
          'Object': event.rowData
        };
        this.store.dispatch({ type: ActionTypes.SAVE_DATA_FROM, payload: returnGrpObj });
    }
  }

  public onGridCellClick(event: any): any {
    let returnGrpObj: any;
    let parentMode = this.inputParams.parentMode;
    let groupAccountNumber = event.trRowData[0].text;
    let contractTypeCode = event.trRowData[1].text;
    let contractNumber = event.trRowData[2].text;
    let premiseNumber = event.trRowData[3].text;
    let premiseName = event.trRowData[4].text;
    let premiseAddressLine1 = event.trRowData[5].text;
    switch (parentMode) {
      case 'Account':
        returnGrpObj = {
          'ExchangeMode': this.inputParams.ExchangeMode,
          'PremiseNumber': premiseNumber
        };
        break;
      case 'Prospect':
        returnGrpObj = {
          'PremiseNumber': premiseNumber,
          'PremiseName': premiseName,
          'ContractNumber': contractNumber
        };
        break;
      case 'PipelineProspect':
        returnGrpObj = {
          'PremiseNumber': premiseNumber,
          'PremiseName': premiseName,
          'PremiseAddressLine1': premiseAddressLine1,
          'ContractNumber': contractNumber
        };
        break;
      default:
        returnGrpObj = {
          'GroupAccountNumber': groupAccountNumber,
          'Object': event.rowData,
          'PremiseNumber': premiseNumber
        };
    }
    this.emitSelectedData(returnGrpObj);
    //this.ellipsis.sendDataToParent(returnGrpObj);
  }

  getGridInfo(info: any): void {
    this.totalRecords = info.totalRows;
  }

  getCurrentPage(currentPage: any): void {
    this.currentPage = currentPage.value;
    this.search.set('PageCurrent', this.currentPage.toString());
    this.inputParams.module = this.module;
    this.inputParams.method = this.method;
    this.inputParams.operation = this.operation;
    this.inputParams.search = this.search;
    this.accountPremise.loadGridData(this.inputParams);
  }

  public onAccountBlur(event: any): void {
    if (this.AccountNumber && this.AccountNumber.length > 0 && this.AccountNumber.length < 9) {
      this.AccountNumber = this.utils.numberPadding(this.AccountNumber, 9);
    }
    if (this.AccountNumber !== '') {
      let data = [{
        'table': 'Account',
        'query': { 'AccountNumber': this.AccountNumber },
        'fields': ['AccountNumber', 'AccountName']
      }];
      this.lookUpRecord(JSON.parse(JSON.stringify(data)), 100).subscribe(
        (e) => {
          if (e['results'] && e['results'].length > 0 && e['results'][0].length > 0) {
            this.AccountName = e['results'][0][0].AccountName;
          }
        },
        (error) => {
          this.AccountNumber = '';
          error['errorMessage'] = error['errorMessage'];
        }
      );
    }
  };

  public lookUpRecord(data: any, maxresults: number): any {
    this.queryLookUp.set(this.serviceConstants.Action, '0');
    this.queryLookUp.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
    this.queryLookUp.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
    if (maxresults) {
      this.queryLookUp.set(this.serviceConstants.MaxResults, maxresults.toString());
    }
    return this.httpService.lookUpRequest(this.queryLookUp, data);
  }

  public searchload(): void {
    this.search.set('AccountNumber', this.AccountNumber);
    this.accountPremise.loadGridData(this.inputParams);
  }

  public sortGrid(data: any): void {
    for (let i in this.gridSortHeaders) {
      if (i) {
        if (this.gridSortHeaders[i]['fieldName'] === data.fieldname) {
          this.gridSortHeaders[i]['sortType'] = data.sort;
        }
      }
    }
    this.search.set(this.serviceConstants.GridHeaderClickedColumn, data.fieldname);
    if (data.sort === 'DESC') {
      this.search.set(this.serviceConstants.GridSortOrder, 'Descending');
    } else {
      this.search.set(this.serviceConstants.GridSortOrder, 'Ascending');
    }
    this.updateView({});
  }

}
