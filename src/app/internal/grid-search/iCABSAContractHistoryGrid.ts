import { InternalMaintenanceApplicationModuleRoutes, InternalGridSearchServiceModuleRoutes } from './../../base/PageRoutes';
import { Logger } from '@nsalaun/ng2-logger';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';
import { GridComponent } from './../../../shared/components/grid/grid';

import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, Input, NgZone, forwardRef, Inject, Renderer } from '@angular/core';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { ComponentInteractionService } from '../../../shared/services/component-interaction.service';
import { Http, URLSearchParams } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalStorageService } from 'ng2-webstorage';
import { AccountSearchComponent } from '../../internal/search/iCABSASAccountSearch';
import { ErrorService } from '../../../shared/services/error.service';
import { HttpService } from '../../../shared/services/http-service';
import { AuthService } from '../../../shared/services/auth.service';
import { Location } from '@angular/common';
import { LocaleTranslationService } from '../../../shared/services/translation.service';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { GlobalConstant } from '../../../shared/constants/global.constant';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { Utils } from './../../../shared/services/utility';
import { Title } from '@angular/platform-browser';
import { PremiseSearchComponent } from '../../internal/search/iCABSAPremiseSearch';
import { HistoryTypeLanguageSearchComponent } from '../../internal/search/iCABSSHistoryTypeLanguageSearch.component';
import { ServiceCoverSearchComponent } from '../../internal/search/iCABSAServiceCoverSearch';
import { TranslateService } from 'ng2-translate';
import { InternalGridSearchSalesModuleRoutes } from './../../base/PageRoutes';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { GlobalizeService } from './../../../shared/services/globalize.service';

@Component({
  templateUrl: 'iCABSAContractHistoryGrid.html'
})

export class ContractHistoryGridComponent implements OnInit, OnDestroy {

  @ViewChild('historyGrid') historyGrid: GridComponent;
  @ViewChild('historyGridPagination') historyGridPagination: PaginationComponent;
  @ViewChild('searchButton') searchButton: any;


  //@Input() inputParams: any;
  public inputParams: any = {};

  public selectedrowdata: any;
  public InvoiceGroupDisplay: boolean = false;
  public InvoiceTypeDisplay: boolean = false;
  public historyTypeSearchComponent: Component = HistoryTypeLanguageSearchComponent;
  public premiseSearchComponent: Component = PremiseSearchComponent;
  public ServiceCoverSearchComponent: Component = ServiceCoverSearchComponent;
  public inputParamsPremise: any = {
    'parentMode': 'Search',
    'showAddNew': false
  };
  public inputParamsProduct: any = {
    'parentMode': 'LookUp-ContractHistory',
    'showAddNew': false
  };
  public inputParamsHistoryCode: any = {
    'parentMode': 'Contract',
    'showAddNew': false
  };
  public showCloseButton: boolean = true;
  public modalConfig: any = {
    backdrop: 'static',
    keyboard: true
  };
  public validateProperties: Array<any> = [];

  // For contract history grid
  public isRequesting: boolean = false;
  public method: string = 'contract-management/grid';
  public module: string = 'contract';
  public operation: string = 'Application/iCABSAContractHistoryGrid';
  public search: URLSearchParams;
  public countryCode: string = '';
  public pagination: boolean = true;
  public pageSize: string = '10';
  public pageCurrent: string = '1';
  public queryLookUp: URLSearchParams = new URLSearchParams();

  public dynamicComponent1 = AccountSearchComponent;

  public itemsPerPage: number = 10;
  public page: number = 1;
  public maxColumn: number = 13;
  public totalItems: number = 1;
  public currentPage: number = 1;
  public showHeader: boolean = true;


  // For contract history grid
  public form_group: FormGroup;
  public sortList: Array<any>;
  public options: Array<any>;
  public viewList: Array<any>;

  public pageTitleMain: string = 'Contract History';
  public pageTitleSub: string;

  public ContractNumber: string;
  public ContractName: string;
  public AccountNumber: string;
  public AccountName: string;
  public PremisesNumber: string;
  public PremisesName: string;
  public ProductCode: string;
  public ProductDesc: string;
  public HistoryType: Array<any>;
  public HistoryTypeCode: string;
  public HistoryTypeCodeDesc: string;
  public ServiceCoverNumber: string;
  public ContractRowID: string;
  public PremiseRowID: string;
  public ServiceCoverRowID: string;
  public contractLabel: string;

