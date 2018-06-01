import { AjaxObservableConstant } from '../../../shared/constants/ajax-observable.constant';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { GridAdvancedComponent } from './../../../shared/components/grid-advanced/grid-advanced';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { Logger } from '@nsalaun/ng2-logger';
import { GridComponent } from './../../../shared/components/grid/grid';
import { Http, URLSearchParams } from '@angular/http';
import { LookUp } from './../../../shared/services/lookup';
import { SysCharConstants } from './../../../shared/constants/syscharservice.constant';
import { ContractSearchComponent } from './../search/iCABSAContractSearch';
import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { HttpService } from '../../../shared/services/http-service';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { ComponentInteractionService } from '../../../shared/services/component-interaction.service';
import { LocaleTranslationService } from './../../../shared/services/translation.service';
import { Store } from '@ngrx/store';
import { LocalStorageService } from 'ng2-webstorage';
import { TranslateService } from 'ng2-translate';
import { Utils } from '../../../shared/services/utility';
import { RiExchange } from '../../../shared/services/riExchange';
import { SpeedScript } from '../../../shared/services/speedscript';
import { Subscription } from 'rxjs';
import { GlobalConstant } from '../../../shared/constants/global.constant';
import { Location } from '@angular/common';
import { ContractManagementModuleRoutes } from '../../base/PageRoutes';

@Component({
    templateUrl: 'iCABSAStaticVisitGridDay.html'
})

export class StaticVisitGridDayComponent implements AfterViewInit, OnDestroy, OnInit {
    @ViewChild('riGrid') riGrid: GridAdvancedComponent;

    public contractComponent = ContractSearchComponent;
    public ContractNumber: any;
    public ContractName: any;
    public contractData: any;
    public contractComponentParams: any = {
        'parentMode': 'Contract',
        'pageTitle': 'Customer Contact Search',
        'showBusinessCode': false,
        'showCountryCode': false
    };
    public PremiseNumber: string;
    public PremiseName: string;

    public itemsPerPage: number = 10;
    public currentPage: number = 1;
    public totalItems: number = 1;

    public businessCode: any;
    public countryCode: any;
    public ajaxSource = new BehaviorSubject<any>(0);
    public ajaxSource$;
    public storeSubscription: Subscription;
    public querySubscription: Subscription;
    public ajaxSubscription: Subscription;
    public storeData: any;
    public DateType: any;
    public SelectedDate: any;
    public SelectedMonth: any;
    public SelectedYear: any;
    public dueDateDisplay: boolean = true;
    public dueDate: any;
    public dueMonthDisplay: boolean = true;
    public dueContractDisplay: boolean = true;
    public duePremisetDisplay: boolean = true;
    public RowID: any;
    public PremiseRowID: any;
    public AddElementNumber: any;
    public backLinkText: string = '';
    public GridPageSize: any = 20;
    public gridSortHeaders: Array<any>;
    public dueDateFormatted: any;
    public enablePostcodeDefaulting: boolean;

    public query: URLSearchParams = new URLSearchParams();
    constructor(
        private componentInteractionService: ComponentInteractionService,
        private translate: TranslateService,
        private ls: LocalStorageService,
        private http: Http,
        private httpService: HttpService,
        private localeTranslateService: LocaleTranslationService,
        private sysCharConstants: SysCharConstants,
        private activatedRoute: ActivatedRoute,
        private ajaxconstant: AjaxObservableConstant,
        private logger: Logger,
        private utils: Utils,
        private LookUp: LookUp,
        private SpeedScript: SpeedScript,
        private serviceConstants: ServiceConstants,
        private store: Store<any>,
        private location: Location,
        public router: Router
    ) {
        this.businessCode = this.utils.getBusinessCode();
        this.countryCode = this.utils.getCountryCode();
        this.inputParams.businessCode = this.businessCode;
        this.inputParams.countryCode = this.countryCode;
        this.componentInteractionService.emitMessage(false);
        this.storeSubscription = store.select('contract').subscribe(data => {
            this.storeData = data;
            this.setFormData(this.storeData);
        });
    }

    public onContractDataReceived(data: any, route: any): void {
        this.contractData = data;
        this.ContractNumber = data.ContractNumber;
        this.ContractName = data.ContractName;
        this.dueContractDisplay = true;
        this.duePremisetDisplay = false;
        this.contractLoad();
        this.getUrlParams();
    }


