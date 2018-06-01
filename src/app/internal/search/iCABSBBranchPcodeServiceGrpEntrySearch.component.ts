import { Component, OnInit, Injector } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';

@Component({
    templateUrl: 'iCABSBBranchPcodeServiceGrpEntrySearch.html'
})

export class BranchPcodeServiceGrpEntrySearchComponent extends BaseComponent implements OnInit {
    public pageId: string = '';
    public controls = [
        { name: 'BranchServiceAreaCode' },
        { name: 'BranchServiceAreaDesc' },
        { name: 'menu' }
    ];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSBBRANCHPCODESERVICEGRPENTRYSEARCH;
    }

    ngOnInit(): void {
        super.ngOnInit();
    }
}
