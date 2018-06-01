import { Component, OnInit, Injector } from '@angular/core';
import { PageIdentifier } from './../../base/PageIdentifier';
import { BaseComponent } from './../../base/BaseComponent';
@Component({
    templateUrl: 'iCABSBBranchProdServiceGrpEntrySearch.html'
})

export class BranchProdServiceGrpEntrySearchComponent extends BaseComponent implements OnInit {
    public pageId: string = '';
    public controls = [
        { name: 'BranchServiceAreaCode'},
        { name: 'BranchServiceAreaDesc'}
    ];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSBBRANCHPRODSERVICEGRPENTRYSEARCH;
    }

    ngOnInit(): void {
        super.ngOnInit();
    }
}
