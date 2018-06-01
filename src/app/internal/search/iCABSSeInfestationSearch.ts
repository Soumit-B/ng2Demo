
import { Component, OnInit, Injector, OnDestroy } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { TableComponent } from './../../../shared/components/table/table';

@Component({
    templateUrl: 'iCABSSeInfestationSearch.html'
})

export class InfestationSearchComponent extends BaseComponent implements OnInit, OnDestroy {
    public pageId: string = '';
    public controls = [
        { name: 'ContractNumber' },
        { name: 'ContractName' },
        { name: 'PremiseNumber' },
        { name: 'PremiseName' },
        { name: 'ProductCode' },
        { name: 'ProductDesc' },
        { name: 'menu'}
    ];
    ngOnInit(): void {
        super.ngOnInit();
    }
    ngOnDestroy(): void {
        //to do
    }
    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSEINFESTATIONSEARCH;
        this.pageTitle = 'Infestation Details';
    }
}
