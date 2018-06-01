import { Component, Input, Output, EventEmitter, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { TranslateService } from 'ng2-translate';
import { LocaleTranslationService } from '../../../shared/services/translation.service';
import { RiExchange } from '../../../shared/services/riExchange';

@Component({
    selector: 'icabs-dropdown-static',
    template: `
    <select class="form-control" [disabled]="disabled" (change)="onChange()" [(ngModel)]="selectedItem" [ngClass]="{'invalid' : !isValid}" *ngIf="doTranslate === true">
        <option *ngFor="let item of inputData" [value]="item.value" [selected]="selectedItem === item.value" >
            {{item.text | translate}}
        </option>
    </select>
    <select class="form-control" [disabled]="disabled" (change)="onChange()" [(ngModel)]="selectedItem" [ngClass]="{'invalid' : !isValid}" *ngIf="doTranslate !== true">
        <option *ngFor="let item of inputData" [value]="item.value" [selected]="selectedItem === item.value" >
            {{item.text}}
        </option>
    </select>`
})

export class DropdownStaticComponent implements OnInit, OnChanges, OnDestroy {

    @Input() public inputData: Array<any>;
    @Input() public defaultSelected: boolean = true;
    @Input() public triggerUpdateOnChange: boolean = true;
    @Input() public defaultOption: any;
    @Input() public disabled: Boolean = false;
    @Input() public doTranslate: boolean = true;
    @Output() onSelect = new EventEmitter();

    public translateSubscription: Subscription;

    private defaultItem: String;
    public selectedItem: string;
    public isValid: boolean = true;

    constructor(
        private translate: TranslateService,
        private localeTranslateService: LocaleTranslationService,
        private riExchange: RiExchange
    ) { }

    public ngOnInit(): void {
        this.localeTranslateService.setUpTranslation();
    }

    public ngOnChanges(change: any): void {
        if (change.inputData) {
            this.populateDropDown();
        }
    }

    public populateDropDown(): void {
        let option: Object = {};

        if (!this.defaultSelected || this.defaultOption) {
            option = {
                text: (this.defaultOption) ? this.defaultOption.text : '',
                value: (this.defaultOption) ? this.defaultOption.value : ''
            };
            this.inputData.splice(0, 0, option);
        }
        if (this.inputData.length === 0) return;
        if (this.triggerUpdateOnChange) {
            this.updateSelectedItem();
        }
    }

    public updateSelectedItem(index?: number): void {
        let i: number = 0;
        if (index) {
            i = index;
        }
        if (this.inputData !== undefined && this.inputData !== null) {
            this.selectedItem = this.inputData[i].value;
            this.onSelect.emit(this.selectedItem);
        }
        else {
            return;
        }
    }

    public ngOnDestroy(): void {
        if (this.translateSubscription) {
            this.translateSubscription.unsubscribe();
        }
    }

    public onChange(): void {
        if (this.inputData) {
            this.onSelect.emit(this.selectedItem);
        }
    }
}