    public inputParams: any = {
        'parentMode': '',
        'businessCode': '',
        'countryCode': '',
        'operation': 'Application/iCABSAStaticVisitGridDay',
        'module': 'plan-visits',
        'method': 'service-planning/maintenance',
        'action': '2',
        'currentContractType': ''
    };

    ngOnInit(): void {
        this.ajaxSource$ = this.ajaxSource.asObservable();
        this.itemsPerPage = this.GridPageSize;
        this.getSysCharDtetails();
        this.riGrid.PageSize = this.itemsPerPage;
    }

    private buildGrid(): void {
        this.riGrid.Clear();

        this.riGrid.AddColumn('BranchServiceAreaCode', 'StaticVisit', 'BranchServiceAreaCode', MntConst.eTypeCode, 6);
        this.riGrid.AddColumnAlign('BranchServiceAreaCode', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnOrderable('BranchServiceAreaCode', true);

        this.riGrid.AddColumn('EmployeeCode', 'StaticVisit', 'EmployeeCode', MntConst.eTypeCode, 6);
        this.riGrid.AddColumnAlign('EmployeeCode', MntConst.eAlignmentCenter);

        this.riGrid.AddColumn('BranchServiceAreaSeqNo', 'StaticVisit', 'BranchServiceAreaSeqNo', MntConst.eTypeInteger, 6);
        this.riGrid.AddColumnAlign('BranchServiceAreaSeqNo', MntConst.eAlignmentCenter);

        if (this.DateType === 'Month') {

            this.riGrid.AddColumn('StaticVisitDate', 'StaticVisit', 'StaticVisitDate', MntConst.eTypeDate, 10);
            this.riGrid.AddColumnAlign('StaticVisitDate', MntConst.eAlignmentCenter);
            this.riGrid.AddColumnOrderable('StaticVisitDate', true);

        }

        if (this.inputParams.parentMode === 'Contract') {

            this.riGrid.AddColumn('PremiseNumber', 'StaticVisit', 'PremiseNumber', MntConst.eTypeInteger, 5);
            this.riGrid.AddColumnAlign('PremiseNumber', MntConst.eAlignmentCenter);

            this.riGrid.AddColumn('PremiseName', 'StaticVisit', 'PremiseName', MntConst.eTypeText, 20);

            if (this.enablePostcodeDefaulting) {
                this.riGrid.AddColumn('PremisePostcode', 'StaticVisit', 'PremisePostcode', MntConst.eTypeCode, 10);
            }

        }

        this.riGrid.AddColumn('ProductCode', 'StaticVisit', 'ProductCode', MntConst.eTypeCode, 10);
        this.riGrid.AddColumnAlign('ProductCode', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnOrderable('ProductCode', true);

        this.riGrid.AddColumn('ServiceVisitFrequency', 'StaticVisit', 'ServiceVisitFrequency', MntConst.eTypeInteger, 4);
        this.riGrid.AddColumnAlign('ServiceVisitFrequency', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnOrderable('ServiceVisitFrequency', true);

        this.riGrid.AddColumn('ServiceQuantity', 'StaticVisit', 'ServiceQuantity', MntConst.eTypeInteger, 4);
        this.riGrid.AddColumnAlign('ServiceQuantity', MntConst.eAlignmentCenter);

        this.riGrid.AddColumn('ServicMntConst.eTypeCode', 'StaticVisit', 'ServicMntConst.eTypeCode', MntConst.eTypeCode, 2);
        this.riGrid.AddColumnAlign('ServicMntConst.eTypeCode', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnOrderable('ServicMntConst.eTypeCode', true);

        this.riGrid.AddColumn('LastVisitDate', 'StaticVisit', 'LastVisitDate', MntConst.eTypeDate, 10);
        this.riGrid.AddColumnAlign('LastVisitDate', MntConst.eAlignmentCenter);

        this.riGrid.AddColumn('LastVisitTypeCode', 'StaticVisit', 'LastVisitTypeCode', MntConst.eTypeCode, 2);
        this.riGrid.AddColumnAlign('LastVisitTypeCode', MntConst.eAlignmentCenter);

        this.riGrid.AddColumn('NextVisitDate', 'StaticVisit', 'NextVisitDate', MntConst.eTypeDate, 10);
        this.riGrid.AddColumnAlign('NextVisitDate', MntConst.eAlignmentCenter);

        this.riGrid.Complete();
        this.riGrid_beforeExecute();
    }

    public sortGrid(data: any): void {
        //this.query.set(this.serviceConstants.GridHeaderClickedColumn, data.fieldname);
        //this.query.set(this.serviceConstants.GridSortOrder, data.sort === 'DESC' ? 'Descending' : 'Ascending');
        //this.buildGrid();
    };

    ngAfterViewInit(): void {
        this.backLinkText = GlobalConstant.Configuration.BackText;
    };

    ngOnDestroy(): void {
        if (this.storeSubscription) this.storeSubscription.unsubscribe();
        if (this.querySubscription) this.querySubscription.unsubscribe();
        if (this.ajaxSubscription) this.ajaxSubscription.unsubscribe();
    };

    private getSysCharDtetails(): any {
        let sysCharList: number[] = [this.sysCharConstants.SystemCharEnablePostcodeDefaulting];
        let sysCharIP = {
            module: this.inputParams.module,
            operation: this.inputParams.operation,
            action: 0,
            businessCode: this.utils.getBusinessCode(),
            countryCode: this.utils.getCountryCode(),
            SysCharList: sysCharList.toString()
        };
        this.SpeedScript.sysCharPromise(sysCharIP).then((data) => {
            this.enablePostcodeDefaulting = data.records[0].Required;
            this.getUrlParams();
        });
    }

    public getUrlParams(): void {
        this.querySubscription = this.activatedRoute.queryParams.subscribe((params: Params) => {
            if (params['parentMode'] !== undefined)
                this.inputParams.parentMode = params['parentMode'];
            if (params['rowId'] !== undefined)
                this.inputParams.rowId = params['rowId'];
            if (params['year'] !== undefined)
                this.inputParams.year = params['year'];
            if (params['ContractNumber'] !== undefined)
                this.ContractNumber = params['ContractNumber'];
            if (params['ContractName'] !== undefined)
                this.ContractName = params['ContractName'];
            if (params['dueDate'] !== undefined) {
                this.dueDate = params['dueDate'];
            }
            if (params['SelectedMonth'] !== undefined)
                this.SelectedMonth = params['SelectedMonth'];
            if (params['SelectedYear'] !== undefined)
                this.SelectedYear = params['SelectedYear'];
            if (params['year'] !== undefined)
                this.SelectedYear = params['year'];
            if (params['GridPageSize'] !== undefined && params['GridPageSize'] !== '')
                this.GridPageSize = params['GridPageSize'];
            if (params['PremiseNumber'] !== undefined && params['PremiseNumber'] !== '')
                this.PremiseNumber = params['PremiseNumber'];
            if (params['PremiseName'] !== undefined)
                this.PremiseName = params['PremiseName'];
            if (params['DateType'] !== undefined)
                this.DateType = params['DateType'];
            if (params['rowId'] !== undefined)
                this.RowID = params['rowId'];
        });
        this.setFormDataFromUrl();
    }
    public setFormDataFromUrl(): void {
        switch (this.inputParams.parentMode) {
            case 'Contract':
                this.dueContractDisplay = true;
                this.duePremisetDisplay = false;
                this.contractLoad();
                break;
            case 'Premise':
                this.duePremisetDisplay = true;
                this.premiseLoad();
                break;
            default:
                break;
        }

        this.buildGrid();
    }
    private setFormData(data: any): void {
        this.ContractNumber = data['data'].ContractNumber;
        this.ContractName = data['data'].ContractName;
        this.PremiseNumber = data['data'].PremiseNumber;
        this.PremiseName = data['data'].PremiseName;
        this.DateType = data['data'].DateType;
        this.PremiseRowID = data['data'].PremiseRowID;
        this.SelectedDate = data['data'].SelectedDate;
        this.SelectedMonth = data['data'].SelectedMonth;
        this.SelectedYear = data['data'].SelectedYear || this.inputParams.year;
        this.RowID = this.inputParams.rowId || this.storeData['data'].Contract;
        this.query.set('SelectedMonth', this.SelectedMonth);
        this.query.set('SelectedYear', this.SelectedYear);
        this.query.set('DateType', this.DateType);
        this.dueDateFormatted = this.formatDateMine(data['data'].SelectedDate);
        this.dueDate = this.utils.formatDate(data['data'].SelectedDate);
        this.query.set('Date', this.dueDate);
        switch (this.DateType) {
            case 'Day':
                this.dueDateDisplay = true;
                break;
            case 'Month':
                this.dueMonthDisplay = false;
                break;
            default:
                break;
        }
        switch (this.inputParams.parentMode) {
            case 'Contract':
                this.dueContractDisplay = false;
                this.contractLoad();
                break;
            case 'Premise':
                this.duePremisetDisplay = false;
                this.premiseLoad();
                break;
            default:
                break;
        }

    }
    public contractLoad(): void {
        this.query.set('RowID', this.RowID);
        this.query.set('ContractNumber', this.ContractNumber);
        this.query.set('ContractName', this.ContractName);
        this.query.set('Level', 'ContractDay');
    }
    public premiseLoad(): void {
        this.query.set('RowID', this.RowID);
        this.query.set('ContractNumber', this.ContractNumber);
        this.query.set('ContractName', this.ContractName);
        this.query.set('PremiseNumber', this.PremiseNumber);
        this.query.set('PremiseName', this.PremiseName);
        this.query.set('Level', 'PremiseDay');
    }
    public formatDate(dateString: string): string {
        let dateArr = dateString.split('/');
        let dateVal = '';
        let monthVal = '';
        let yearVal = '';
        let dateMonth = { 'january': 1, 'february': 2, 'march': 3, 'april': 4, 'may': 5, 'june': 6, 'july': 7, 'agust': 8, 'september': 9, 'october': 10, 'november': 11, 'december': 12 };
        dateVal = dateArr[0];
        monthVal = dateMonth[dateArr[1].toLowerCase()].toString();
        if (dateVal.length === 1) dateVal = '0' + dateVal;
        if (monthVal.length === 1) monthVal = '0' + monthVal;
        yearVal = dateArr[2];
        return dateVal + '/' + monthVal + '/' + yearVal;
    }
    public riGrid_beforeExecute(): void {
        this.updateNumberOfRecord();
        this.query.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.query.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.query.set('DateType', this.DateType);
        this.query.set('PremiseNumber', this.PremiseNumber);
        this.query.set('ContractNumber', this.ContractNumber);
        this.query.set('PageCurrent', this.currentPage.toString());
        this.query.set('PageSize', this.itemsPerPage.toString());
        this.query.set('Mode', this.inputParams.parentMode);
        this.query.set('action', this.inputParams.action);

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.inputParams.method, this.inputParams.module, this.inputParams.operation, this.query).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data) {
                    this.riGrid.RefreshRequired();
                    this.totalItems = data.pageData ? data.pageData.lastPageNumber * this.itemsPerPage : 1;
                    this.riGrid.Execute(data);
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    public riGrid_afterExecute(): void {
        this.ajaxSource.next(this.ajaxconstant.COMPLETE);
    }


    public getRefreshData(): any {
        this.riGrid_beforeExecute();
    }

    public getCurrentPage(curPage: any): void {
        this.currentPage = curPage.value;
        this.riGrid_beforeExecute();
    }

    public dblClickGridRow(data: any): void {
        let _text = data.cellData['text'];
        let _Value = data.rowData['Value'];
        let _selected_column = '';
        for (let key in data.rowData) {
            if (data.rowData.hasOwnProperty(key)) {
                if (_text === data.rowData[key]) {
                    _selected_column = key;
                }
            }
        }
        if (this.inputParams.parentMode === 'Contract') {
            if (this.DateType === 'Month') {
                this.AddElementNumber = 3;
            } else {
                this.AddElementNumber = 2;
            }
        } else {
            this.AddElementNumber = 0;
        }
        switch (_selected_column) {
            case 'PremiseNumber':
            case 'ProductCode':
                this.router.navigate([ContractManagementModuleRoutes.ICABSAPREMISEMAINTENANCE], { queryParams: { parentMode: 'StaticVisit' } });
                break;
            default:
                break;
        }
    }
    public onBackLinkClick(event: any): void {
        event.preventDefault();
        this.location.back();
    }
    public updateNumberOfRecord(): void {
        if (isNaN(this.GridPageSize)) {
            this.GridPageSize = '';
            return;
        }
        if (this.GridPageSize === '0' || this.GridPageSize.toString().indexOf('-') !== -1 || this.GridPageSize.toString().indexOf('.') !== -1) {
            this.itemsPerPage = 10;
            this.GridPageSize = 0;
        } else {
            this.itemsPerPage = this.GridPageSize;
        }
    }

    public formatDateMine(date: any): any {
        let d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;
        return [month, day, year].join('/');
    }
}
