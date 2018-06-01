import { PageIdentifier } from './../../base/PageIdentifier';
import { BaseComponent } from '../../base/BaseComponent';
import { Component, Injector, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';


@Component({
    templateUrl: 'iCABSSeServicePlanningSummaryGrid.html'
})

export class ServicePlanningSummaryGridComponent extends BaseComponent implements OnInit, OnDestroy {

    public pageId: string = '';

    public controls = [
        { name: 'BranchServiceAreaCode' },
        { name: 'EmployeeSurname' },
        { name: 'WeekNumber' },
        { name: 'StartDate' },
        { name: 'ServicePlanNumber' },
        { name: 'TotalNoOfCalls' },
        { name: 'TotalNoOfExchanges' },
        { name: 'TotalWeight' },
        { name: 'TotalWED' },
        { name: 'TotalTime' },
        { name: 'TotalNettValue' }
    ];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSESERVICEPLANNINGSUMMARYGRID;
    }

    ngOnInit(): void {
        super.ngOnInit();
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }
}