  public effectiveDate: string;
  public effectiveDateTo: string;
  public sortBy: string;
  public SortBySelected: string;
  public ViewSelected: string;
  public dateFrom: string;
  public dateTo: string;
  public OptionSelected: string;
  public dt: Date = new Date();
  public columnIndex: any = {
    ProductCode: 0,
    PremiseNumber: 0
  };

  public CurrDate = new Date();
  public CurrDate2 = '';
  public isPremiseEllipsisDisabled: boolean = true;
  public storeSubscription: Subscription;
  public currentContractTypeURLParameter: string;
  public contractStoreData: any;
  private currentContractType: string = '';
  public accountHide: boolean = true;
  public subscription: Subscription;
  public routerSubscription: Subscription;
  public storeData: any = {};
  public backLinkText: string = '';
  public backLinkUrl: string = '';

  public error: any;
  public AccountNumberReadonly: Boolean;
  public AccountNameReadonly: Boolean;
  public ContractNumberReadonly: Boolean;
  public ContractNameReadonly: Boolean;
  public PremisesNumberReadonly: Boolean;
  public PremisesNameReadonly: Boolean;
  public ProductCodeReadonly: Boolean;
  public ProductDescReadonly: Boolean;
  public HistoryTypeReadonly: Boolean;
  public HistoryTypeDesc: string;

  constructor(
    public _logger: Logger,
    public _fb: FormBuilder,
    public _router: Router,
    public _activatedRoute: ActivatedRoute,
    public zone: NgZone,
    public _http: Http,
    public errorService: ErrorService,
    public _httpService: HttpService,
    public _authService: AuthService,
    public _ls: LocalStorageService,
    public _componentInteractionService: ComponentInteractionService,
    public serviceConstants: ServiceConstants,
    public renderer: Renderer,
    public store: Store<any>,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public titleService: Title,
    public utils: Utils,
    public location: Location,
    public globalize: GlobalizeService,
    private translate: TranslateService,
    public translateService: LocaleTranslationService) {
    this.inputParams.ContractType = '';
    this.inputParams.ContractNumber = '';
    this.inputParams.ContractName = '';
    this.inputParams.AccountNumber = '';
    this.inputParams.AccountName = '';

    this.storeSubscription = store.select('contract').subscribe(data => {
      this.storeData = data;
      if (data !== null && data['data'] &&
        !(Object.keys(data['data']).length === 0 && data['data'].constructor === Object)) {
        this.contractStoreData = data['data'];
        if (data['params']['currentContractType'])
          this.inputParams.ContractType = data['params']['currentContractType'];
        if (this.contractStoreData['ContractNumber'])
          this.inputParams.ContractNumber = this.contractStoreData['ContractNumber'];
        if (this.contractStoreData['ContractName'])
          this.inputParams.ContractName = this.contractStoreData['ContractName'];
        if (this.contractStoreData['AccountNumber'])
          this.inputParams.AccountNumber = this.contractStoreData['AccountNumber'];
        if (data['formGroup']['main']) {
          this.inputParams.AccountName = data['formGroup']['main'].controls['AccountName'].value;
        }
        if (this.contractStoreData['countryCode'])
          this.countryCode = this.contractStoreData['countryCode'];
        //Need to check rowid
        if (this.contractStoreData['Contract'])
          this.inputParams.ContractRowID = this.contractStoreData['Contract'];
      }
    });

    this.subscription = activatedRoute.queryParams.subscribe(
      (param: any) => {
        this.inputParams.parentMode = param['parentMode'];
        if (this.inputParams.parentMode === 'Contract') {
          this.maxColumn += 2;
          this.columnIndex.PremiseNumber = 3;
          this.columnIndex.ProductCode = 4;
          this.validateProperties.push({
            'type': MntConst.eTypeInteger,
            'index': 3,
            'align': 'center'
          });
          this.validateProperties.push({
            'type': MntConst.eTypeCode,
            'index': 4,
            'align': 'center'
          });
        } else if (this.inputParams.parentMode === 'Premise') {
          this.maxColumn++;
          this.columnIndex.ProductCode = 3;
          this.validateProperties.push({
            'type': MntConst.eTypeCode,
            'index': 3,
            'align': 'center'
          });
        }
        if (param['currentContractTypeURLParameter']) {
          if (param['currentContractTypeURLParameter'].length > 1) {
            this.currentContractType = this.utils.getCurrentContractType(param['currentContractTypeURLParameter']);
          }
          else {
            this.currentContractType = param['currentContractTypeURLParameter'];
          }
        } else {
          this.currentContractType = 'C';
        }
        this.contractLabel = this.utils.getCurrentContractLabel(this.currentContractType);
        if (param['ContractNumber'])
          this.inputParams.ContractNumber = param['ContractNumber'];
        if (param['ContractName'])
          this.inputParams.ContractName = param['ContractName'];
        if (param['AccountNumber'])
          this.inputParams.AccountNumber = param['AccountNumber'];
        if (param['AccountName'])
          this.inputParams.AccountName = param['AccountName'];
        if (param['PremiseNumber'])
          this.inputParams.PremiseNumber = param['PremiseNumber'];
        if (param['PremiseName'])
          this.inputParams.PremiseName = param['PremiseName'];
        if (param['PremiseRowID'])
          this.inputParams.PremiseRowID = param['PremiseRowID'];
        if (param['ProductCode'])
          this.inputParams.ProductCode = param['ProductCode'];
        if (param['ProductDesc'])
          this.inputParams.ProductDesc = param['ProductDesc'];
        if (param['ServiceCoverNumber'])
          this.inputParams.ServiceCoverNumber = param['ServiceCoverNumber'];
        if (param['ServiceCoverRowID'])
          this.inputParams.ServiceCoverRowID = param['ServiceCoverRowID'];
        this.setUI(this.inputParams);
        this.setGridSettings();
      });

    /*this.routerSubscription = this.router.events.subscribe(event => {
        if (this.storeData['params']) {
            if (this.storeData['params']['currentContractType'] === 'C') {
                this.backLinkUrl = '#/contractmanagement/maintenance/contract';
            } else if (this.storeData['params']['currentContractType'] === 'J') {
                this.backLinkUrl = '#/contractmanagement/maintenance/job';
            } else if (this.storeData['params']['currentContractType'] === 'P') {
                this.backLinkUrl = '#/contractmanagement/maintenance/product';
            }
        } else {
            this.backLinkUrl = '#/contractmanagement/maintenance/contract';
        }
    });*/
  }

