import { Component, OnInit, Injector } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';

@Component({
    templateUrl: 'iCABSSSystemInvoiceIssueTypeLanguageSearch.html'
})

export class SystemInvoiceIssueTypeLanguageSearchComponent extends BaseComponent implements OnInit {
    public pageId: string = '';
    public controls = [
        { name: 'LanguageCode'},
        { name: 'LanguageDescription'}
    ];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSSYSTEMINVOICEISSUETYPELANGUAGESEARCH;
    }

    ngOnInit(): void {
        super.ngOnInit();
    }
}
