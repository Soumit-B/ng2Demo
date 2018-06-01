import { Component, OnInit, Injector, ViewChild, OnDestroy } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';

@Component({
    templateUrl: 'iCABSBBranchProdServiceGrpEntryMaintenance.html'
})

export class BranchProdServiceGrpEntryMaintenanceComponent extends BaseComponent implements OnInit, OnDestroy {
    public pageId: string = '';
    public controls = [
        { name: 'BranchServiceAreaCode' },
        { name: 'BranchServiceAreaDesc' },
        { name: 'ProductServiceGroupCode' },
        { name: 'ProductServiceGroupDesc' }
    ];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSBBRANCHPRODSERVICEGRPENTRYMAINTENANCE;
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.pageTitle = 'Product Group Entry Maintenance';
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

}
