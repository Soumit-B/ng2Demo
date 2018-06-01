import { Component, OnInit, Injector, ViewChild, OnDestroy } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';


@Component({
    templateUrl: 'iCABSBInfestationLocationSearch.html'
})

export class InfestationLocationSearchComponent extends BaseComponent implements OnInit, OnDestroy {
    public pageId: string = '';
        public controls = [
    ];
    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSBINFESTATIONLOCATIONSEARCH;
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.pageTitle = 'Infestation Location Search';
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }
}