  public onPremiseDataReceived(data: any, route: any): void {
    this.PremisesNumber = data.PremiseNumber;
    this.PremisesName = data.PremiseName;
    this.inputParamsProduct.PremiseNumber = data.PremiseNumber;
    this.inputParamsProduct.PremiseName = data.PremiseName;
    this.inputParamsProduct.ContractNumber = this.ContractNumber;
    this.inputParamsProduct.ContractName = this.ContractName;
  }
  public onProductDataReceived(data: any, route: any): void {
    this.ProductCode = data.ProductCode;
    this.ProductDesc = data.ProductDesc;
  }

  public onHistoryDataReceived(data: any, route: any): void {
    this.HistoryTypeCode = data.HistoryTypeCode;
    this.HistoryTypeCodeDesc = data.HistoryTypeDesc;
  }

  ngOnInit(): void {
    this.backLinkText = GlobalConstant.Configuration.BackText;
    this.translateService.setUpTranslation();
    this.AccountNumberReadonly = true;
    this.AccountNameReadonly = true;
    this.ContractNumberReadonly = true;
    this.ContractNameReadonly = true;
    this.PremisesNumberReadonly = false;
    this.PremisesNameReadonly = true;
    this.ProductCodeReadonly = false;
    this.ProductDescReadonly = true;
    this.HistoryTypeReadonly = true;
    this.CurrDate = new Date(this.dt.getFullYear(), this.dt.getMonth() - 6, this.dt.getDate());
    this.effectiveDate = this.globalize.parseDateToFixedFormat(this.CurrDate).toString();
    this.effectiveDateTo = '';
    this.CreateHistoryType();
    this.updateView(this.inputParams);

    this.viewList = [{
      'text': 'All',
      'value': 'All'
    }];
    this.updateViewOption(this.inputParams);
    this.inputParamsProduct.ContractNumber = this.ContractNumber;
    this.inputParamsProduct.ContractName = this.ContractName;
  }

