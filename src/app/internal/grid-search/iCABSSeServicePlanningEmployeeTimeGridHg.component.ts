import { Component, OnInit, Injector, ViewChild, OnDestroy } from '@angular/core';
import { GridAdvancedComponent } from './../../../shared/components/grid-advanced/grid-advanced';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';


@Component({
    templateUrl: 'iCABSSeServicePlanningEmployeeTimeGridHg.html'
})

export class ServicePlanningEmployeeTimeGridComponent extends BaseComponent implements OnInit, OnDestroy {
    public pageId: string = '';
    public controls = [
        { name: 'EmployeeCode' },
        { name: 'EmployeeSurname' },
        { name: 'StartDate' },
        { name: 'EndDate' },
        { name: 'PlannedVisitDate' },
        { name: 'WeekNumber' }
    ];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSESERVICEPLANNINGEMPLOYEETIMEGRIDHG;
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.pageTitle = 'Employee Time';
    }
}
