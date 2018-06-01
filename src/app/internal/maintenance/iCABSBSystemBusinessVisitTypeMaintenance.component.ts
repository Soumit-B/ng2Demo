import { Component, OnInit, Injector } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';

@Component({
    templateUrl: 'iCABSBSystemBusinessVisitTypeMaintenance.html'
})

export class SystemBusinessVisitTypeMaintenanceComponent extends BaseComponent implements OnInit {
    public pageId: string = '';
    public controls = [
        { name: 'SystemVisitTypeCode'},
        { name: 'SystemVisitTypeDesc'},
        { name: 'VisitTypeCode'},
        { name: 'VisitTypeDesc'}
    ];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSBSYSTEMBUSINESSVISITTYPEMAINTENANCE;
    }

     ngOnInit(): void {
        super.ngOnInit();
    }
}
