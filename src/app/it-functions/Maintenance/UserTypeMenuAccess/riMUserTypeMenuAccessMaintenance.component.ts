import { Component, OnInit, Injector } from '@angular/core';
import { BaseComponent } from '../../../../app/base/BaseComponent';
import { PageIdentifier } from '../../../base/PageIdentifier';


@Component({
    templateUrl: 'riMUserTypeMenuAccessMaintenance.html'
})

export class UserTypeMenuAccessMaintenanceComponent extends BaseComponent implements OnInit {
    public pageId: string = '';
    public controls = [
        { name: 'TextFilter' }
    ];
    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.RIMUSERTYPEMENUACCESSMAINTENANCE;
    }
    ngOnInit(): void {
        super.ngOnInit();
    }
}
