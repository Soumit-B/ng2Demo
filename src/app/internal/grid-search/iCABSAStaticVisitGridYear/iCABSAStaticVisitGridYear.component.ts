import { MntConst } from './../../../../shared/services/riMaintenancehelper';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, Input, NgZone, forwardRef, Inject, Renderer, ErrorHandler, AfterViewChecked } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { Logger } from '@nsalaun/ng2-logger';
import { Title } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { LocalStorageService } from 'ng2-webstorage';
import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Location } from '@angular/common';
import { LocaleTranslationService } from './../../../../shared/services/translation.service';
import { PaginationComponent } from './../../../../shared/components/pagination/pagination';
import { GridComponent } from './../../../../shared/components/grid/grid';
import { ErrorService } from '../../../../shared/services/error.service';
import { HttpService } from '../../../../shared/services/http-service';
import { AjaxObservableConstant } from '../../../../shared/constants/ajax-observable.constant';
import { MessageService } from '../../../../shared/services/message.service';
import { ServiceConstants } from './../../../../shared/constants/service.constants';
import { RiExchange } from '../../../../shared/services/riExchange';
import { Utils } from '../../../../shared/services/utility';
import { SpeedScript } from '../../../../shared/services/speedscript';
import { SysCharConstants } from '../../../../shared/constants/syscharservice.constant';
import { ContractActionTypes } from './../../../actions/contract';
import { GlobalConstant } from '../../../../shared/constants/global.constant';
import { GridAdvancedComponent } from './../../../../shared/components/grid-advanced/grid-advanced';
import { InternalGridSearchSalesModuleRoutes } from '../../../base/PageRoutes';

@Component({
    templateUrl: 'iCABSAStaticVisitGridYear.html',
    providers: [ErrorService, MessageService]
})

export class StaticVisitGridYearComponent implements OnInit, OnDestroy, AfterViewInit, AfterViewChecked {
    @ViewChild('messageModal') public messageModal;
    @ViewChild('riGrid') riGrid: GridAdvancedComponent;
    @ViewChild('staticVisitGridYearPagination') staticVisitGridYearPagination: PaginationComponent;

    //Page Variables
    private xhrParams = {
        module: 'plan-visits',
        method: 'service-planning/maintenance',
        operation: 'Application/iCABSAStaticVisitGridYear'
    };

    //Ui Fields
    public uiDisplay = {
        pageHeader: 'Static Visits',
        showContract: true,
        showPremise: true,
        showProduct: true,
        showtdTotalUnits: true,
        showtdTotalWED: true,
        readOnly: {
            ContractNumber: false,
            ContractName: false,
            PremiseNumber: false,
            PremiseName: false,
            ProductCode: false,
            ProductDesc: false,
            TotalPremises: false,
            TotalUnits: false,
            tdTotalWED: false,
            TotalTime: false,
            TotalNettValue: false
        },
        legend: []
    };
    public ContractObject = { type: '', label: '' };
    public uiForm: FormGroup;

    public totalItems: number;
    public page: number = 1;

    public search: URLSearchParams = new URLSearchParams();
    public storeSubscription: Subscription;

    private ajaxSource = new BehaviorSubject<any>(0);
    private ajaxSource$;
    private ajaxSubscription: Subscription;
    private subRoute: Subscription;
    private subSysChar: Subscription;
    public translateSub: Subscription;
    private routeParams: any;

    //public itemsPerPage: number;
    public pageSize: number;
    public gridCurPage: number;
    public totalRecords: number = 0;
    public totalPageCount: number = 0;

    public isRequesting: boolean = false;
    public invalidParentMode: boolean = false;

    //speedscript
    public vEnableInstallsRemovals: boolean = false;
    public vEnableWED: boolean = false;

    //Dropdown
    public menuOptions = [];
    public years = [];

    //Grid
    public gridData: any;
    public gridTotalItems: number;
    public maxColumn: number = 35;
    public itemsPerPage: number = 500;
    public currentPage: number = 1;
    public selectedrowdata: any;
    public backLinkUrl: string = '';

