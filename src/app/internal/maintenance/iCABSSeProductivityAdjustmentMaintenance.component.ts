import { Component, OnInit, Injector, ViewChild, OnDestroy } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';

@Component({
    templateUrl: 'iCABSSeProductivityAdjustmentMaintenance.html'
})

export class ProductivityAdjustmentMaintenanceComponent extends BaseComponent implements OnInit, OnDestroy {
    public pageId: string = '';
    public controls = [
        { name: 'EmployeeCode' },
        { name: 'EmployeeSurname' },
        { name: 'AdjustmentNumber' },
        { name: 'AdjustmentValue' },
        { name: 'AdjustmentTime' },
        { name: 'AdjustmentTimeNeg' },
        { name: 'AdjustmentText' }
    ];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSEPRODUCTIVITYADJUSTMENTMAINTENANCE;
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.pageTitle = 'Productivity Adjustment Maintenance';
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }
}
