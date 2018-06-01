import { Subscription } from 'rxjs/Subscription';
import { URLSearchParams } from '@angular/http';
import { PageIdentifier } from './../../base/PageIdentifier';
import { Component, OnInit, Injector, ViewChild, OnDestroy } from '@angular/core';
import { GridComponent } from './../../../shared/components/grid/grid';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';
import { BaseComponent } from '../../../app/base/BaseComponent';

@Component({
    templateUrl: 'iCABSSeActualVsContractualServiceCover.html'
})
export class ActualVsContractualServiceCoverComponent extends BaseComponent implements OnInit, OnDestroy {

    @ViewChild('actVsContServiceCoverGrid') actVsContServiceCoverGrid: GridComponent;
    @ViewChild('actVsContServiceCoverPagination') actVsContServiceCoverPagination: PaginationComponent;

    public queryParams: any = {
        operation: 'ApplicationReport/iCABSSeActualVsContractualServiceCover',
        module: 'charges',
        method: 'bill-to-cash/grid'
    };
    public pageId: string = '';
    public itemsPerPage: number = 14;
    public currentPage: number = 1;
    public totalItems: number = 10;
    public maxColumn: number = 11;
    public search = new URLSearchParams();
    private lookUpSubscription: Subscription;

    public controls = [
        { name: 'BusinessCode', readonly: true, disabled: false, required: false },
        { name: 'BusinessDesc', readonly: true, disabled: false, required: false },
        { name: 'ContractNumber', readonly: false, disabled: false, required: false },
        { name: 'ContractName', readonly: false, disabled: false, required: false },
        { name: 'PremiseNumber', readonly: false, disabled: false, required: false },
        { name: 'PremiseName', readonly: false, disabled: false, required: false },
        { name: 'ViewBy', readonly: false, disabled: false, required: false, value: 'branch' },
        { name: 'ServiceFilter', readonly: false, disabled: false, required: false, value: 'all' },
        { name: 'PercTolerance', readonly: true, disabled: false, required: false },
        { name: 'FromDate', readonly: true, disabled: false, required: false },
        { name: 'ToDate', readonly: false, disabled: false, required: false },
        { name: 'WasteTransferTypeCode', readonly: false, disabled: false, required: false },
        { name: 'WasteTransferTypeDesc', readonly: false, disabled: false, required: false },
        { name: 'EWCCode', readonly: false, disabled: false, required: false },
        { name: 'EWCDescription', readonly: false, disabled: false, required: false }
    ];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSEACTUALVSCONTRACTUALSERVICECOVER;
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.pageTitle = 'Actual vs Contractual - Service Cover';
        if (this.formData.BusinessDesc) {
            this.populateUIFromFormData();
            this.buildGrid();
        } else {
            this.window_onload();
        }
    }

    ngOnDestroy(): void {
        this.lookUpSubscription.unsubscribe();
        super.ngOnDestroy();
    }

    private window_onload(): void {
        //this.showBackLabel = true;
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumber', this.riExchange.getParentHTMLValue('ContractNumber'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseNumber', this.riExchange.getParentHTMLValue('PremiseNumber'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'PercTolerance', this.riExchange.getParentHTMLValue('PercTolerance'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'FromDate', this.riExchange.getParentHTMLValue('FromDate'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ToDate', this.riExchange.getParentHTMLValue('ToDate'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'WasteTransferTypeCode', this.riExchange.getParentHTMLValue('WasteTransferTypeCode'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'EWCCode', this.riExchange.getParentHTMLValue('EWCCode'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceFilter', this.riExchange.getParentHTMLValue('ServiceFilter'));
        this.riExchange.riInputElement.Disable(this.uiForm, 'ServiceFilter');
        this.doLookupformData();
        this.ServiceFilter_onChange({});
        this.buildGrid();
    }

    public doLookupformData(): void {
        let lookupIP = [
            {
                'table': 'Premise',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'ContractNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'),
                    'PremiseNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber')
                },
                'fields': ['PremiseName']
            },
            {
                'table': 'Contract',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'ContractNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber')
                },
                'fields': ['ContractName']
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
            let Premise = data[0][0];
            if (Premise) {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', Premise.PremiseName);
            }
            let Contract = data[1][0];
            if (Contract) {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractName', Contract.ContractName);
            }
            let WasteTransferType = data[2][0];
            if (WasteTransferType) {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'WasteTransferTypeDesc', WasteTransferType.WasteTransferTypeDesc);
            }
            let EWCCode = data[3][0];
            if (EWCCode) {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'EWCDescription', EWCCode.EWCDescription);
            }
        });
    }

    private ServiceFilter_onChange(event: any): void {
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceFilter') === 'over') {
            this.pageParams.vPercTolerance = false;
        } else {
            this.pageParams.vPercTolerance = true;
        }
    }

    private buildGrid(): void {

        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.Action, '2');
        this.search.set(this.serviceConstants.BusinessCode, this.businessCode());
        this.search.set(this.serviceConstants.CountryCode, this.countryCode());
        //set parameters
        this.search.set('Level', 'ServiceCover');
        this.search.set('ContractNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'));
        this.search.set('PremiseNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber'));
        this.search.set('ViewBy', 'ServiceCover');
        this.search.set('ServiceFilter', this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceFilter'));
        this.search.set('PercTolerance', this.riExchange.riInputElement.GetValue(this.uiForm, 'PercTolerance'));
        this.search.set('FromDate', this.riExchange.riInputElement.GetValue(this.uiForm, 'FromDate'));
        this.search.set('ToDate', this.riExchange.riInputElement.GetValue(this.uiForm, 'ToDate'));
        this.search.set('EWCCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'EWCCode'));
        this.search.set('WasteTransCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'WasteTransCode'));

        // set grid building parameters
        this.search.set('riCacheRefresh', 'true');
        this.search.set(this.serviceConstants.PageSize, this.itemsPerPage.toString());
        this.search.set(this.serviceConstants.PageCurrent, this.currentPage.toString());
        this.search.set(this.serviceConstants.GridMode, '0');
        this.search.set(this.serviceConstants.GridHandle, '656396');
        this.queryParams.search = this.search;
        this.actVsContServiceCoverGrid.loadGridData(this.queryParams);
    }

    private onGridRowClick(event: any): void {
        if (event.cellIndex === 0 && event.rowData['Product Code'] !== 'TOTAL') {
            this.attributes.ServiceCoverRowID = event.cellData['rowID'];
            this.pageParams.currentContractType = event.cellData['additionalData'];
            //this.navigate('PortfolioReports', 'Application/iCABSAServiceCoverMaintenance.htm');
            //TODO
            alert('Navigate to iCABSAServiceCoverMaintenance when available');
        }
    }

    public getGridInfo(info: any): void {
        this.actVsContServiceCoverPagination.totalItems = info.totalRows;
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
