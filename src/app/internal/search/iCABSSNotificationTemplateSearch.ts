import { Component, Input, EventEmitter, ViewChild, Output } from '@angular/core';
import { DropdownComponent } from './../../../shared/components/dropdown/dropdown';
import { HttpService } from './../../../shared/services/http-service';
import { ServiceConstants } from './../../../shared/constants/service.constants';

@Component({
    selector: 'icabs-notification-template-search',
    template: `<icabs-dropdown #notificationTemplateDropDown [disabled]="isDisabled" [isRequired]="isRequired" [active]="active">
                </icabs-dropdown>`
})

export class NotificationTemplateComponent {
    @ViewChild('notificationTemplateDropDown') notificationTemplateDropDown: DropdownComponent;
    @Input() public isDisabled: any;
    @Input() public active: any;
    @Input() public isRequired: boolean;
    @Output() receivedNotificationTemplate = new EventEmitter();


    constructor(
        private serviceConstants: ServiceConstants,
        private _httpService: HttpService) {
    }
}
