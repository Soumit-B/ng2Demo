import { Component, OnInit, Injector, ViewChild, OnDestroy } from '@angular/core';
import { GridComponent } from './../../../shared/components/grid/grid';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';


@Component({
    templateUrl: 'iCABSAServiceVisitPlanningGrid.html'
})

export class ServiceVisitPlanningGridComponent extends BaseComponent implements OnInit, OnDestroy {
    public pageId: string = '';
    public controls = [
             { name: 'ContractNumber' },
             { name: 'ContractName' },
             { name: 'SelectedYear' },
             { name: 'PremiseNumber' },
             { name: 'PremiseName' },
             { name: 'ServiceVisitFrequency' },
             { name: 'TotalVisits' },
             { name: 'ProductCode' },
             { name: 'ProductCodeDesc' },
             { name: 'ServiceAnnualTime' },
             { name: 'TotalHours' },
             { name: 'ServiceVisitAnnivDate' },
             { name: 'ServiceAnnualValue' }

    ];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSASERVICEVISITPLANNINGGRID;
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.pageTitle = 'Service Visit Planning Maintenance';
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

}
