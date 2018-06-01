import { Component, OnInit, Injector } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';

@Component({
    templateUrl: 'iCABSBPrepChargeRateSearch.html'
})

export class PrepChargeRateSearchComponent extends BaseComponent implements OnInit {
    public pageId: string = '';
    public controls = [];
    ngOnInit(): void {
        super.ngOnInit();
    }
    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSBPREPCHARGERATESEARCH;
    }
}
