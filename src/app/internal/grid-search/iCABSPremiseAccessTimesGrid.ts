import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { Subscription } from 'rxjs/Subscription';
import { URLSearchParams } from '@angular/http';
import { PageIdentifier } from './../../base/PageIdentifier';
import { Component, OnInit, Injector, ViewChild, OnDestroy } from '@angular/core';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';
import { GridComponent } from './../../../shared/components/grid/grid';
import { BaseComponent } from '../../../app/base/BaseComponent';

@Component({
    templateUrl: 'iCABSPremiseAccessTimesGrid.html'
})

export class PremiseAccessTimesGridComponent extends BaseComponent implements OnInit, OnDestroy {

    @ViewChild('PremiseAccessTimesGrid') PremiseAccessTimesGrid: GridComponent;
    @ViewChild('PremiseAccessTimesPagination') PremiseAccessTimesPagination: PaginationComponent;

    public queryParams: any = {
        operation: 'Application/iCABSPremiseAccessTimesGrid',
        module: 'template',
        method: 'service-planning/maintenance'
    };

    public controls = [
        { name: 'ContractNumber', readonly: true, disabled: false, required: false },
        { name: 'ContractName', readonly: true, disabled: false, required: false },
        { name: 'PremiseNumber', readonly: true, disabled: false, required: false },
        { name: 'PremiseName', readonly: true, disabled: false, required: false },
        { name: 'ContractRowID' },
        { name: 'PremiseRowID' },
        { name: 'ServiceCoverRowID' },
        { name: 'ServiceCoverNumber' },
        { name: 'RowID' }
    ];

    //local variables
    public pageId: string = '';
    public parentMode: any;

    //CurrentContractTypeURLParameter
    public routeParams: any = {};
    private currentContractType: string;
    private currentContractTypeLabel: string;
    private currentContractTypeURLParameter: string;

    // Grid Component Variables
    public search: URLSearchParams = new URLSearchParams();
    public pageSize: number = 13;
    public itemsPerPage: number = 10;
    public currentPage: number = 1;
    public totalItems: number = 10;
    public maxColumn: number = 15;
    private selectedRow: any = -1;
    public riGrid: any = {};
    public gridSortHeaders: Array<any>;
    public headerProperties: Array<any> = [];
    public validateProperties: Array<any> = [];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSPREMISEACCESSTIMESGRID;
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.pageTitle = 'Contract History';
        this.riExchange.setCurrentContractType();
        this.window_onload();
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    private setGridHeaders(): void {
        this.validateProperties = [
            {
                'type': MntConst.eTypeText,
                'index': 0
            },
            {
                'type': MntConst.eTypeText,
                'index': 1
            },
            {
                'type': MntConst.eTypeText,
                'index': 2
            },
            {
                'type': MntConst.eTypeText,
                'index': 3
            },
            {
                'type': MntConst.eTypeText,
                'index': 4
            },
            {
                'type': MntConst.eTypeText,
                'index': 5
            },
            {
                'type': MntConst.eTypeText,
                'index': 1
            },
            {
                'type': MntConst.eTypeText,
                'index': 6
            },
            {
                'type': MntConst.eTypeText,
                'index': 7
            },
            {
                'type': MntConst.eTypeText,
                'index': 8
            },
            {
                'type': MntConst.eTypeText,
                'index': 9
            },
            {
                'type': MntConst.eTypeText,
                'index': 10
            },
            {
                'type': MntConst.eTypeText,
                'index': 11
            },
            {
                'type': MntConst.eTypeText,
                'index': 12
            },
            {
                'type': MntConst.eTypeText,
                'index': 13
            },
            {
                'type': MntConst.eTypeText,
                'index': 14
            }

        ];
    }

    public window_onload(): void {

        this.currentContractType = this.riExchange.getCurrentContractType();
        this.currentContractTypeLabel = this.riExchange.getCurrentContractTypeLabel();

        //Parent values
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumber', this.riExchange.getParentHTMLValue('ContractNumber'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractName', this.riExchange.getParentHTMLValue('ContractName'));

        this.parentMode = this.riExchange.getParentMode();

        switch (this.parentMode) {
            case 'Premise':
                this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseRowID', this.riExchange.GetParentRowID(this.uiForm, 'Premise'));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseNumber', this.riExchange.getParentHTMLValue('PremiseNumber'));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', this.riExchange.getParentHTMLValue('PremiseName'));
                break;
            default:
                break;
        }
        this.headerProperties = [
            {
                'align': 'center',
                'width': '120px',
                'index': 0
            }
        ];
        this.buildGrid();
        this.buildFields();
        this.riGrid.Update = false;
    }

    public buildGrid(): void {

        this.setGridHeaders();
        this.PremiseAccessTimesGrid.clearGridData();

        this.search.set(this.serviceConstants.Action, '2');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());

        //set parameters
        this.search.set('ContractNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'));
        this.search.set('PremiseNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber'));

        // set grid building parameters
        this.search.set('Level', 'Premise');
        this.search.set(this.serviceConstants.PageSize, this.itemsPerPage.toString());
        this.search.set(this.serviceConstants.PageCurrent, this.currentPage.toString());
        this.search.set(this.serviceConstants.GridMode, '0');
        this.search.set(this.serviceConstants.GridHandle, (Math.floor(Math.random() * 900000) + 100000).toString());
        this.queryParams.search = this.search;
        this.PremiseAccessTimesGrid.loadGridData(this.queryParams);
    }

    public buildFields(): void {

        this.riExchange.riInputElement.Enable(this.uiForm, 'PremiseName');
        this.parentMode = this.riExchange.getParentMode();

        switch (this.parentMode) {
            case 'Premise':
                this.riExchange.riInputElement.Disable(this.uiForm, 'PremiseNumber');
                break;
            default:
                break;
        }

        //Disable fields
        this.riExchange.riInputElement.Disable(this.uiForm, 'ContractNumber');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ContractName');
        this.riExchange.riInputElement.Disable(this.uiForm, 'PremiseName');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ServiceCoverNumber');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ContractRowID');
        this.riExchange.riInputElement.Disable(this.uiForm, 'PremiseRowID');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ServiceCoverRowID');
    }

    public gridOnClick(data: any): void {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractRowID', this.riExchange.getParentAttributeValue('RowID'));
    }

    public getGridInfo(info: any): void {
        //this.PremiseAccessTimesPagination.totalItems = info.totalRows;
        if (info && info.totalPages) {
            this.totalItems = parseInt(info.totalPages, 10) * this.itemsPerPage;
        } else {
            this.totalItems = 0;
        }
    }

    public sortGridInfo(data: any): void {
        this.search.set(this.serviceConstants.GridHeaderClickedColumn, data.fieldname);
        this.search.set(this.serviceConstants.GridSortOrder, data.sort === 'DESC' ? 'Descending' : 'Ascending');
        this.refresh();
    }

    public getCurrentPage(currentPage: any): void {
        this.selectedRow = -1;
        this.currentPage = currentPage.value;
        this.search.set(this.serviceConstants.PageCurrent, String(this.currentPage));
        this.PremiseAccessTimesGrid.loadGridData(this.queryParams);
    }

    public refresh(): void {
        this.buildGrid();
    }

}
