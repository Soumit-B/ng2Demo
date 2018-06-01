import { Component, OnInit, Injector } from '@angular/core';
import { PageIdentifier } from './../../base/PageIdentifier';
import { BaseComponent } from './../../base/BaseComponent';
@Component({
    templateUrl: 'iCABSBReportGroupSearch.html'
})

export class ReportGroupSearchComponent extends BaseComponent implements OnInit {
    public pageId: string = '';
    public controls = [
    ];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSBREPORTGROUPSEARCH;
    }

    ngOnInit(): void {
        super.ngOnInit();
    }
}
