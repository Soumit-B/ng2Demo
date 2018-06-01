import { Component, OnInit, Injector, ViewChild, Input } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';

@Component({
    templateUrl: 'iCABSBRMMCategorySearch.html'
})

export class RMMCategorySearchComponent extends BaseComponent implements OnInit {
    public pageId: string = '';
    public controls = [];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSBRMMCATEGORYSEARCH;
    }

    ngOnInit(): void {
        super.ngOnInit();
    }
}
