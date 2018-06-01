import { Component } from '@angular/core';
import { BaseComponent } from './../../base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { OnInit, Injector } from '@angular/core';

@Component({
    templateUrl: 'iCABSSePrepUsedSearch.html'
})

export class PrepUsedSearchComponent extends BaseComponent implements OnInit {
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
        this.pageId = PageIdentifier.ICABSSEPREPUSEDSEARCH;
    }
}
