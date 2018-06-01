import { Component, OnInit, Injector } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';

@Component({
    templateUrl: 'iCABSSNotificationGroupGrid.html'
})

export class NotificationGroupGridComponent extends BaseComponent implements OnInit {
    public pageId: string = '';
    public controls = [
        { name: 'NotifyGroupCode'},
        { name: 'NotifyGroupSystemDesc'}
    ];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSNOTIFICATIONGROUPGRID;
    }

    ngOnInit(): void {
        super.ngOnInit();
    }
}