  ngOnDestroy(): void {
    if (this.subscription)
      this.subscription.unsubscribe();

    if (this.storeSubscription)
      this.storeSubscription.unsubscribe();
  }
  public effectiveDateSelectedValue(value: any): void {
    if (value && value.value) {
      this.effectiveDate = value.value;
    } else {
      this.effectiveDate = '';
    }
  }

  public toDateSelectedValue(value: any): void {
    if (value && value.value) {
      this.effectiveDateTo = value.value;
    } else {
      this.effectiveDateTo = '';
    }
  }


  public getGridInfo(info: any): void {
    this.historyGridPagination.totalItems = info.totalRows;
  }

  public selectedOptionsBy(OptionsValue: string): void {
    this.OptionSelected = OptionsValue;
    switch (this.OptionSelected.trim()) {
      case 'Value':
        this.router.navigate([InternalGridSearchServiceModuleRoutes.ICABSASERVICEVALUEGRID], {
          queryParams: {
            ParentMode: this.inputParams.parentMode + 'History-All',
            CurrentContractTypeURLParameter: this.inputParams.ContractType,
            ContractNumber: this.ContractNumber,
            ContractName: this.ContractName,
            PremiseNumber: this.PremisesNumber,
            PremiseName: this.PremisesName
          }
        });
        break;

      case 'Invoice':
        this.router.navigate(['/billtocash/contract/invoice'], {
          queryParams: {
            CurrentContractTypeURLParameter: this.inputParams.ContractType,
            ContractNumber: this.ContractNumber,
            ContractName: this.ContractName,
            parentMode: 'Contract'
          }
        });
        break;

      case 'LostBusiness':
        //Routing goes here
        break;
    }
  }

  public selectedView(viewValue: string): void {
    this.ViewSelected = viewValue;
  }

  public selectedSortBy(sortValue: string): void {
    this.SortBySelected = sortValue;
  }

  public getCurrentDate(): string {
    let today = new Date();

    let dd = today.getDate();
    let mm = today.getMonth() + 1;
    let yyyy = today.getFullYear();
    let _date = dd + '/' + mm + '/' + yyyy;
    return _date;
  }

  public updateViewOption(params: any): void {
    this.viewList = [{}];
    this.viewList = [{
      'text': 'All',
      'value': 'All'
    }];
    switch (params.parentMode) {
      case 'Contract':
        if ((this.PremisesNumber) && (!this.ProductCode)) {

          this.viewList.push({
            'text': 'Premises Only',
            'value': 'Premise'
          }
          );

        } else if (!this.PremisesNumber) {

          this.viewList.push({
            'text': 'Contract Only',
            'value': 'Contract'
          },
            {
              'text': 'Contract and Premises',
              'value': 'ContractPremise'
            }
          );

        }
        break;
      case 'Premise':
        if (!this.ProductCode) {
          this.viewList.push({
            'text': 'Premises Only',
            'value': 'Premise'
          }
          );
        }
        break;
      case 'ServiceCover':
        break;
    }

  }

  public CreateHistoryType(): void {
    let data = [{
      'table': 'HistoryType',
      'query': {},
      'fields': ['HistoryTypeCode', 'HistoryTypeSystemDesc']
    }];
    this.lookUpRecord(JSON.parse(JSON.stringify(data)), 5000).subscribe(
      (e) => {
        this.HistoryType = [{ 'text': 'All', 'value': '' }];
        try {
          for (let hc of e.results[0]) {
            let newOption = { 'text': hc['HistoryTypeSystemDesc'], 'value': hc['HistoryTypeCode'] };
            this.HistoryType.push(newOption);
          }
        } catch (e) {
          this._logger.warn(e);
        }
      });
  }

