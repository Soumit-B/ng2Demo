import { PageIdentifier } from './../../base/PageIdentifier';
import { BaseComponent } from '../../base/BaseComponent';
import { Component, Injector, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';


@Component({
    templateUrl: 'iCABSBUserAuthorityBranchSearch.html'
})

export class UserAuthorityBranchSearchComponent extends BaseComponent implements OnInit, OnDestroy {
    public pageId: string = '';

    public controls = [
        { name: 'UserCode' },
        { name: 'BusinessCode' },
        { name: 'FilterBy' },
        { name: 'FilterValue' }
    ];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSBUSERAUTHORITYBRANCHSEARCH;
    }

    ngOnInit(): void {
        super.ngOnInit();
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }
}

