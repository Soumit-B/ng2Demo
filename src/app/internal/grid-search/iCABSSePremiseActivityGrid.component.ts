import { Component, OnInit, Injector, ViewChild, OnDestroy } from '@angular/core';
import { GridComponent } from './../../../shared/components/grid/grid';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';


@Component({
    templateUrl: 'iCABSSePremiseActivityGrid.html'
})

export class PremiseActivityGridComponent extends BaseComponent implements OnInit, OnDestroy {
    public pageId: string = '';
    public controls = [
        { name: 'BranchServiceAreaCode' },
        { name: 'BranchServiceAreaDesc' },
        { name: 'ServicePlanNumber' },
        { name: 'ServiceWeekNumber' },
        { name: 'ContractNumber' },
        { name: 'ContractName' },
        { name: 'ServicePlanStartDate' },
        { name: 'ServicePlanEndDate' },
        { name: 'PremiseNumber' },
        { name: 'PremiseName' },
        { name: 'EmployeeCode' },
        { name: 'EmployeeSurname' },
        { name: 'DrivingStartTime' },
        { name: 'DrivingEndTime' },
        { name: 'EndMileage' },
        { name: 'KeyedStartTime' },
        { name: 'KeyedEndTime' }
    ];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSEPREMISEACTIVITYGRID;
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.pageTitle = 'Premises Activity';
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

}
