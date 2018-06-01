import { Component, OnInit, OnDestroy, Injector, ViewChild, Input } from '@angular/core';
import { BaseComponent } from '../../base/BaseComponent';
import { PageIdentifier } from '../../base/PageIdentifier';


@Component({
    templateUrl: 'iCABSAServiceCoverServiceSuspendMaintenance.html'
})

export class ServiceSuspendMaintenanceComponent extends BaseComponent implements OnInit, OnDestroy {


    public pageId: string = '';
    public controls = [];

    ngOnInit(): void {
        super.ngOnInit();
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSASERVICECOVERSERVICESUSPENDMAINTENANCE;

    }
}
