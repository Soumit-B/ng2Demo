import { Component, OnInit, Injector, ViewChild, Input } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';

@Component({
    templateUrl: 'riMGLanguageSearch.html'
})

export class LanguageSearchComponent extends BaseComponent implements OnInit {
    public pageId: string = '';
    public controls = [];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.RIMGLANGUAGESEARCH;
    }

    ngOnInit(): void {
        super.ngOnInit();
    }
}
