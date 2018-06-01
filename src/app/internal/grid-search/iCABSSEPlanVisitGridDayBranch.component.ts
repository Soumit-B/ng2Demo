import { Component, Injector, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { PageIdentifier } from './../../base/PageIdentifier';
import { BaseComponent } from '../../base/BaseComponent';

@Component({
    templateUrl: 'iCABSSEPlanVisitGridDayBranch.html'
})

export class PlanVisitGridDayBranchComponent extends BaseComponent implements OnInit, OnDestroy {

    public pageId: string = '';

    public controls = [
        { name: 'BranchServiceAreaCode' },
        { name: 'EmployeeSurname' },
        { name: 'BranchNumber' },
        { name: 'BranchName' },
        { name: 'SelectedMonth' },
        { name: 'Postcode' },
        { name: 'SelectedYear' },
        { name: 'Town' },
        { name: 'BranchServiceAreaPlan' },
        { name: 'ProductServiceGroupString' },
        { name: 'VisitFrequencyFilter' },
        { name: 'GridPageSize' }
    ];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSEPLANVISITGRIDDAYBRANCH;
    }

    ngOnInit(): void {
        super.ngOnInit();
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }
}
