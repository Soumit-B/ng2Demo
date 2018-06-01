import { GlobalizeService } from './../../../shared/services/globalize.service';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { InternalMaintenanceApplicationModuleRoutes } from './../../base/PageRoutes';
import { LookUp } from './../../../shared/services/lookup';
import { RiExchange } from './../../../shared/services/riExchange';
import { SpeedScript } from './../../../shared/services/speedscript';
import { Utils } from './../../../shared/services/utility';
import { SysCharConstants } from './../../../shared/constants/syscharservice.constant';
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

import { ErrorService } from '../../../shared/services/error.service';
import { HttpService } from '../../../shared/services/http-service';
import { AuthService } from '../../../shared/services/auth.service';
import { LocaleTranslationService } from '../../../shared/services/translation.service';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';


import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';

@Component({
    templateUrl: 'iCABSAPlanVisitGridDay.html',
    styles: [`
    :host /deep/ .gridtable tbody tr td:nth-child(1)  {
        width:10%;
    }
  `]
})

export class PlanVisitGridDayComponent implements OnInit, OnDestroy {

    @ViewChild('visitGrid') visitGrid: GridComponent;
    @ViewChild('visitGridPagination') visitGridPagination: PaginationComponent;

    ///Plan visit grid day
    private parentMode: string;

    public inputParams: any = { parentMode: '', SelectedDate: '', RowID: '' };

    private routeParams: any;
    public isRequesting: boolean = false;
    public method: string = 'service-planning/maintenance';
    public module: string = 'plan-visits';
    public operation: string = 'Application/iCABSAPlanVisitGridDay';
    public search: URLSearchParams = new URLSearchParams();

    public subscription: Subscription;
    public storeSubscription: Subscription;
    public totalRecords: number;

    public strGridData: any;
    public trContractDisplay: boolean = false;
    public trPremiseDisplay: boolean = false;
    public trProductDisplay: boolean = false;

    public ContractNumberState: boolean = false;
    public ContractNameState: boolean = false;
    public PremiseNumberState: boolean = false;
    public PremiseNameState: boolean = false;
    public ProductCodeState: boolean = false;
    public ProductDescState: boolean = false;

    public ContractNumberServiceCoverRowID: string;
    public SelectedDateValue: string;
    public bUpdateParent: boolean = false;
    public maxColumn: number = 8;
    public pageSize: number;
    public currentPage: number = 1;
    public gridData: any;
    public gridTotalItems: number;
    public itemsPerPage: number;
    public contractStoreData: any = {};

    public ContractNumber: any = '';
    public ContractName: any = '';
    public PremiseNumber: any = '';
    public PremiseName: any = '';
    public ProductCode: any = '';
    public ProductDesc: any = '';
    public gridCurPage: number;
    public validateProperties: Array<any> = [{
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
        'index': 3,
        'align': 'center'
    },
    {
        'type': MntConst.eTypeDate,
        'index': 4,
        'align': 'center'
    },
    {
        'type': MntConst.eTypeText,
        'index': 5,
        'align': 'center'
    },
    {
        'type': MntConst.eTypeDate,
        'index': 6,
        'align': 'center'
    },
    {
        'type': MntConst.eTypeInteger,
        'index': 7,
        'align': 'center'
    }];

    public BusinessCode: string;
    public subLookup: any;
    public legend: Array<any> = [];
    //******** */

    constructor(
        private _logger: Logger,
        private _fb: FormBuilder,
        private utils: Utils,
        private SpeedScript: SpeedScript,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private zone: NgZone,
        private _http: Http,
        private errorService: ErrorService,
        private httpService: HttpService,
        private _authService: AuthService,
        private _ls: LocalStorageService,
        private _componentInteractionService: ComponentInteractionService,
        private serviceConstants: ServiceConstants,
        private renderer: Renderer,
        private store: Store<any>,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private translateService: LocaleTranslationService,
        private riExchange: RiExchange,
        private LookUp: LookUp,
        private globalize: GlobalizeService,
        private SysCharConstants: SysCharConstants) {

        this.subscription = activatedRoute.queryParams.subscribe(
            (param: any) => {
                this.routeParams = param;
                //this.inputParams.RowID = param.RowID ?  param.RowID : this.inputParams.RowID;
            });
        this.storeSubscription = store.select('contract').subscribe(data => {
            if (data['data'] && !(Object.keys(data['data']).length === 0 && data['data'].constructor === Object)) {
                this.contractStoreData = data;
            }
        });
    }

    ngOnInit(): void {
        this.BusinessCode = this.utils.getBusinessCode();
        this.translateService.setUpTranslation();
        this.SelectedDateValue = this.globalize.formatDateToLocaleFormat(this.riExchange.GetParentHTMLInputValue(this.routeParams, 'SelectedDate', true)).toString();
        this.parentMode = this.routeParams.parentMode;
        this.pageSize = 10;
        this.itemsPerPage = 10;
        this.gridCurPage = 1;
        this.doLookup();
        if (this.parentMode === 'Year') {
            this.YearLoad();
        } else {
            alert('error invalid parent mode!');
        }
    }

    public ngOnDestroy(): void {
        if (this.subscription) { this.subscription.unsubscribe(); }
        if (this.storeSubscription) { this.storeSubscription.unsubscribe(); }
        if (this.subLookup) { this.subLookup.unsubscribe(); }
    }

