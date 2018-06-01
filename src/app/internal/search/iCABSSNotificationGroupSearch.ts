import { DropdownComponent } from './../../../shared/components/dropdown/dropdown';
import { HttpService } from './../../../shared/services/http-service';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { Component,Input,ViewChild } from '@angular/core';
import { Logger } from '@nsalaun/ng2-logger';

@Component({
    selector: 'icabs-notification-group-search',
    template: `<icabs-dropdown #notificationgroupDropDown
        [itemsToDisplay]="displayFields" [disabled]="isDisabled" [isRequired]="isRequired" [active]="active" >
    </icabs-dropdown>`
})

export class NotificationGroupSearchComponent {
    @ViewChild('notificationgroupDropDown') notificationgroupDropDown: DropdownComponent;
    @Input() public inputParams: any;
    @Input() public isDisabled: any;
    @Input() public active: any;
    @Input() public isRequired: boolean;

    public displayFields: Array<string> = ['NotifyGroupCode', 'NotifyGroupSystemDesc'];

    constructor(
        private serviceConstants: ServiceConstants,
        private _httpService: HttpService,
        private _logger: Logger
    ) { }

}

