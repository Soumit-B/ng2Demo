import { Component, OnInit, Injector, ViewChild, OnDestroy } from '@angular/core';
import { GridComponent } from './../../../shared/components/grid/grid';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';


@Component({
    templateUrl: 'iCABSSeAreaReallocationGrid.html'
})

export class AreaReallocationGridComponent extends BaseComponent implements OnInit, OnDestroy {
    public pageId: string = '';
    public controls = [
                 { name: 'SearchType' },
                 { name: 'BranchServiceAreaCode' },
                 { name: 'BranchServiceAreaPlan' },
                 { name: 'FilterType' },
                 { name: 'ContractNumber' },
                 { name: 'ContractName' },
                 { name: 'ProductCode' },
                 { name: 'ProductCodeDesc' },
                 { name: 'PremiseNumber' },
                 { name: 'PremiseName' },
                 { name: 'DayFilter' },
                 { name: 'PremiseName' },
                 { name: 'ServiceFrequency' },
                 { name: 'SequenceNumber' }
    ];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSEAREAREALLOCATIONGRID;
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.pageTitle = 'Service Area Reallocation';
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

}
