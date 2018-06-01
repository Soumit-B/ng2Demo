import { GridAdvancedComponent } from './../../../shared/components/grid-advanced/grid-advanced';
import { Component, OnInit, Injector, ViewChild, OnDestroy } from '@angular/core';
import { BaseComponent } from '../../base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { GridComponent } from 'src/shared/components/grid/grid';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';


@Component({
    templateUrl: 'iCABSSSalesStatisticsServiceValueDetailAdjustGrid.html'
})

export class SalesStatisticsSericeValueDetailAdjustGridComponent extends BaseComponent implements OnInit, OnDestroy {
    @ViewChild('riGrid') riGrid: GridAdvancedComponent;

    public pageId: string = '';
    public controls = [
        { name: 'ContractNumber', disable: true },
        { name: 'ContractName', disable: true },
        { name: 'Reason', disable: true },
        { name: 'PremiseNumber', disable: true },
        { name: 'PremiseName', disable: true },
        { name: 'Employee', disable: true },
        { name: 'ProductCode', disable: true },
        { name: 'ProductDesc', disable: true },
        { name: 'Processed', disable: true },
        { name: 'AnnualValueChange', disable: true },
        { name: 'Effective', disable: true },
        { name: 'SalesStatsValue', disable: true },
        { name: 'btnAdjustment', disable: true },
        { name: 'TransferToEmployeeCodeMain', disable: true },
        { name: 'TransferToEmployeeNameMain', disable: true },
        { name: 'AdjustValueMain', disable: true },
        { name: 'PercentValueMain', disable: true },
        { name: 'LeftToAllocate', disable: true },

        { name: 'ServiceCoverNumber' },
        { name: 'ServiceValueNumber' }
    ];

    private NumberOfEmployees: number = 10;
    private strGridData;
    private lHideGrid: boolean = true;
    private cEmployeeCode;
    private lCalcLeftToAllocate: boolean = true;

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSSALESSTATISTICSSERVICEVALUEDETAILADJUSTGRID;
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.pageTitle = 'Sales Statistics Service Value';
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    private window_onload(): void {
        this.riGrid.HighlightBar = true;
        this.riGrid.FunctionPaging = true;
        this.riGrid.PageSize = 10;

        this.riExchange.getParentHTMLValue('ServiceCoverNumber');
        this.setControlValue('ServiceValueNumber', this.riExchange.getParentAttributeValue('ServiceValueNumber'));

        this.riExchange.getParentHTMLValue('ContractNumber');
        this.riExchange.getParentHTMLValue('PremiseNumber');
        this.riExchange.getParentHTMLValue('ProductCode');

        this.riExchange.getParentHTMLValue('ContractName');
        this.riExchange.getParentHTMLValue('PremiseName');
        this.riExchange.getParentHTMLValue('ProductDesc');
    }

}
