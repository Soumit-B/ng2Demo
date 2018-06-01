import { Component, OnInit, Injector } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';

@Component({
    templateUrl: 'iCABSSNotificationTemplateGrid.html'
})

export class NotificationTemplateGridComponent extends BaseComponent implements OnInit {
    public pageId: string = '';
    public controls = [
        { name: 'NotifyTemplateCode' },
        { name: 'NotifyTemplateSystemDesc' }
    ];
    ngOnInit(): void {
        super.ngOnInit();
    }
    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSNOTIFICATIONTEMPLATEGRID;
    }
}
