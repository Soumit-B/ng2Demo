import { Component, OnInit, Injector, ViewChild, OnDestroy } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';


@Component({
    templateUrl: 'iCABSBNoServiceReasonSearch.html'
})

export class NoServiceReasonSearchComponent extends BaseComponent implements OnInit, OnDestroy {
    public pageId: string = '';
        public controls = [
    ];
    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSBNOSERVICEREASONSEARCH;
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.pageTitle = 'No Service Reason Search';
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }
}
