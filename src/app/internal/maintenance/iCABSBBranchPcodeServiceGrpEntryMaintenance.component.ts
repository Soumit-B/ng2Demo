import { Component,OnInit, Injector } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
@Component({
    templateUrl: 'iCABSBBranchPcodeServiceGrpEntryMaintenance.html'
})

export class BranchPcodeServiceGrpEntryMaintenanceComponent extends BaseComponent implements OnInit {
    public pageId: string = '';
    public controls = [
        { name: 'BranchServiceAreaCode'},
        { name: 'BranchServiceAreaDesc'},
        { name: 'Postcode'},
        { name: 'State'},
        { name: 'Town'},
        { name: 'SortOrder'}
    ];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSBBRANCHPCODESERVICEGRPENTRYMAINTENANCE;
    }

    ngOnInit(): void {
        super.ngOnInit();
    }
}