  public lookUpRecord(data: Object, maxresults: number): any {
    this.queryLookUp.set(this.serviceConstants.Action, '0');
    this.queryLookUp.set(this.serviceConstants.BusinessCode, this.storeData['code'] && this.storeData['code'].business ? this.storeData['code'].business : this.utils.getBusinessCode());
    this.queryLookUp.set(this.serviceConstants.CountryCode, this.storeData['code'] && this.storeData['code'].country ? this.storeData['code'].country : this.utils.getCountryCode());
    if (maxresults) {
      this.queryLookUp.set(this.serviceConstants.MaxResults, maxresults.toString());
    }
    return this._httpService.lookUpRequest(this.queryLookUp, data);
  }

  public PremiseNumber_onchange(): void {
    if (!this.PremisesNumber) {
      this.PremisesNumber = '';
      this.PremisesName = '';
      this.ProductCode = '';
      this.ProductDesc = '';
      this.inputParamsProduct.PremiseNumber = '';
      this.inputParamsProduct.PremiseName = '';
    }
    else if (this.PremisesNumberReadonly === false) {
      this.PopulateDescriptions('Premise');
    }
    this.updateViewOption(this.inputParams);
  }

  public ProductCode_onchange(): void {
    if (!this.ProductCode) {
      this.ProductCode = '';
      this.ProductDesc = '';
    }
    else if (this.ProductCodeReadonly === false) {
      this.PopulateDescriptions('Product');
    }
    this.updateViewOption(this.inputParams);
  }

  public History_onchange(): void {
    this.PopulateDescriptions('History');
  }

  public onGridRowDblClick(event: any): void {
    let data = this.historyGrid.getCellInfoForSelectedRow(event.rowIndex, 0);
    if (event.cellData.text.toLowerCase() === 'info') {
      this.router.navigate([InternalMaintenanceApplicationModuleRoutes.ICABSACONTRACTHISTORYDETAIL],
        {
          queryParams: {
            parentMode: 'ContractHistory',
            ContractNumber: this.ContractNumber,
            currentContractType: this.currentContractType,
            AccountNumber: this.AccountNumber,
            ContractHistoryRowID: data['rowID']
          }
        });
    }
    switch (this.historyGrid.headerColumns[event.cellIndex].text.trim().replace(/[^a-zA-Z ]/g, '').replace(/\s/g, '')) {
      case 'ProRata':
        if (event.cellData.text === 'Yes') {
          this.router.navigate([InternalGridSearchSalesModuleRoutes.ICABSAPRORATACHARGESUMMARY],
            {
              queryParams: {
                parentMode: 'ContractHistory',
                ContractHistoryRowID: data['rowID'],
                currentContractType: this.inputParams.ContractType,
                ContractNumber: this.ContractNumber,
                ContractName: this.ContractName,
                PremiseNumber: this.PremisesNumber,
                PremiseName: this.PremisesName,
                ProductCode: this.ProductCode,
                ProductDesc: this.ProductDesc

              }
            });
        }
        break;
      default:
        break;
    }
  }

  public PopulateDescriptions(type: any): void {
    this.search = new URLSearchParams();
    this.search.set(this.serviceConstants.Action, '2');
    this.search.set(this.serviceConstants.BusinessCode, this.storeData['code'] && this.storeData['code'].business ? this.storeData['code'].business : this.utils.getBusinessCode());
    this.search.set(this.serviceConstants.CountryCode, this.storeData['code'] && this.storeData['code'].country ? this.storeData['code'].country : this.utils.getCountryCode());
    this.search.set('ContractNumber', this.ContractNumber);

    this.search.set('methodtype', 'Maintenance');
    switch (type) {
      case 'Product':
        this.search.set('PremiseNumber', this.ProductCode);
        this.search.set('Function', 'GetServiceCover');
        this._httpService.makeGetRequest(this.method, this.module, this.operation, this.search).subscribe(
          (data) => {
            try {
              this.ProductDesc = data.ProductDesc;
            } catch (error) {
              this.errorService.emitError(error);
            }

          },
          (error) => {
            this.errorService.emitError(error);
          }
        );

        break;
      case 'Premise':
        this.search.set('PremiseNumber', this.PremisesNumber);
        this.search.set('Function', 'GetPremiseName');
        this._httpService.makeGetRequest(this.method, this.module, this.operation, this.search).subscribe(
          (data) => {
            try {
              this.PremisesName = data.PremiseName;
              this.inputParamsProduct.PremiseNumber = this.PremisesNumber;
              this.inputParamsProduct.PremiseName = data.PremiseName;
              this.inputParamsProduct.ContractNumber = this.ContractNumber;
              this.inputParamsProduct.ContractName = this.ContractName;

            } catch (error) {
              this.errorService.emitError(error);
            }
          },
          (error) => {
            this.errorService.emitError(error);
          }
        );

        break;
      case 'History':
        this.search.set('HistoryTypeCode', this.HistoryTypeCode);
        this.search.set('Function', 'GetHistoryTypeDesc');
        this._httpService.makeGetRequest(this.method, this.module, this.operation, this.search).subscribe(
          (data) => {
            try {
              if (data.HistoryTypeDesc)
                this.HistoryTypeCodeDesc = data.HistoryTypeDesc;
              else
                this.HistoryTypeCodeDesc = '';
            } catch (error) {
              this.errorService.emitError(error);
            }
          },
          (error) => {
            this.errorService.emitError(error);
          }
        );

        break;
    }


  }

