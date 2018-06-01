import { Component, OnInit,Injector } from '@angular/core';
import { BaseComponent } from './../../../base/BaseComponent';
import { PageIdentifier } from './../../../base/PageIdentifier';


@Component({
    templateUrl: 'iCABSSNotificationTemplateMaintenance.html'
})

export class SNotificationTemplateMaintenanceComponent extends BaseComponent implements OnInit {

    public pageId: string = '';
    public controls = [
        { name: 'NotifyTemplateCode'},
        { name: 'NotifyTemplateSystemDesc'},
        { name: 'NotifyMaxSMSLength'},
        { name: 'NotifyTemplateTypeSelect'}
        ];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSNOTIFICATIONTEMPLATEMAINTENANCE;
    }

    ngOnInit(): void {
        super.ngOnInit();
    }

}
