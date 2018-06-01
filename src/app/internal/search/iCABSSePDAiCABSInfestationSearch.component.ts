import { TableComponent } from './../../../shared/components/table/table';
import { Component, OnInit, Injector, ViewChild } from '@angular/core';
import { PageIdentifier } from './../../base/PageIdentifier';
import { BaseComponent } from './../../base/BaseComponent';
import { URLSearchParams } from '@angular/http';

@Component({
    templateUrl: 'iCABSSePDAiCABSInfestationSearch.html'
})

export class InfestationSearchComponent extends BaseComponent implements OnInit {
     public pageId: string = '';
    public controls = [
        {name: 'ContractNumber'},
        {name: 'ContractName'},
        {name: 'PremiseNumber'},
        {name: 'PremiseName'},
        {name: 'ProductCode'},
        {name: 'ProductDesc'},
        {name: 'menu'}
    ];
    ngOnInit(): void {
        super.ngOnInit();
    }
    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSEPDAICABSINFESTATIONSEARCH;
    }
}
