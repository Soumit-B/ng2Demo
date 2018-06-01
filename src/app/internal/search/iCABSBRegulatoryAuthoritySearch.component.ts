import { Utils } from '../../../shared/services/utility';
import { DropdownComponent } from '../../../shared/components/dropdown/dropdown';
import { HttpService } from '../../../shared/services/http-service';
import { ServiceConstants } from '../../../shared/constants/service.constants';
import { Logger } from '@nsalaun/ng2-logger';
import { URLSearchParams } from '@angular/http';
import { Component, OnInit, OnChanges, Input, EventEmitter, ViewChild, Output } from '@angular/core';
import { LocaleTranslationService } from '../../../shared/services/translation.service';

@Component({
    selector: 'icabs-regulatory-authority-search',
    template: `<icabs-dropdown #regulatoryauthoritysearchDropDown
  [itemsToDisplay]="displayFields" [disabled]="isDisabled" [isRequired]="isRequired" [active]="active" (selectedValue)="onReceivedData($event)">
  </icabs-dropdown>`
})

export class RegulatoryAuthoritySearchComponent implements OnInit, OnChanges {
    @ViewChild('regulatoryauthoritysearchDropDown') regulatoryauthoritysearchDropDown: DropdownComponent;
    @Input() public inputParams: any;
    @Input() public isDisabled: any;
    @Input() public active: any;
    @Input() public isRequired: boolean;
    @Output() receivedsearchdata = new EventEmitter();

    public displayFields: Array<string> = ['RegulatoryAuthorityNumber', 'RegulatoryAuthorityName'];

    ngOnInit(): void {console.log();}

    ngOnChanges(data: any): void {console.log();}

    public onReceivedData(obj: any): void {
        this.receivedsearchdata.emit(obj.value);
    }
}
