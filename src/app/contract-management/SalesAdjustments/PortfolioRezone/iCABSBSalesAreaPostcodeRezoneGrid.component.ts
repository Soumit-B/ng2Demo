import { Component, OnInit, Injector, ViewChild, Input } from '@angular/core';
import { PageIdentifier } from './../../../base/PageIdentifier';
import { BaseComponent } from '../../../base/BaseComponent';

@Component({
    templateUrl: 'iCABSBSalesAreaPostcodeRezoneGrid.html'
})

export class SalesAreaPostcodeRezoneGridComponent extends BaseComponent implements OnInit {
    public pageId: string = '';
    public controls = [
        { name: 'ContractNumber' },
        { name: 'ContractName' },
        { name: 'PostcodeFilter' },
        { name: 'Town' },
        { name: 'County' }
    ];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSBSALESAREAPOSTCODEREZONEGRID;
    }

    ngOnInit(): void {
        super.ngOnInit();
    }
}