    constructor(
        private ajaxconstant: AjaxObservableConstant,
        private route: ActivatedRoute,
        private router: Router,
        private serviceConstants: ServiceConstants,
        private translate: LocaleTranslationService,
        private fb: FormBuilder,
        private sysCharConstants: SysCharConstants,
        private utils: Utils,
        private logger: Logger,
        private httpService: HttpService,
        private messageService: MessageService,
        private zone: NgZone,
        private SpeedScript: SpeedScript,
        private riExchange: RiExchange,
        private store: Store<any>,
        private location: Location
    ) { }

    ngOnInit(): void {
        this.riGrid.FixedWidth = true;
        this.ajaxSource$ = this.ajaxSource.asObservable();
        this.riExchange.getStore('contract');

        this.ajaxSubscription = this.ajaxSource$.subscribe(event => {
            if (event !== 0) {
                this.zone.run(() => {
                    switch (event) {
                        case this.ajaxconstant.START:
                            this.isRequesting = true;
                            break;
                        case this.ajaxconstant.COMPLETE:
                            this.isRequesting = false;
                            break;
                    }
                });
            }
        });

        this.subRoute = this.route.queryParams.subscribe(
            (params: any) => {
                this.routeParams = params;
            }
        );
        this.utils.setTitle(this.uiDisplay.pageHeader);
        this.uiForm = this.fb.group({});
        this.initForm();

        this.translate.setUpTranslation();

        this.window_onload();
    }

    ngOnDestroy(): void {
        if (this.ajaxSource) { this.ajaxSource.unsubscribe(); }
        if (this.ajaxSubscription) { this.ajaxSubscription.unsubscribe(); }
        if (this.subSysChar) { this.subSysChar.unsubscribe(); }
        if (this.translateSub) { this.translateSub.unsubscribe(); }
        if (this.subRoute) { this.subRoute.unsubscribe(); }
        this.riExchange.killStore();
    }

    ngAfterViewInit(): void {
        if (this.invalidParentMode) {
            this.invalidParentMode = false;
            this.showAlert('Invalid parent mode!');
        }
    }

    public ngAfterViewChecked(): void {
        //this.setupTableColumn();
    }

    public controls = [
        { name: 'ContractNumber', type: MntConst.eTypeCode},
        { name: 'ContractName', type: MntConst.eTypeText},
        { name: 'PremiseNumber', type: MntConst.eTypeInteger},
        { name: 'PremiseName', type: MntConst.eTypeText},
        { name: 'ProductCode', type: MntConst.eTypeCode},
        { name: 'ProductDesc', type: MntConst.eTypeText},
        { name: 'TotalPremises', type: MntConst.eTypeInteger},
        { name: 'TotalUnits', type: MntConst.eTypeInteger},
        { name: 'tdTotalWED', type: MntConst.eTypeDecimal1},
        { name: 'TotalTime', type: MntConst.eTypeText},
        { name: 'TotalNettValue', type: MntConst.eTypeCurrency},
        { name: 'ViewTypeFilter'},
        { name: 'SelectedYear', type: MntConst.eTypeInteger}
    ];

    private initForm(): void {
        for (let i = 0; i < this.controls.length; i++) {
            this.riExchange.riInputElement.Add(this.uiForm, this.controls[i].name);
        }
    }

    private getSysCharDtetails(): any {
        //SysChar
        let sysCharList: number[] = [this.sysCharConstants.SystemCharEnableInstallsRemovals, this.sysCharConstants.SystemCharEnableWED];
        let sysCharIP = {
            module: this.xhrParams.module,
            operation: this.xhrParams.operation,
            action: 0,
            businessCode: this.utils.getBusinessCode(),
            countryCode: this.utils.getCountryCode(),
            SysCharList: sysCharList.toString()
        };
        this.subSysChar = this.SpeedScript.sysChar(sysCharIP).subscribe((data) => {
            let record = data.records;

            this.vEnableInstallsRemovals = record[0].Required; //Logical;
            this.vEnableWED = record[1].Required;

            this.uiDisplay.showtdTotalUnits = this.vEnableInstallsRemovals;
            this.uiDisplay.showtdTotalWED = this.vEnableWED;

            if (this.vEnableWED) {
                this.riExchange.riInputElement.Disable(this.uiForm, 'tdTotalWED');
            }

            this.BuildMenuOptions();
        });
    }