    public YearLoad(): void {
        this.trContractDisplay = true;
        this.trPremiseDisplay = true;
        this.trProductDisplay = true;

        this.ContractNumber = this.riExchange.GetParentHTMLInputValue(this.routeParams, 'ContractNumber', true);
        //this.ContractName = this.riExchange.GetParentHTMLInputValue(this.routeParams, 'ContractName', true);
        this.PremiseNumber = this.riExchange.GetParentHTMLInputValue(this.routeParams, 'PremiseNumber', true);
        //this.PremiseName = this.riExchange.GetParentHTMLInputValue(this.routeParams, 'PremiseName', true);
        this.ProductCode = this.riExchange.GetParentHTMLInputValue(this.routeParams, 'ProductCode', true);
        //this.ProductDesc = this.riExchange.GetParentHTMLInputValue(this.routeParams, 'ProductDesc', true);
        this.ContractNumberServiceCoverRowID = this.riExchange.GetParentHTMLInputValue(this.routeParams, 'ServiceCoverRowID', true);

        this.BuildGrid();
    }

    private doLookup(): any {
        let lookupIPSub = [
            {
                'table': 'Contract',
                'query': {
                    'BusinessCode': this.BusinessCode,
                    'ContractNumber': this.riExchange.GetParentHTMLInputValue(this.routeParams, 'ContractNumber', true)
                },
                'fields': ['ContractName']
            },
            {
                'table': 'Premise',
                'query': {
                    'BusinessCode': this.BusinessCode,
                    'ContractNumber': this.riExchange.GetParentHTMLInputValue(this.routeParams, 'ContractNumber', true),
                    'PremiseNumber': this.riExchange.GetParentHTMLInputValue(this.routeParams, 'PremiseNumber', true)
                },
                'fields': ['PremiseName']
            },
            {
                'table': 'Product',
                'query': {
                    'BusinessCode': this.BusinessCode,
                    'ProductCode': this.riExchange.GetParentHTMLInputValue(this.routeParams, 'ProductCode', true)
                },
                'fields': ['ProductDesc']
            }
        ];

        this.subLookup = this.LookUp.lookUpRecord(lookupIPSub).subscribe((data) => {
            this._logger.log('Lookup:', data);
            if (data.length > 0 && data[0].length > 0) {
                let resultContract = data[0];
                let resultPremise = data[1];
                let resultProduct = data[2];
                this.ContractName = resultContract[0].ContractName;
                if (resultPremise[0] && resultPremise[0].PremiseName) {
                    this.PremiseName = resultPremise[0].PremiseName;
                }
                if (resultProduct[0] && resultProduct[0].ProductDesc) {
                    this.ProductDesc = resultProduct[0].ProductDesc;
                }
            }
        });
    }

    public riExchange_UpdateHTMLDocument(): void {
        //riGrid.Execute
        this.bUpdateParent = true;
    }

    public riGrid_BeforeExecute(): void {
        this.strGridData = this.strGridData + '&Date=' + this.SelectedDateValue;

    }
    public riGrid_BodyOnDblClick(data: any): void {
        this.Detail(data);
    }
    public Detail(data: any): void {
        let completRowData = data.trRowData;
        this.router.navigate([InternalMaintenanceApplicationModuleRoutes.ICABSAPLANVISITMAINTENANCE], {
            queryParams: {
                'parentMode': 'Year',
                'PlanVisitRowID': completRowData[0].rowID
            }
        });
    }

    public BuildGrid(): void {
        this.setFilterValues();
        this.inputParams.method = this.method;
        this.inputParams.operation = this.operation;
        this.inputParams.module = this.module;
        this.inputParams.search = this.search;
        this.visitGrid.loadGridData(this.inputParams);
    }

    public setFilterValues(): void {
        this.search.set(this.serviceConstants.Action, '2');
        this.search.set(this.serviceConstants.BusinessCode, this.contractStoreData['code'] ? this.contractStoreData['code'].business : this.utils.getBusinessCode());
        this.search.set('countryCode', this.contractStoreData['code'] ? this.contractStoreData['code'].country : this.utils.getCountryCode());
        this.search.set('Date', this.globalize.parseDateToFixedFormat(this.SelectedDateValue).toString());
        this.search.set('riGridHandle', (Math.floor(Math.random() * 900000) + 100000).toString());
        this.search.set('riSortOrder', 'Descending');
        this.search.set('riGridMode', '0');
        this.search.set('RowID', this.ContractNumberServiceCoverRowID);
        this.search.set(this.serviceConstants.GridPageCurrent, this.gridCurPage.toString());
        this.search.set(this.serviceConstants.GridPageSize, this.itemsPerPage.toString());
        this.search.set('level', 'ServiceCoverDay');
    }

    public getGridInfo(info: any): void {
        if (info && info.totalPages) {
            this.totalRecords = parseInt(info.totalPages, 0) * this.itemsPerPage;
        } else {
            this.totalRecords = 0;
        }
        let obj = this.visitGrid.bodyColumns[0];
        if (obj) {
            setTimeout(() => {
                this.legend = [];
                let legend = obj.additionalData.split('bgcolor=');
                for (let i = 0; i < legend.length; i++) {
                    let str = legend[i];
                    if (str.indexOf('"#') >= 0) {
                        this.legend.push({
                            color: str.substr(str.indexOf('"#') + 1, 7),
                            label: str.substr(str.indexOf('<td>') + 4, str.substr(str.indexOf('<td>') + 4).indexOf('&'))
                        });
                    }
                }
            }, 100);
        }
    }

    public getCurrentPage(event: any): void {
        this.gridCurPage = event.value;
        this.BuildGrid();
    }

    public refresh(): void {
        this.gridCurPage = 1;
        this.visitGrid.clearGridData();
        this.BuildGrid();
        //this.visitGrid.loadGridData(this.inputParams);
    }
}
