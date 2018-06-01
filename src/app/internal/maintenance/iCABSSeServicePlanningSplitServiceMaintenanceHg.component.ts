import { Component, OnInit, Injector, ViewChild, OnDestroy } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';

@Component({
    templateUrl: 'iCABSSeServicePlanningSplitServiceMaintenanceHg.html'
})

export class ServicePlanningSplitServiceMaintenanceComponent extends BaseComponent implements OnInit, OnDestroy {
    public pageId: string = '';
    public controls = [
                 { name: 'ContractNumber' },
                 { name: 'ContractName' },
                 { name: 'PremiseNumber' },
                 { name: 'PremiseName' },
                 { name: 'ProductCode' },
                 { name: 'ProductDesc' },
                 { name: 'PlanVisitNumber' },
                 { name: 'VisitTypeCode' },
                 { name: 'PlanVisitSystemDesc' },
                 { name: 'OriginalVisitDueDate' },
                 { name: 'PlannedVisitDate' },
                 { name: 'OriginalVisitDuration' },
                 { name: 'PlannedVisitDuration' },
                 { name: 'RemainingDuration' },
                 { name: 'ServicedDuration' }
    ];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSESERVICEPLANNINGSPLITSERVICEMAINTENANCEHG;
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.pageTitle = 'Spilt Service Maintenance';
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

}