  public setUI(params: any): void {
    this.sortList = [{
      'text': 'Effective Date',
      'value': 'EffectiveDate'
    }, {
      'text': 'Processed Date',
      'value': 'ProcessedDate'
    }
    ];

    this.options = [{
      'text': 'Options',
      'value': ' '
    }, {
      'text': 'Value',
      'value': 'Value'
    }, {
      'text': 'Invoice',
      'value': 'Invoice'
    }
    ];

    if (this.currentContractType === 'C') {
      this.options.push({
        'text': 'Client Retention',
        'value': 'LostBusiness'
      });

    }
    this.pageTitleSub = '';

    switch (params.parentMode) {
      case 'Contract':
        this.pageTitleMain = this.contractLabel;
        this.pageTitleSub = this.contractLabel;
        this.AccountNumber = params.AccountNumber;
        this.AccountName = params.AccountName;
        this.ContractRowID = params.ContractRowID;
        this.ContractNumber = params.ContractNumber;
        this.ContractName = params.ContractName;

        this.PremisesNumberReadonly = false;
        this.ProductCodeReadonly = false;
        this.HistoryTypeReadonly = false;
        this.accountHide = false;
        break;
      case 'Premise':
        this.pageTitleMain = this.contractLabel;
        this.pageTitleSub = 'Premises';
        this.ContractNumber = params.ContractNumber;
        this.ContractName = params.ContractName;
        this.PremisesNumber = params.PremiseNumber;
        this.PremisesName = params.PremiseName;
        this.ProductCode = params.ProductCode;
        this.PremiseRowID = params.PremiseRowID;
        this.PopulateDescriptions('Premise');
        break;
      case 'ServiceCover':
        this.pageTitleMain = this.contractLabel;
        this.pageTitleSub = 'Service Cover';
        this.PremisesNumber = params.PremiseNumber;
        this.PremisesName = params.PremiseName;
        this.ProductCode = params.ProductCode;
        this.ProductDesc = params.ProductDesc;
        this.ServiceCoverNumber = params.ServiceCoverNumber;
        this.ServiceCoverRowID = params.ServiceCoverRowID;
        this.ContractNumber = params.ContractNumber;
        this.ContractName = params.ContractName;

        this.PremisesNumberReadonly = true;
        this.ProductCodeReadonly = true;

        break;
    }
    let titleDoc1: string = '', titleDoc2: string = '', titleDoc3: string = '';

    this.getTranslatedValue(this.pageTitleMain, null).subscribe((res: string) => {
      this.zone.run(() => {
        if (res) {
          titleDoc1 = res;
        } else {
          titleDoc1 = this.pageTitleMain;
        }
      });
    });
    this.getTranslatedValue(this.pageTitleSub, null).subscribe((res: string) => {
      this.zone.run(() => {
        if (res) {
          titleDoc2 = res;
        } else {
          titleDoc2 = this.pageTitleSub;
        }
      });
    });

    this.getTranslatedValue('History', null).subscribe((res: string) => {
      this.zone.run(() => {
        if (res) {
          titleDoc3 = res;
        } else {
          titleDoc3 = this.pageTitleMain;
        }
      });
    });

    this.utils.setTitle(titleDoc1 + ' ' + titleDoc3 + '-' + titleDoc2);
    this.inputParamsProduct.ContractNumber = this.ContractNumber;
    this.inputParamsProduct.ContractName = this.ContractName;
    this.inputParamsPremise.ContractNumber = this.ContractNumber;
    this.inputParamsPremise.ContractName = this.ContractName;

  }

