import { Component, OnInit, Injector, ViewChild, OnDestroy } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';


@Component({
    templateUrl: 'riMUserSearch.html'
})

export class MUserSearchComponent extends BaseComponent implements OnInit, OnDestroy {
    public pageId: string = '';
    public controls = [
        {name : 'FilterSelect'},
        {name : 'InactiveUsers'},
        {name : 'Begins'},
        {name : 'NonRelatedEmployee'}
    ];
    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.RIMUSERSEARCH;
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.pageTitle = 'User Search';
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }
}