    private window_onload(): void {
        this.getSysCharDtetails();

        this.ContractObject.type = this.routeParams.currentContractType;
        this.ContractObject.label = this.utils.getCurrentContractLabel(this.ContractObject.type);
        //this.logger.log('Contract Type', this.ContractObject.type, this.ContractObject.label, this.riExchange.ParentMode(this.routeParams));

        //Disable Fields
        this.riExchange.riInputElement.Disable(this.uiForm, 'ContractNumber');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ContractName');
        this.riExchange.riInputElement.Disable(this.uiForm, 'PremiseNumber');
        this.riExchange.riInputElement.Disable(this.uiForm, 'PremiseName');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ProductCode');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ProductDesc');
        this.riExchange.riInputElement.Disable(this.uiForm, 'TotalPremises');
        this.riExchange.riInputElement.Disable(this.uiForm, 'TotalUnits');
        this.riExchange.riInputElement.Disable(this.uiForm, 'TotalTime');
        this.riExchange.riInputElement.Disable(this.uiForm, 'TotalNettValue');

        this.BuildYearOptions();
        this.riExchange.riInputElement.SetValue(this.uiForm, 'SelectedYear', this.years[this.years.length - 11]);

        let ParentMode = this.riExchange.ParentMode(this.routeParams);
        switch (ParentMode) {
            case 'Contract':
                this.uiDisplay.showContract = true;
                this.uiDisplay.showPremise = false;
                this.uiDisplay.showProduct = false;
                this.riExchange.renderParentFields(this.routeParams, this.uiForm, 'ContractNumber');
                this.riExchange.renderParentFields(this.routeParams, this.uiForm, 'ContractName');

                let ContractRowID = this.riExchange.GetParentRowID(this.routeParams, 'Contract');
                if (ContractRowID === '') {
                    ContractRowID = this.riExchange.GetParentRowID(this.routeParams, 'ContractRowID');
                }
                this.search.set('RowID', ContractRowID);
                this.search.set('Level', 'Contract');
                break;

            case 'Premise':
                this.uiDisplay.showContract = true;
                this.uiDisplay.showPremise = true;
                this.uiDisplay.showProduct = false;
                this.riExchange.renderParentFields(this.routeParams, this.uiForm, 'ContractNumber');
                this.riExchange.renderParentFields(this.routeParams, this.uiForm, 'ContractName');
                this.riExchange.renderParentFields(this.routeParams, this.uiForm, 'PremiseNumber');
                this.riExchange.renderParentFields(this.routeParams, this.uiForm, 'PremiseName');

                let PremiseRowID = this.riExchange.GetParentRowID(this.routeParams, 'Premise');
                if (PremiseRowID === '') {
                    PremiseRowID = this.riExchange.GetParentRowID(this.routeParams, 'PremiseRowID');
                }
                this.search.set('RowID', PremiseRowID);
                this.search.set('Level', 'Premise');
                break;

            case 'ServiceCover':
                this.uiDisplay.showContract = true;
                this.uiDisplay.showPremise = true;
                this.uiDisplay.showProduct = true;
                this.riExchange.renderParentFields(this.routeParams, this.uiForm, 'ContractNumber');
                this.riExchange.renderParentFields(this.routeParams, this.uiForm, 'ContractName');
                this.riExchange.renderParentFields(this.routeParams, this.uiForm, 'PremiseNumber');
                this.riExchange.renderParentFields(this.routeParams, this.uiForm, 'PremiseName');
                this.riExchange.renderParentFields(this.routeParams, this.uiForm, 'ProductCode');
                this.riExchange.renderParentFields(this.routeParams, this.uiForm, 'ProductDesc');

                let ServiceCoverRowID = this.riExchange.GetParentRowID(this.routeParams, 'ServiceCover');
                if (ServiceCoverRowID === '') {
                    ServiceCoverRowID = this.riExchange.GetParentRowID(this.routeParams, 'ServiceCoverRowID');
                }
                this.search.set('RowID', ServiceCoverRowID);
                this.search.set('Level', 'ServiceCover');
                break;
            default:
                this.invalidParentMode = true;
        }

        if (ParentMode !== 'ServiceCover') {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ViewTypeFilter', 'Premise');
        } else {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ViewTypeFilter', 'Visit');
        }