  public getCurrentPage(event: any): void {
    this.pageCurrent = event.value;
    this.updateView(this.inputParams);
  }

  public getTranslatedValue(key: any, params: any): any {
    if (params) {
      return this.translate.get(key, { value: params });
    } else {
      return this.translate.get(key);
    }

  }
  public refresh(event: any): void {
    this.loadData(this.inputParams);
  }

  public onGridRowClick(event: any): void {
    //
  }
  public updateView(params: any): void {
    this.inputParams = params;
    this.setUI(this.inputParams);
    this.loadData(this.inputParams);
  }

  public loadData(params: any): void {
    this.setFilterValues(params);
    this.inputParams.method = this.method;
    this.inputParams.operation = this.operation;
    this.inputParams.module = this.module;
    this.inputParams.search = this.search;
    this.historyGrid.loadGridData(this.inputParams);

  }
  private setGridSettings(): void {
    let additionalProperties: Array<any> = [], prefix: number = 1;

    if (this.columnIndex.ProductCode) {
      prefix = this.columnIndex.ProductCode - 1;
    }
    additionalProperties = [
      {
        'type': MntConst.eTypeDate,
        'index': 0,
        'align': 'center'
      },
      {
        'type': MntConst.eTypeText,
        'index': 1,
        'align': 'center'
      },
      {
        'type': MntConst.eTypeText,
        'index': 2,
        'align': 'center'
      },
      {
        'type': MntConst.eTypeText,
        'index': prefix + 1,
        'align': 'center'
      },
      {
        'type': MntConst.eTypeText,
        'index': prefix + 2,
        'align': 'center'
      },
      {
        'type': MntConst.eTypeText,
        'index': prefix + 3,
        'align': 'center'
      },
      {
        'type': MntConst.eTypeText,
        'index': prefix + 4,
        'align': 'center'
      },
      {
        'type': MntConst.eTypeCurrency,
        'index': prefix + 5,
        'align': 'center'
      },
      {
        'type': MntConst.eTypeCurrency,
        'index': prefix + 6,
        'align': 'center'
      },
      {
        'type': MntConst.eTypeCurrency,
        'index': prefix + 7,
        'align': 'center'
      },
      {
        'type': MntConst.eTypeImage,
        'index': prefix + 8,
        'align': 'center'
      },
      {
        'type': MntConst.eTypeText,
        'index': prefix + 9,
        'align': 'center'
      }
    ];
    this.validateProperties = this.validateProperties.concat(additionalProperties);
  }
  public setFilterValues(params: any): void {
    this.search = new URLSearchParams();
    this.search.set(this.serviceConstants.Action, '2');
    this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
    this.search.set('ContractNumber', this.ContractNumber);
    this.search.set('PremiseNumber', this.PremisesNumber);
    this.search.set('ProductCode', this.ProductCode);
    this.search.set('ServiceCoverNumber', this.ServiceCoverNumber);
    this.search.set('ContractRowID', this.ContractRowID);
    this.search.set('PremiseRowID', this.PremiseRowID);
    this.search.set('ServiceCoverRowID', this.ServiceCoverRowID);
    this.search.set('HistoryTypeCode', this.HistoryTypeCode);
    if (!this.SortBySelected) {
      this.SortBySelected = 'EffectiveDate';
    }
    this.search.set('SortBy', this.SortBySelected);
    this.search.set('DateFrom', this.effectiveDate);
    this.search.set('DateTo', this.effectiveDateTo);
    this.search.set('ViewType', this.ViewSelected);
    this.search.set('Level', this.inputParams.parentMode);
    this.search.set('PageSize', this.pageSize);
    this.search.set('PageCurrent', this.pageCurrent);
    this.search.set('HeaderClickedColumn', '');
    this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
  }

  public onBackLinkClick(event: any): void {
    event.preventDefault();
    this.location.back();
  }
}
