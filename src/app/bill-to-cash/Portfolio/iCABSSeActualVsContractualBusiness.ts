import * as moment from 'moment';
import { Subscription } from 'rxjs/Subscription';
import { URLSearchParams } from '@angular/http';
import { PageIdentifier } from './../../base/PageIdentifier';
import { Component, OnInit, Injector, ViewChild, OnDestroy } from '@angular/core';
import { GridComponent } from './../../../shared/components/grid/grid';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';
import { BaseComponent } from '../../../app/base/BaseComponent';

@Component({
    templateUrl: 'iCABSSeActualVsContractualBusiness.html'
})

export class ActualVsContractualBusinessComponent extends BaseComponent implements OnInit, OnDestroy {

    @ViewChild('actualVsContractualBusinessGrid') actualVsContractualBusinessGrid: GridComponent;
    @ViewChild('actualVsContractualBusinessPagination') actualVsContractualBusinessPagination: PaginationComponent;

    public queryParams: any = {
        operation: 'ApplicationReport/iCABSSeActualVsContractualBusiness',
        module: 'charges',
        method: 'bill-to-cash/grid'
    };
    public pageId: string = '';
    public itemsPerPage: number = 15;
    public currentPage: number = 1;
    public totalItems: number = 10;
    public maxColumn: number = 8;
    public search = new URLSearchParams();
    public DateTo: Date = new Date();
    public DateFrom: Date = new Date();
    public lookUpSubscription: Subscription;
    public WasteTransferComponent;
    public EWCDComponent;
    public showErrorHeader: boolean = false;
    public showMessageHeader: boolean = false;

