import { Component, OnInit, Injector, ViewChild } from '@angular/core';
import { PageIdentifier } from './../../base/PageIdentifier';
import { BaseComponent } from '../../../app/base/BaseComponent';

@Component({
    templateUrl: 'iCABSBUserAuthoritySearch.html'
})

export class UserAuthoritySearchComponent extends BaseComponent implements OnInit {
    public controls = [];
    public pageId: string = '';
    public pageTitle: string = '';

     constructor(injector: Injector) {
        super(injector);
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.pageTitle = 'User Details';
    };
}
