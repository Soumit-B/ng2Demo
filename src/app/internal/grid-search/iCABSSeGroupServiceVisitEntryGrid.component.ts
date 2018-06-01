import { Component, OnInit, OnDestroy, Injector, ViewChild, Input } from '@angular/core';
import { BaseComponent } from '../../base/BaseComponent';
import { PageIdentifier } from '../../base/PageIdentifier';


@Component({
    templateUrl: 'iCABSSeGroupServiceVisitEntryGrid.html'
})

export class SeGroupServiceVisitEntryGridComponent extends BaseComponent implements OnInit, OnDestroy {


    public pageId: string = '';
    public controls = [
        { name: 'BranchServiceAreaCode' },
        { name: 'BranchServiceAreaDesc' },
        { name: 'ServicePlanNumber' },
        { name: 'EmployeeCode' },
        { name: 'EmployeeSurname' },
        { name: 'ServicePlanStartDate' },
        { name: 'VisitReference1' },
        { name: 'ServicePlanEndDate' }
    ];

    ngOnInit(): void {
        super.ngOnInit();
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSEGROUPSERVICEVISITENTRYGRID;

    }
}
