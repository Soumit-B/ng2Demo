import { Component, OnInit, Injector } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';

@Component({
    templateUrl: 'iCABSSSystemPDAActivityTypeLanguageSearch.html'
})

export class SystemPDAActivityTypeLanguageSearchComponent extends BaseComponent implements OnInit {
    public pageId: string = '';
    public controls = [
        { name: 'LanguageCode'},
        { name: 'LanguageDescription'}
    ];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSSYSTEMPDAACTIVITYTYPELANGUAGESEARCH;
    }

    ngOnInit(): void {
        super.ngOnInit();
    }
}
