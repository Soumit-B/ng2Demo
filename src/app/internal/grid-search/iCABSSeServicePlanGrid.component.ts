import { Component, Injector, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { PageIdentifier } from './../../base/PageIdentifier';
import { BaseComponent } from '../../base/BaseComponent';

@Component({
    templateUrl: 'iCABSSeServicePlanGrid.html'
})

export class ServicePlanGridComponent extends BaseComponent implements OnInit, OnDestroy {

    public pageId: string = '';
    public controls = [
        { name: 'BranchServiceAreaCode' },
        { name: 'EmployeeSurname' },
        { name: 'WeekNumber' }
    ];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSESERVICEPLANGRID;
    }

    ngOnInit(): void {
        super.ngOnInit();
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }
}
