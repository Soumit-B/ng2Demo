import { Component, OnInit, Injector } from '@angular/core';
import { BaseComponent } from '../../../../app/base/BaseComponent';
import { PageIdentifier } from '../../../base/PageIdentifier';


@Component({
    templateUrl: 'iCABSBVisitActionMaintenance.html'
})

export class VisitActionMaintenanceComponent extends BaseComponent implements OnInit {
    public pageId: string = '';
    public controls = [
        { name: 'VisitTypeCode' },
        { name: 'VisitTypeDesc' },
        { name: 'SystemVisitActionCode' },
        { name: 'SystemVisitActionDesc' }
    ];
    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSBVISITACTIONMAINTENANCE;
    }
    ngOnInit(): void {
        super.ngOnInit();
    }
}
