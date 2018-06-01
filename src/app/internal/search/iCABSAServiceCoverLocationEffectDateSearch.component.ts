import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { Subscription } from 'rxjs/Subscription';
import { URLSearchParams } from '@angular/http';
import { PageIdentifier } from './../../base/PageIdentifier';
import { Component, OnInit, OnDestroy, Injector, ViewChild } from '@angular/core';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';
import { GridComponent } from './../../../shared/components/grid/grid';
import { BaseComponent } from '../../../app/base/BaseComponent';

@Component({
    templateUrl: 'iCABSAServiceCoverLocationEffectDateSearch.html'
})

export class ServiceCoverLocationEffectDateSearchComponent extends BaseComponent implements OnInit, OnDestroy {

    @ViewChild('EffectiveDateSearchGrid') EffectiveDateSearchGrid: GridComponent;
    @ViewChild('EffectiveDateSearchPagination') EffectiveDateSearchPagination: PaginationComponent;

    public queryParams: any = {
        operation: 'Application/iCABSAServiceCoverLocationEffectDateSearch',
        module: 'locations',
        method: 'service-delivery/search'
    };

    public controls = [
        { name: 'ContractNumber', readonly: true, disabled: true, required: false },
        { name: 'ContractName', readonly: true, disabled: true, required: false },
        { name: 'PremiseNumber', readonly: true, disabled: true, required: false },
        { name: 'PremiseName', readonly: true, disabled: true, required: false },
        { name: 'ProductCode', readonly: true, disabled: true, required: false },
        { name: 'ProductDesc', readonly: true, disabled: true, required: false },
        { name: 'PremiseLocationNumber', readonly: true, disabled: true, required: false },
        { name: 'PremiseLocationDesc', readonly: true, disabled: true, required: false },
        { name: 'ServiceVisitFrequency', readonly: true, disabled: true, required: false },
        { name: 'ServiceCoverRowID', readonly: true, disabled: true, required: false },
        { name: 'EffectiveDateFrom', readonly: true, disabled: true, required: false }
    ];

    //local variables
    public pageId: string = '';

    // Grid Component Variables
    public search: URLSearchParams = new URLSearchParams();
    public riGrid: any = {};
    public itemsPerPage: number = 11;
    public currentPage: number = 1;
    public totalItems: number = 10;
    public maxColumn: number = 2;
    public gridSortHeaders: Array<any>;
    public grdEffectiveDateSearch: any = {};
    public validateProperties: Array<any> = [];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSASERVICECOVERLOCATIONEFFECTDATESEARCH;
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.window_onload();
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    private setGridHeaders(): void {
        this.validateProperties = [
            {
                'type': MntConst.eTypeDate,
                'index': 0,
                'align': 'left'
            },
            {
                'type': MntConst.eTypeText,
                'index': 1,
                'align': 'right'
            }
        ];
    }

    public window_onload(): void {

        this.setControlValue('ContractNumber', this.riExchange.getParentHTMLValue('ContractNumber'));
        this.setControlValue('ContractName', this.riExchange.getParentHTMLValue('ContractName'));
        this.setControlValue('PremiseNumber', this.riExchange.getParentHTMLValue('PremiseNumber'));
        this.setControlValue('PremiseName', this.riExchange.getParentHTMLValue('PremiseName'));
        this.setControlValue('ProductCode', this.riExchange.getParentHTMLValue('ProductCode'));
        this.setControlValue('ProductDesc', this.riExchange.getParentHTMLValue('ProductDesc'));
        this.setControlValue('ServiceVisitFrequency', this.riExchange.getParentHTMLValue('ServiceVisitFrequency'));
        this.setControlValue('PremiseLocationNumber', this.riExchange.getParentHTMLValue('PremiseLocationNumber'));
        this.setControlValue('PremiseLocationDesc', this.riExchange.getParentHTMLValue('PremiseLocationDesc'));
        this.setControlValue('ServiceCoverRowID', this.riExchange.getParentAttributeValue('ServiceCoverRowID'));

    }

