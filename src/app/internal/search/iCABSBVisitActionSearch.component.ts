import { Component, OnInit, Injector } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';

@Component({
    templateUrl: 'iCABSBVisitActionSearch.html'
})

export class VisitActionSearchComponent extends BaseComponent implements OnInit {
    public pageId: string = '';
    public controls = [
        { name: 'VisitTypeCode'},
        { name: 'VisitTypeDesc'},
        { name: 'menu'}
    ];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSBVISITACTIONSEARCH;
    }

    ngOnInit(): void {
        super.ngOnInit();
    }
}
