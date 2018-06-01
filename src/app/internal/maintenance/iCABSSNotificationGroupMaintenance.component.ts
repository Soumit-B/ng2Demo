import { Component, OnInit, Injector, ViewChild, OnDestroy } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';

@Component({
    templateUrl: 'iCABSSNotificationGroupMaintenance.html'
})

export class NotificationGroupMaintenanceComponent extends BaseComponent implements OnInit, OnDestroy {
    public pageId: string = '';
    public controls = [
        { name: 'NotifyGroupCode' },
        { name: 'NotifyGroupSystemDesc' }
    ];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSNOTIFICATIONGROUPMAINTENANCE;
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.pageTitle = 'Notification Group Maintenance';
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

}
