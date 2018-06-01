import { Component, OnInit, Injector } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';

@Component({
    templateUrl: 'riMUserTypeSearch.html'
})

export class UserTypeSearchComponent extends BaseComponent implements OnInit {
    public pageId: string = '';
    public controls = [];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.RIMUSERTYPESEARCH;
    }

    ngOnInit(): void {
        super.ngOnInit();
    }
}
