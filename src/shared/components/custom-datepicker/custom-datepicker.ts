import { RiExchange } from './../../services/riExchange';
import { Utils } from './../../services/utility';
import { Component, OnInit, Attribute, Provider, ViewChild, Input, ElementRef, Renderer, Output, EventEmitter, HostListener, SkipSelf, Host, Optional, AfterViewInit, OnChanges } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, Validator, AbstractControl, NG_VALIDATORS, FormControl, ControlContainer, Validators, NgModel } from '@angular/forms';
import * as moment from 'moment';
import { Logger } from '@nsalaun/ng2-logger';

@Component({
    selector: 'icabs-custom-datepicker',
    template: `
    <div class='date'>
        <div class="input-group datepicker-input-cont">
            <input #input type="text" class="form-control" size="10" maxlength="10" [(ngModel)]="inputValue" [ngClass]="control.touched ? 'ng-touched' : 'ng-untouched'" [required]="isRequired" [disabled]="this['control']['disabled']" (change)="onUpdate($event.target.value)" (blur)="onTouched($event)" (keypress)="onkeypress($event)">
            <span class="input-group-addon pointer" [ngClass]="this['control']['disabled']?'disabled':''" (click)="openPicker()">
                <span class="glyphicon glyphicon-calendar"></span>
            </span>
        </div>
        <datepicker #datepicker class="datepicker-cont"  [ngClass]="showDatepicker?'':'hidden'" [(ngModel)]="datePickerValue" [showWeeks]="false" ></datepicker>
    </div>
  `,
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: CustomDatepickerComponent,
        multi: true
    }, {
        provide: NG_VALIDATORS,
        useExisting: CustomDatepickerComponent,
        multi: true
    }],

    styles: [`
    datepicker {
      position: absolute;
      z-index: 10;
    }

    .input-group-addon {
        border-radius: 0;
        padding: 4px 12px;
    }

    .input-group-addon.disabled {
      cursor: not-allowed;
      opacity: 1;
    }

    .input-group-addon.disabled .glyphicon-calendar {
      opacity: 0.3;
    }
  `]
})
export class CustomDatepickerComponent implements ControlValueAccessor, Validator, OnInit, AfterViewInit {
    @ViewChild('input') input: ElementRef;
    @ViewChild('datepicker') dpicker: ElementRef;

    @Input() formControlName: string;
    @Output() public onChange = new EventEmitter();

    constructor(
        public el: ElementRef,
        public renderer: Renderer,
        public utils: Utils,
        public riExchange: RiExchange,
        public logger: Logger,
        @Optional() @Host() @SkipSelf()
        private controlContainer: ControlContainer
    ) { }

    private inputElem: any;
    private _inputValue: string;
    private _datePickerValue: Date;
    private _fieldInvalid: boolean = false;
    private _oldDateValue: Date;
    public showDatepicker: boolean = false;
    public control: any;
    private oldInputValue: string;
    public isRequired: boolean = false;
    private format: Array<any> = ['DD/MM/YYYY', 'YYYY/MM/DD', 'DD.MM.YYYY', 'shortDate'];

    @HostListener('document:click', ['$event.target']) onClick(targetElement: any): void {
        const clickedInside = this.el.nativeElement.contains(targetElement) || !document.contains(targetElement);
        if (!clickedInside) {
            this.showDatepicker = false;
        }
    }

    @HostListener('focus', ['$event.target']) onFocus(): void {
        this.inputElem.focus();
    }

    public onkeypress(ev: KeyboardEvent): void {
        switch (ev.keyCode) {
            case 42: //multiply
                ev.preventDefault();
                this.getToday();
                break;
            case 43: //add
                ev.preventDefault();
                this.addDay();
                break;
            case 45: //subtract
                ev.preventDefault();
                this.subtractDay();
                break;
        }
    }

    public ngOnInit(): void {
        if (this.controlContainer) {
            if (this.formControlName) {
                this.control = this.controlContainer.control.get(this.formControlName);
                this.renderer.setElementAttribute(this.el.nativeElement, 'id', this.formControlName);
            } else {
                this.logger.warn('Missing FormControlName directive from host element of the component');
            }
        } else {
            this.logger.warn('Can\'t find parent FormGroup directive');
        }
        this.isRequired = (this.control.validator === Validators.required) ? true : null;
    }

    public ngAfterViewInit(): void {
        this.control.statusChanges.subscribe((data) => {
            if (!this.control.validator) {
                this.isRequired = false;
            } else if (this.control.validator === Validators.required) {
                this.isRequired = true;
            }
            this.renderer.setElementClass(this.el.nativeElement, 'ng-invalid', this.isRequired);
            this.renderer.setElementClass(this.el.nativeElement, 'ng-valid', !this.isRequired);

            if (this.el.nativeElement.classList.contains('ng-touched')) {
                if (this.inputElem.classList.contains('ng-dirty')) {
                    this.renderer.setElementClass(this.inputElem, 'ng-dirty', true);
                    this.control.markAsDirty();
                }
                else {
                    this.control.markAsPristine();
                }
            } else {
                this.control.markAsPristine();
                this.renderer.setElementClass(this.inputElem, 'ng-dirty', false);
            }

        });
    }

    public onTouched = (_: any) => {
        this.logger.log('On Touch event');
    }

    public valueChange = (_: any) => {
        this.logger.log('Value Changed callback');
    }

