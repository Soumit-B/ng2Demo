import { Component, OnInit, Injector, ViewChild, OnDestroy } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';

@Component({
    templateUrl: 'iCABSSNotificationTemplateDetailMaintenance.html'
})

export class NotificationTemplateDetailMaintenanceComponent extends BaseComponent implements OnInit, OnDestroy {
    public pageId: string = '';
    public controls = [
        { name: 'NotifyTemplateCode' },
        { name: 'NotifyTemplateSystemDesc' },
        { name: 'LanguageCode' },
        { name: 'LanguageDescription' },
        { name: 'NotifySubjectText' },
        { name: 'NotifyBodyText' },
        { name: 'CustomerContactNumber' }
    ];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSNOTIFICATIONTEMPLATEDETAILMAINTENANCE;
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.pageTitle = 'Notification Template Detail Maintenance';
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

}
