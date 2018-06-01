import { Component, OnInit, Injector, ViewChild, OnDestroy } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';

@Component({
    templateUrl: 'iCABSSeClearDownPlanVisits.html'
})

export class ClearDownPlanVisitsComponent extends BaseComponent implements OnInit, OnDestroy {
    public pageId: string = '';
    public controls = [
        { name: 'CancelCode' },
        { name: 'Condition' },
        { name: 'ServiceVisitFrequency' },
        { name: 'ClearContracts' },
        { name: 'ClearJobs' },
        { name: 'ClearProductSales' },
        { name: 'CompleteClearDown' },
        { name: 'CompleteClearDown' }
    ];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSECLEARDOWNPLANVISITS;
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.pageTitle = 'Clear Down Plan Visits';
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }
}