    public validate(c: FormControl): any {
        return (!this._fieldInvalid) ? null : {
            jsonParseError: true
        };
    }

    public get inputValue(): any {
        return this._inputValue;
    }
    public set inputValue(value: any) {
        this._inputValue = value;
        this.valueChange(this._inputValue);
    }

    public get datePickerValue(): any {
        return this._datePickerValue;
    }

    public set datePickerValue(value: any) {
        this._datePickerValue = value;
        if (this.el.nativeElement.querySelectorAll('datepicker>datepicker-inner>div>daypicker')[0].children.length > 0) {
            if (this.showDatepicker) {
                this.inputValue = moment(this._datePickerValue).format('DD/MM/YYYY');
                this.renderer.setElementClass(this.inputElem, 'ng-dirty', true);
                this.showDatepicker = false;
                this._fieldInvalid = false;
                this.markAsError(false);
                this.emitOnChange();
            }
        }
    }

    public openPicker(): void {
        if (!this.control.disabled) {
            this.showDatepicker = !this.showDatepicker;
        }
    }

    public setFocus(): void {
        this.input.nativeElement.focus();
    }

    public onUpdate(dt: string): void {
        if (dt.indexOf('/') < 0 && dt.length === 6) {
            let dd = dt.slice(0, 2);
            let mm = dt.slice(2, 4);
            let yy = dt.slice(4, 6);

            dt = dd + '/' + mm + '/' + new Date().getFullYear().toString().slice(0, 2) + yy;
        }
        else if (dt.indexOf('/') < 0 && dt.length === 8) {
            let dd = dt.slice(0, 2);
            let mm = dt.slice(2, 4);
            let yyyy = dt.slice(4, 8);

            dt = dd + '/' + mm + '/' + yyyy;
        }

        this.inputValue = dt;
        this.convertDate(dt);
        if (!this._fieldInvalid && dt !== '') {
            this._datePickerValue = moment(this._inputValue, 'DD/MM/YYYY').toDate();
        }

        this.emitOnChange();
    }

    private emitOnChange(): void {
        this.onChange.emit({
            value: this._inputValue,
            fullDate: this._datePickerValue,
            valid: this._fieldInvalid ? 'invalid' : 'valid'
        });
    }

    public markAsError(isInvalid: boolean): void {
        this.renderer.setElementClass(this.el.nativeElement, 'ng-valid', !isInvalid);
        this.renderer.setElementClass(this.el.nativeElement, 'ng-invalid', isInvalid);

        this.renderer.setElementClass(this.inputElem, 'ng-valid', !isInvalid);
        this.renderer.setElementClass(this.inputElem, 'ng-invalid', isInvalid);
    }

    private convertDate(dt: string): void {
        if (dt.length === 10) {
            if (moment(dt, 'DD/MM/YYYY', true).isValid()) {
                this.inputValue = dt;
                this._fieldInvalid = false;
            }
            else if (moment(dt, 'MM/DD/YYYY', true).isValid()) {
                this.inputValue = moment(dt, 'MM/DD/YYYY').format('DD/MM/YYYY');
                this._fieldInvalid = false;
            }
            else if (moment(dt, 'YYYY/MM/DD', true).isValid()) {
                this.inputValue = moment(dt, 'YYYY/MM/DD').format('DD/MM/YYYY');
                this._fieldInvalid = false;
            }
            else if (moment(dt, 'YYYY/DD/MM', true).isValid()) {
                this.inputValue = moment(dt, 'YYYY/DD/MM').format('DD/MM/YYYY');
                this._fieldInvalid = false;
            }
            else {
                this.inputValue = '';
                this._fieldInvalid = true;
            }
        } else if (dt === '' && !this.isRequired) {
            this._fieldInvalid = false;
        } else {
            this.inputValue = '';
            this._fieldInvalid = true;
        }
        this.markAsError(this._fieldInvalid);
    }

    public subtractDay(): void {
        if (moment(this.inputValue, 'DD/MM/YYYY', true).isValid()) {
            let newDate = moment(this.inputValue, 'DD/MM/YYYY').subtract(1, 'days');
            this.onUpdate(newDate.format('DD/MM/YYYY'));
        }
    }

    public getToday(): void {
        this.onUpdate(this.utils.TodayAsDDMMYYYY());
    }

    public addDay(): void {
        if (moment(this.inputValue, 'DD/MM/YYYY', true).isValid()) {
            let newDate = moment(this.inputValue, 'DD/MM/YYYY').add(1, 'days');
            this.onUpdate(newDate.format('DD/MM/YYYY'));
        }
    }

    public writeValue(value: any): void {
        if (value !== this._inputValue) {
            this.inputElem = this.el.nativeElement.getElementsByTagName('input')[0];
            this.dpicker = this.el.nativeElement.getElementsByTagName('input')[0];
            this._inputValue = value;
            if (value) {
                this.convertDate(value);
                this.oldInputValue = this.inputValue;
                this._datePickerValue = moment(this._inputValue, 'DD/MM/YYYY').toDate();
            }
        }
    }

    public registerOnChange(fn: any): void {
        this.valueChange = fn;
    }

    public registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    public setDisabledState(isDisabled: boolean): void {
        this.renderer.setElementProperty(this.input.nativeElement, 'disabled', isDisabled);
    }
}
