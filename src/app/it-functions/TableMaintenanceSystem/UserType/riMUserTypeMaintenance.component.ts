import { BaseComponent } from './../../../../app/base/BaseComponent';
import { PageIdentifier } from './../../../../app/base/PageIdentifier';
import { Component, OnInit,Injector } from '@angular/core';

@Component({
    templateUrl: 'riMUserTypeMaintenance.html'
})

export class UserTypeMaintenanceComponent extends BaseComponent implements OnInit {
    public pageId: string = '';
    public controls = [
        { name: 'UserTypeCode'},
        { name: 'UserTypeAllow'},
        { name: 'UserTypeDescription'},
        { name: 'menu'}
    ];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.RIMUSERTYPEMAINTENANCE;
    }

    ngOnInit(): void {
        super.ngOnInit();
    }
}
