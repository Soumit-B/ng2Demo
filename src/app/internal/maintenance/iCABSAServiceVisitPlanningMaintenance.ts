import { Component } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { OnInit, Injector } from '@angular/core';

@Component({
    templateUrl: 'iCABSAServiceVisitPlanningMaintenance.html'
})

export class ServiceVisitPlanningMaintenanceComponent extends BaseComponent implements OnInit {
    public pageId: string = '';
    public controls = [
        { name: 'ContractNumber', readonly: true, disabled: false, required: false },
        { name: 'ContractName', readonly: true, disabled: false, required: false },
        { name: 'PremiseNumber', readonly: true, disabled: false, required: false },
        { name: 'PremiseName', readonly: true, disabled: false, required: false },
        { name: 'ProductCode', readonly: true, disabled: false, required: false },
        { name: 'ProductDesc', readonly: true, disabled: false, required: false },
        { name: 'CalendarDate', readonly: true, disabled: false, required: false },
        { name: 'PlannedQuantity', readonly: true, disabled: false, required: false },
        { name: 'PlannedValue', readonly: true, disabled: false, required: false },
        { name: 'VisitDuration', readonly: true, disabled: false, required: false },
        { name: 'ServiceVisitText', readonly: true, disabled: false, required: false }
    ];
    ngOnInit(): void {
        super.ngOnInit();
    }
    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSASERVICEVISITPLANNINGMAINTENANCE;
    }
}