    public buildGrid(): void {

        this.setGridHeaders();
        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.Action, '2');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());

        //set parameters
        this.search.set('ContractNumber', this.getControlValue('ContractNumber'));
        this.search.set('PremiseNumber', this.getControlValue('PremiseNumber'));
        this.search.set('ProductCode', this.getControlValue('ProductCode'));
        this.search.set('PremiseLocationNumber', this.getControlValue('PremiseLocationNumber'));
        this.search.set('ServiceCoverROWID', this.getControlValue('ServiceCoverRowID'));

        // set grid building parameters
        this.search.set(this.serviceConstants.PageSize, (this.itemsPerPage - 1).toString());
        this.search.set(this.serviceConstants.PageCurrent, this.currentPage.toString());
        this.search.set(this.serviceConstants.GridMode, '0');
        this.search.set(this.serviceConstants.GridHandle, '1509660');
        this.queryParams.search = this.search;
        this.EffectiveDateSearchGrid.loadGridData(this.queryParams);
    }

    public gridOnClick(data: any): void {
        this.riGrid.rowIndex = data.rowIndex;
        this.riGrid.cellIndex = data.cellIndex;
        this.riGrid.rowData = data.rowData;
        this.riGrid.rowID = data.cellData.rowID;
        this.riGrid.cellData = this.EffectiveDateSearchGrid.getCellInfoForSelectedRow(this.riGrid.rowIndex, this.riGrid.cellIndex);
        let headerColumnData: any = this.EffectiveDateSearchGrid.getHeaderInfoForSelectedCell(this.riGrid.rowIndex, this.riGrid.cellIndex);
        this.riGrid.headerTitle = headerColumnData.text;
        this.EffectDateFocus(data);
    }

    public gridOnDblClick(data: any): void {
        let returnObj = {};
        this.riExchange.setParentHTMLValue('EffectiveDateFrom', this.riExchange.getParentAttributeValue('ContractNumberEffectiveDate'));
        returnObj['EffectiveDateFrom'] = data.trRowData[0].text;
        this.emitSelectedData(returnObj);
    }

    public EffectDateFocus(data: any): void {
        this.grdEffectiveDateSearch.Row = this.riGrid.rowIndex;
        if (this.riGrid.headerTitle === 'Effective Date') {
            this.grdEffectiveDateSearch.EffectiveDate = this.riGrid.rowID;
        }
    }

    public getGridInfo(info: any): void {
        this.EffectiveDateSearchPagination.totalItems = info.totalRows;
    }

    public sortGridInfo(data: any): void {
        this.search.set(this.serviceConstants.GridHeaderClickedColumn, data.fieldname);
        this.search.set(this.serviceConstants.GridSortOrder, data.sort === 'DESC' ? 'Descending' : 'Ascending');
        this.refresh();
    }

    public getCurrentPage(currentPage: any): void {
        this.currentPage = currentPage.value;
        this.refresh();
    }

    public refresh(): void {
        this.buildGrid();
    }

    public updateView(params: any): void {

        if (params.ContractNumber)
            this.setControlValue('ContractNumber', params.ContractNumber);
        if (params.ContractName)
            this.setControlValue('ContractName', params.ContractName);
        if (params.PremiseNumber)
            this.setControlValue('PremiseNumber', params.PremiseNumber);
        if (params.PremiseName)
            this.setControlValue('PremiseName', params.PremiseName);
        if (params.ProductCode)
            this.setControlValue('ProductCode', params.ProductCode);
        if (params.ProductDesc)
            this.setControlValue('ProductDesc', params.ProductDesc);
        if (params.PremiseLocationNumber)
            this.setControlValue('PremiseLocationNumber', params.PremiseLocationNumber);
        if (params.PremiseLocationDesc)
            this.setControlValue('PremiseLocationDesc', params.PremiseLocationDesc);
        if (params.ServiceVisitFrequency)
            this.setControlValue('ServiceVisitFrequency', params.ServiceVisitFrequency);
        if (params.ServiceCoverRowID)
            this.setControlValue('ServiceCoverRowID', params.ServiceCoverRowID);

        this.buildGrid();
    }
}

