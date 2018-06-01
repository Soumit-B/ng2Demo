import { Component, OnInit, Injector, ViewChild, OnDestroy } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';

@Component({
    templateUrl: 'iCABSAVisitCancellationMaintenance.html'
})

export class VisitCancellationMaintenanceComponent extends BaseComponent implements OnInit, OnDestroy {
    public pageId: string = '';
    public controls = [
        { name: 'CanPlanVisits' },
        { name: 'SelReason' },
        { name: 'Password' },
        { name: 'BranchServiceAreaCode' },
        { name: 'EmployeeSurname' },
        { name: 'ResetPlansToInPlanning' }
    ];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSAVISITCANCELLATIONMAINTENANCE;
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.pageTitle = 'Visit Cancellation Maintenance';
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }
}