        this.riGrid.HidePageNumber = true;
        this.riGrid.ResetGrid();
        this.buildGrid();
    }


    public BuildMenuOptions(): void { // Unit, Premise, Visit, WED, Time, Value
        let ParentMode = this.riExchange.ParentMode(this.routeParams);
        if (this.vEnableInstallsRemovals) {
            this.menuOptions.push({ value: 'Unit', label: 'Number Of Units' });
        }
        if (ParentMode !== 'ServiceCover') {
            this.menuOptions.push({ value: 'Premise', label: 'Number Of Premises' });
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ViewTypeFilter', 'Premise');
            this.menuOptions.push({ value: 'Visit', label: 'Number Of Visits' });
        } else {
            this.menuOptions.push({ value: 'Visit', label: 'Number Of Visits' });
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ViewTypeFilter', 'Visit');
        }
        if (this.vEnableWED) {
            this.menuOptions.push({ value: 'WED', label: 'W.E.D.' });
        }
        this.menuOptions.push({ value: 'Time', label: 'Time' });
        this.menuOptions.push({ value: 'Value', label: 'Nett Value' });
    }

    public onChangeEvent(e: any): void {
        let mode = e.target.id;
        let selectedVal = e.target.value;
        // switch (mode) {
        //     case 'SelectedYear':
        //     case 'ViewTypeFilter':
        this.riGrid.ResetGrid();
        this.buildGrid();
        //         break;
        // }
    }

    public onSubmit(): void {
        //No functionality required
    }

    public BuildYearOptions(): void {
        let start = (new Date()).getFullYear() - 10;
        for (let i = 0; i <= 20; i++) {
            this.years.push(start + i);
        }
    }

    public modalConfig: any = {
        backdrop: 'static',
        keyboard: true
    };
    public showAlert(msgTxt: string, type?: number): void {
        let translation = this.translate.getTranslatedValue(msgTxt, null).toPromise();
        let titleModal = '';
        if (typeof type === 'undefined') type = 0;
        switch (type) {
            default:
            case 0: titleModal = 'Error Message'; break;
            case 1: titleModal = 'Success Message'; break;
            case 2: titleModal = 'Warning Message'; break;
        }

        translation.then((resp) => {
            try { this.messageModal.show({ msg: resp, title: titleModal }, false); }
            catch (e) { //console.log('Error', e);
            }
        });
    }

    public getCurrentPage(data: any): void {
        this.gridCurPage = data.value;
        this.riGrid_beforeExecute();
    }

    public updateGridTitle(): any {
        let objList = document.querySelectorAll('.gridtable thead > tr:first-child > th span');
        if (objList) {
            for (let i = 0; i < objList.length; i++) {
                if (objList[i]) {
                    let txt = objList[i].innerHTML;
                    if (i > 0) {
                        objList[i].innerHTML = '';
                    }
                }
            }
        }
    }

    public buildGrid(): any {

        let iLoop = 1;
        this.riGrid.Clear();

        this.riGrid.AddColumn('Month', 'StaticVisit', 'Month', MntConst.eTypeText, 20);

        for (iLoop = 1; iLoop <= 31; iLoop++) {
            this.riGrid.AddColumn(iLoop.toString(), 'StaticVisit', iLoop.toString(), MntConst.eTypeText, 4);

            switch (this.riExchange.riInputElement.GetValue(this.uiForm, 'ViewTypeFilter')) {
                case 'Time':
                case 'Value':
                    this.riGrid.AddColumnAlign(iLoop.toString(), MntConst.eAlignmentRight);
                    break;
                default:
                    this.riGrid.AddColumnAlign(iLoop.toString(), MntConst.eAlignmentCenter);
            }
        }

        //'#35225 Do not display the Total Column if the filter is 'Time' or 'Value'
        if (!(this.riExchange.riInputElement.GetValue(this.uiForm, 'ViewTypeFilter') === 'Time' || this.riExchange.riInputElement.GetValue(this.uiForm, 'ViewTypeFilter') === 'Value')) {
            this.riGrid.AddColumn('Total', 'StaticVisit', 'Total', MntConst.eTypeText, 20);
            this.riGrid.AddColumnAlign('Total', MntConst.eAlignmentRight);
        }

        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'ViewTypeFilter') === 'Unit') {
            this.riGrid.AddColumn('TotalYTD', 'StaticVisit', 'TotalYTD', MntConst.eTypeText, 10);
            this.riGrid.AddColumnAlign('TotalYTD', MntConst.eAlignmentRight);
        }

        //'#35225 Add 2 new columns for Time and Value
        this.riGrid.AddColumn('TotalMonthTimeValue', 'StaticVisit', 'TotalMonthNettValue', MntConst.eTypeText, 10);
        this.riGrid.AddColumnAlign('TotalMonthTimeValue', MntConst.eAlignmentRight);
        this.riGrid.AddColumn('TotalMonthNettValue', 'StaticVisit', 'TotalMonthNettValue', MntConst.eTypeCurrency, 10);
        this.riGrid.AddColumnAlign('TotalMonthNettValue', MntConst.eAlignmentRight);

        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'ViewTypeFilter') === 'Value') {
            this.riGrid.AddColumn('TotalYTDNetValue', 'StaticVisit', 'TotalYTDNetValue', MntConst.eTypeCurrency, 10);
            this.riGrid.AddColumnAlign('TotalYTDNetValue', MntConst.eAlignmentRight);
        }

        this.riGrid.Complete();
        this.riGrid_beforeExecute();
    }


    public riGrid_beforeExecute(): void {
        let gridHandle = (Math.floor(Math.random() * 900000) + 100000).toString();
        //let gridQueryParams: URLSearchParams = new URLSearchParams();

        let strGridData = true;
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.search.set(this.serviceConstants.Action, '2');
        this.search.set('riCacheRefresh', 'True');
        this.search.set('riGridMode', '0');
        this.search.set('riGridHandle', gridHandle);
        this.search.set('year', this.riExchange.riInputElement.GetValue(this.uiForm, 'SelectedYear'));
        let filterType = this.riExchange.riInputElement.GetValue(this.uiForm, 'ViewTypeFilter');
        this.search.set('ViewTypeFilter', filterType);

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.xhrParams.method, this.xhrParams.module, this.xhrParams.operation, this.search).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data) {
                    if (data && data.errorMessage) {
                        this.messageModal.show(data, true);
                    } else {
                        this.riGrid.UpdateBody = true;
                        this.riGrid.UpdateFooter = true;
                        this.riGrid.UpdateHeader = true;
                        this.riGrid.Execute(data);
                    }
                }
            },
            (error) => {
                this.logger.log('Error', error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });

    }

    public riGrid_AfterExecute(): any {
        let iLoop;
        let oTR, oTD;
        let iBeforeCurrentMonth;
        let iAfterCurrentMonth;

        for (iLoop = 1; iLoop <= 31; iLoop++) {
            //this.riGrid.HTMLGridBody.children[0].children[iLoop].setAttribute('width', '20');
        }

        let obj = this.riGrid.HTMLGridBody.children[0].children[0].getAttribute('additionalproperty');
        if (obj) {
            setTimeout(() => {
                this.uiDisplay.legend = [];
                let legend = obj.split('bgcolor=');
                for (let i = 0; i < legend.length; i++) {
                    let str = legend[i];
                    if (str.indexOf('"#') >= 0) {
                        this.uiDisplay.legend.push({
                            color: str.substr(str.indexOf('"#') + 1, 7),
                            label: str.substr(str.indexOf('<td>') + 4, str.substr(str.indexOf('<td>') + 4).indexOf('&'))
                        });
                    }
                }
            }, 100);
        }

        //this.riGrid.SetDefaultFocus();
        let currentMonth = new Date().getMonth();
        iBeforeCurrentMonth = new Date().getMonth();
        iAfterCurrentMonth = new Date().getMonth() + 1;

        //'SH 18/01/2005 - QRSAUS1620 Bug:  If in January, cannot create marker line for previous month.
        let objList = document.querySelectorAll('.gridtable tbody > tr');
        if (objList && objList.length >= currentMonth) {
            let tr = objList[currentMonth];
            if (tr) {
                tr.setAttribute('class', 'currentMonth');
            }
        }

        //'Set Total value fields

        let TotalString;
        TotalString = this.riGrid.HTMLGridBody.children[1].children[0].getAttribute('additionalproperty').split('|');

        this.riExchange.riInputElement.SetValue(this.uiForm, 'TotalPremises', TotalString[0]);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'TotalUnits', TotalString[1]);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'TotalTime', TotalString[2]);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'TotalNettValue', (TotalString[3]) ? this.utils.cCur(TotalString[3]) : '');
        if (this.vEnableWED) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'tdTotalWED', TotalString[4]);
        }
    }

    public riGrid_BodyOnDblClick(ev: any): any {
        let currentRowIndex = this.riGrid.CurrentRow;
        let currentCellIndex = this.riGrid.CurrentCell;
        let cellData = this.riGrid.bodyArray[currentRowIndex][currentCellIndex];
        //console.log('--riGrid_BodyOnDblClick-', cellData, ev);
        let ParentMode = this.riExchange.ParentMode(this.routeParams);
        if (ParentMode !== 'ServiceCover') {
            let date = (currentCellIndex > 0 && currentCellIndex < 32) ? currentCellIndex : 1;
            let month = cellData.rowID.split(' ')[0];
            let year = cellData.rowID.split(' ')[1];
            let mode = (cellData.additionalData === 'Day' || cellData.additionalData === 'Month') ? cellData.additionalData : '';
            let payload = {};
            let ContractRowID = this.riExchange.GetParentRowID(this.routeParams, 'Contract');
            if (ContractRowID === '') {
                ContractRowID = this.riExchange.GetParentRowID(this.routeParams, 'ContractRowID');
            }
            let dateNum = this.utils.numberPadding(date, 2);
            let monthNum = this.utils.numberPadding(currentRowIndex + 1, 2);
            let rowId: string = '';
            if (ParentMode === 'Premise') {
                rowId = this.riExchange.GetParentRowID(this.routeParams, 'PremiseRowID');
            } else {
                rowId = ContractRowID;
            }
            switch (mode) {
                case 'Day':
                    payload = {
                        ContractNumber: this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'),
                        ContractName: this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractName'),
                        PremiseNumber: this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber'),
                        PremiseName: this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseName'),
                        DateType: mode,
                        SelectedDate: monthNum + '/' + dateNum + '/' + this.uiForm.controls['SelectedYear'].value, //mm/dd/yyyy
                        RowID: ContractRowID,
                        PremiseRowID: this.riExchange.GetParentRowID(this.routeParams, 'PremiseRowID'),
                        ServiceRowID: this.riExchange.GetParentRowID(this.routeParams, 'ServiceCoverRowID')
                    };
                    this.riExchange.setStore(ContractActionTypes.SAVE_MODE, payload, false);
                    this.router.navigate([InternalGridSearchSalesModuleRoutes.ICABSASTATICVISITGRIDDAY], {
                        queryParams: {
                            parentMode: ParentMode,
                            rowId: rowId,
                            year: year,
                            currentContractType: this.ContractObject.type,
                            ContractNumber: this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'),
                            ContractName: this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractName'),
                            PremiseNumber: this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber'),
                            PremiseName: this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseName')
                        }
                    });
                    break;
                case 'Month':
                    payload = {
                        ContractNumber: this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'),
                        ContractName: this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractName'),
                        PremiseNumber: this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber'),
                        PremiseName: this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseName'),
                        DateType: mode,
                        SelectedDate: monthNum + '/' + dateNum + '/' + year, //mm/dd/yyyy
                        SelectedMonth: month,
                        SelectedYear: year,
                        RowID: ContractRowID,
                        PremiseRowID: this.riExchange.GetParentRowID(this.routeParams, 'PremiseRowID'),
                        ServiceRowID: this.riExchange.GetParentRowID(this.routeParams, 'ServiceCoverRowID')
                    };
                    this.riExchange.setStore(ContractActionTypes.SAVE_MODE, payload, false);
                    this.router.navigate([InternalGridSearchSalesModuleRoutes.ICABSASTATICVISITGRIDDAY], {
                        queryParams: {
                            parentMode: ParentMode,
                            rowId: rowId,
                            year: year,
                            currentContractType: this.ContractObject.type,
                            ContractNumber: this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'),
                            ContractName: this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractName'),
                            PremiseNumber: this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber'),
                            PremiseName: this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseName')
                        }
                    });
                    break;
                default:
                    this.showAlert('No data to show!');
            }
        }
    }

}