    public controls = [
        { name: 'BusinessCode', readonly: true, disabled: false, required: false },
        { name: 'BusinessDesc', readonly: true, disabled: false, required: false },
        { name: 'BranchNumber', readonly: false, disabled: false, required: false },
        { name: 'ViewBy', readonly: false, disabled: false, required: false, value: 'branch' },
        { name: 'ServiceFilter', readonly: false, disabled: false, required: false, value: 'all' },
        { name: 'PercTolerance', readonly: true, disabled: false, required: false },
        { name: 'FromDate', readonly: true, disabled: false, required: false },
        { name: 'ToDate', readonly: false, disabled: false, required: false },
        { name: 'WasteTransferTypeCode', readonly: false, disabled: false, required: false },
        { name: 'WasteTransferTypeDesc', readonly: false, disabled: false, required: false },
        { name: 'EWCCode', readonly: false, disabled: false, required: false },
        { name: 'EWCDescription', readonly: false, disabled: false, required: false },
        { name: 'GroupCode', readonly: false, disabled: false, required: false }
    ];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSEACTUALVSCONTRACTUALBUSINESS;
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.pageTitle = 'Actual vs Contractual - Business';
        if (this.formData.BusinessDesc) {
            this.populateUIFromFormData();
            this.handleSavedDate();
            this.buildGrid();
        } else {
            this.window_onload();
        }
    }

    ngOnDestroy(): void {
        if (this.lookUpSubscription) {
            this.lookUpSubscription.unsubscribe();
        }
        super.ngOnDestroy();
    }

    public window_onload(): void {
        this.getSysCharDtetails();
        this.getFromAndToDates();
        this.doLookupformData();

        this.ServiceFilter_onChange({});
    }

    public handleSavedDate(): void {
        //To Date
        let toDate = this.formData.ToDate;
        if (moment(this.formData.ToDate, 'DD/MM/YYYY', true).isValid()) {
            toDate = this.utils.convertDate(this.formData.ToDate);
        } else {
            toDate = this.utils.formatDate(this.formData.ToDate);
        }
        this.DateTo = new Date(toDate);

        //From Date
        let fromdate = this.formData.FromDate;
        if (moment(this.formData.FromDate, 'DD/MM/YYYY', true).isValid()) {
            fromdate = this.utils.convertDate(this.formData.FromDate);
        } else {
            fromdate = this.utils.formatDate(this.formData.FromDate);
        }
        this.DateFrom = new Date(fromdate);
    }

    public getSysCharDtetails(): any {
        //SysChar
        let sysCharList: number[] = [
            this.sysCharConstants.SystemCharShowPremiseWasteTab];
        let sysCharIP = {
            module: this.queryParams.module,
            operation: this.queryParams.operation,
            action: 0,
            businessCode: this.businessCode(),
            countryCode: this.countryCode(),
            SysCharList: sysCharList.toString()
        };
        this.speedScript.sysChar(sysCharIP).subscribe((data) => {
            let record = data.records;
            this.pageParams.vWasteFilterDisp = !(record[0]['Required']);
        });

    }
    public getFromAndToDates(): void {
        let query = this.getURLSearchParamObject();
        query.set(this.serviceConstants.Action, '6');
        query.set('Function', 'GetQuarterDates');
        this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module,
            this.queryParams.operation, query)
            .subscribe(
            (data) => {
                if (data.status === 'failure') {
                    this.errorService.emitError(data.oResponse);
                } else {
                    let toDate = data.ToDate;
                    let fromdate = data.FromDate;

                    //To Date
                    if (moment(data.ToDate, 'DD/MM/YYYY', true).isValid()) {
                        toDate = this.utils.convertDate(data.ToDate);
                    } else {
                        toDate = this.utils.formatDate(data.ToDate);
                    }
                    this.DateTo = new Date(toDate);

                    //From Date
                    if (moment(data.FromDate, 'DD/MM/YYYY', true).isValid()) {
                        fromdate = this.utils.convertDate(data.FromDate);
                    } else {
                        fromdate = this.utils.formatDate(data.FromDate);
                    }
                    this.DateFrom = new Date(fromdate);

                    this.riExchange.riInputElement.SetValue(this.uiForm, 'FromDate', data.FromDate);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'ToDate', data.ToDate);
                }
                this.riExchange.riInputElement.SetValue(this.uiForm, 'PercTolerance', 0);
            },
            (error) => {
                this.errorService.emitError('Record not found');
            }
            );
    }

    public dateFromSelectedValue(value: any): void {
        if (value && value.value) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'FromDate', value.value);
        }
    }

    public dateToSelectedValue(value: any): void {
        if (value && value.value) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ToDate', value.value);
        }
    }

    public doLookupformData(): void {
        let lookupIP = [
            {
                'table': 'Business',
                'query': {
                    'BusinessCode': this.businessCode()
                },
                'fields': ['BusinessDesc']
            },
            {
                'table': 'WasteTransferType',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'WasteTransferTypeCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'WasteTransferTypeCode')
                },
                'fields': ['WasteTransferTypeDesc']
            },
            {
                'table': 'EWCCode',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'EWCCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'EWCCode')
                },
                'fields': ['EWCDescription']
            }
        ];

        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe((data) => {
            let Business = data[0][0];
            if (Business) {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'BusinessDesc', Business.BusinessDesc);
            }
            let WasteTransferType = data[1][0];
            if (WasteTransferType) {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'WasteTransferTypeDesc', WasteTransferType.WasteTransferTypeDesc);
            }
            let EWCCode = data[2][0];
            if (EWCCode) {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'EWCDescription', EWCCode.EWCDescription);
            }
        });
    }

    public ServiceFilter_onChange(event: any): void {
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceFilter') === 'over') {
            this.pageParams.vPercTolerance = false;
        } else {
            this.pageParams.vPercTolerance = true;
        }
    }

    public buildGrid(): void {

        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.Action, '2');
        this.search.set(this.serviceConstants.BusinessCode, this.businessCode());
        this.search.set(this.serviceConstants.CountryCode, this.countryCode());
        //set parameters
        this.search.set('Level', 'Business');
        this.search.set('ViewBy', this.riExchange.riInputElement.GetValue(this.uiForm, 'ViewBy'));
        this.search.set('ServiceFilter', this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceFilter'));
        this.search.set('PercTolerance', this.riExchange.riInputElement.GetValue(this.uiForm, 'PercTolerance'));
        this.search.set('FromDate', this.riExchange.riInputElement.GetValue(this.uiForm, 'FromDate'));
        this.search.set('ToDate', this.riExchange.riInputElement.GetValue(this.uiForm, 'ToDate'));
        this.search.set('riCacheRefresh', 'true');
        this.search.set('EWCCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'EWCCode'));
        this.search.set('WasteTransCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'WasteTransCode'));

        // set grid building parameters
        this.search.set(this.serviceConstants.PageSize, (this.itemsPerPage - 1).toString());
        this.search.set(this.serviceConstants.PageCurrent, this.currentPage.toString());
        this.search.set(this.serviceConstants.GridMode, '0');
        this.search.set(this.serviceConstants.GridHandle, '656396');
        this.queryParams.search = this.search;
        this.actualVsContractualBusinessGrid.loadGridData(this.queryParams);
    }

    public onGridRowClick(event: any): void {
        if (event.cellIndex === 0 && event.rowData['Branch'] && event.rowData['Branch'] !== 'TOTAL') {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'GroupCode', event.rowData['Branch']);
            this.navigate('business', 'billtocash/actualvscontractualbranch');
        }

        if (event.cellIndex === 0 && event.rowData['Region'] && event.rowData['Region'] !== 'TOTAL') {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'GroupCode', event.rowData['Region']);
            //this.navigate('business', 'billtocash/actualvscontractualbranch');
            alert('Navigate to iCABSSeActualVsContractualRegion');
        }
    }

    public getGridInfo(info: any): void {
        this.actualVsContractualBusinessPagination.totalItems = info.totalRows;
    }

    public getCurrentPage(currentPage: any): void {
        this.currentPage = currentPage.value;
        this.search.set(this.serviceConstants.PageCurrent, String(this.currentPage));
        this.buildGrid();
    }

    public refresh(): void {
        this.currentPage = 1;
        this.buildGrid();
    }
}
