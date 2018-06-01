import { Component, OnInit, OnDestroy, Injector, ViewChild, Input } from '@angular/core';
import { BaseComponent } from './../../base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';


@Component({
    templateUrl: 'iCABSSeServicePlanningDetailHg.html'
})

export class SeServicePlanningDetailHgComponent extends BaseComponent implements OnInit, OnDestroy {


    public pageId: string = '';
    public controls = [
        { name: 'ContractNumber' },
        { name: 'ContractName' },
        { name: 'PremiseNumber' },
        { name: 'PremiseName' },
        { name: 'WeekNumber' },
        { name: 'ProductCode' },
        { name: 'ProductDesc' },
        { name: 'DefaultDay' },
        { name: 'OriginalVisitDuration' },
        { name: 'DefaultStartTime' },
        { name: 'PlannedVisitDuration' },
        { name: 'Technician' },
        { name: 'TechnicianDesc' },
        { name: 'SelectDay' },
        { name: 'Duration' },
        { name: 'StartTime' },
        { name: 'Booked' }
    ];

    ngOnInit(): void {
        super.ngOnInit();
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSESERVICEPLANNINGDETAILHG;

    }
}
