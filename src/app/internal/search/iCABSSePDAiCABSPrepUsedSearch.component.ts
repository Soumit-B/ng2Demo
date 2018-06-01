import { Component, OnInit, Injector, ViewChild, OnDestroy } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { GridAdvancedComponent } from './../../../shared/components/grid-advanced/grid-advanced';
import { PageIdentifier } from './../../base/PageIdentifier';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';


@Component({
    templateUrl: 'iCABSSePDAiCABSPrepUsedSearch.html'
})

export class PrepUsedSearchComponent extends BaseComponent implements OnInit, OnDestroy {
    public pageId: string = '';
    public controls = [
        { name: 'ContractNumber' },
        { name: 'ContractName' },
        { name: 'PremiseNumber' },
        { name: 'PremiseName' },
        { name: 'ProductCode' },
        { name: 'ProductDesc' },
        { name: 'menu' }
    ];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSEPDAICABSPREPUSEDSEARCH;
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.pageTitle = 'Prep Used Details';
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }
}
