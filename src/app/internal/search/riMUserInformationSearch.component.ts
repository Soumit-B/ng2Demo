import { Component, OnInit, Injector } from '@angular/core';
import { PageIdentifier } from './../../base/PageIdentifier';
import { BaseComponent } from './../../base/BaseComponent';
@Component({
    templateUrl: 'riMUserInformationSearch.html'
})

export class UserInformationSearchComponent extends BaseComponent implements OnInit {
    public pageId: string = '';
    public controls = [
    ];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.RIMUSERINFORMATIONSEARCH;
    }

    ngOnInit(): void {
        super.ngOnInit();
    }
}
