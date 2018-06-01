import { Component, OnInit, Injector, ViewChild } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';

@Component({
    templateUrl: 'iCABSSNotificationGroupEmployeeMaintenance.html'
})

export class NotificationGroupEmployeeMaintenanceComponent extends BaseComponent implements OnInit {
    public pageId: string = '';
    public controls = [
        { name: 'NotifyGroupCode' },
        { name: 'NotifyGroupSystemDesc' },
        { name: 'NotifyContactList' }
    ];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSNOTIFICATIONGROUPEMPLOYEEMAINTENANCE;
    }

    ngOnInit(): void {
        super.ngOnInit();
    }
}
