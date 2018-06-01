import { Component, Injector, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { PageIdentifier } from './../../base/PageIdentifier';
import { BaseComponent } from '../../base/BaseComponent';

@Component({
    templateUrl: 'iCABSSeServicePlannedDatesGrid.html'
})

export class ServicePlannedDatesGridComponent extends BaseComponent implements OnInit, OnDestroy {

    public pageId: string = '';
    public controls = [
        { name: 'ContractNumber' },
        { name: 'ContractName' },
        { name: 'ServiceVisitFrequency' },
        { name: 'PremiseNumber' },
        { name: 'PremiseName' },
        { name: 'BranchServiceAreaCode' },
        { name: 'EmployeeSurname' },
        { name: 'ProductCode' },
        { name: 'ProductDesc' },
        { name: 'PlanningStatus' },
        { name: 'DisplayLines' }
    ];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSESERVICEPLANNEDDATESGRID;
    }

    ngOnInit(): void {
        super.ngOnInit();
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }
}
