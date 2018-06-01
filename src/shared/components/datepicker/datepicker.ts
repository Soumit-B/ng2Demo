import { Component, Input, Output, OnInit, AfterViewInit, OnChanges, OnDestroy, EventEmitter, NgZone, Optional, HostListener, SkipSelf, Host, ElementRef, Renderer, ViewChild } from '@angular/core';
import { FormsModule, Validators, ControlContainer, ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, FormControl } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { Logger } from '@nsalaun/ng2-logger';
import * as moment from 'moment';
import { RiExchange } from '../../../shared/services/riExchange';
import { Utils } from '../../../shared/services/utility';
import { GlobalizeService } from '../../../shared/services/globalize.service';

@Component({
    selector: 'icabs-datepicker',
    templateUrl: 'datepicker.html',
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: DatepickerComponent,
        multi: true
    }, {
        provide: NG_VALIDATORS,
        useExisting: DatepickerComponent,
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
export class DatepickerComponent implements ControlValueAccessor, OnInit, OnChanges, AfterViewInit, OnDestroy {
    @Input() public dt: any;
    @Input() public isDisabled: boolean;
    @Input() public isReadonly: boolean;
    @Input() public setFocus: boolean;
    @Input() public isRequired: boolean;
    @Input() public clearDate: boolean;
    @Input() public validate: boolean | Function;
    @Input() public initEmpty: boolean;
    @Input() public triggerChange: number;
    @Input() public uiFormGroup: FormGroup;
    @Input() public controlName: string;
    @Output() selectedValue = new EventEmitter();

    @ViewChild('input') input: ElementRef;
    @ViewChild('datepicker') dpicker: ElementRef;

    @Input() public isDirectiveBased: boolean = true;
    @Input() public formControlName: string;
    @Output() public onChange = new EventEmitter();

    public inputModelName: any;
    public dtDisplay: string | boolean;
    public isEmptyRequired: boolean = false;
    public randomId: string = '';
    public opened: boolean = false;
    public invalid: boolean = false;
    public uniqueIdentifier: number = 0;
    public static dateInstance: Array<any> = [];
    public static dateInstanceCounter: number = 0;
    public showDatepicker: boolean = false;
    public control: any;
    private inputElem: any;
    private _inputValue: string;
    private _datePickerValue: Date;
    private _fieldInvalid: boolean = false;
    private oldInputValue: string;
    public constructor(
        private zone: NgZone,
        private utils: Utils,
        private riExchange: RiExchange,
        private globalize: GlobalizeService,
        // Added for directice Datepicker
        public logger: Logger,
        public el: ElementRef,
        public renderer: Renderer,
        @Optional() @Host() @SkipSelf()
        private controlContainer: ControlContainer // To get current datePicker Component
    ) {
    }
    private datePickerOnClickRef: any;
    private documentOnClickRef: any;

    @HostListener('document:click', ['$event.target']) onClick(targetElement: any): void {
        if (this.isDirectiveBased) {
            return;
        }
        const clickedInside = this.el.nativeElement.contains(targetElement) || !document.contains(targetElement);
        if (!clickedInside) {
            this.showDatepicker = false;
        }
    }

    @HostListener('focus', ['$event.target']) onFocus(): void {
        if (this.isDirectiveBased) {
            return;
        }
        this.inputElem.focus();
    }

    ngOnInit(): void {
        if (!this.isDirectiveBased) {
            this['validate'] = (c: FormControl): any => {
                if (this.isDirectiveBased) {
                    return;
                }
                return (!this._fieldInvalid) ? null : {
                    jsonParseError: true
                };
            };
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
        } else {
            this.inputModelName = this.dtDisplay;
            //this.dpModelName = this.dt;
            if (this.initEmpty === null || this.initEmpty === undefined) {
                this.initEmpty = false;
            }

            this.randomId = 'id' + (Math.floor(Math.random() * 90000) + 10000).toString();
            this.dtDisplay = this.globalize.formatDateToLocaleFormat(this.dt);
            if (this.dtDisplay === false) {
                this.dtDisplay = '';
            }
            this.isDisabled = this.isDisabled || null;
            this.isReadonly = this.isReadonly || false;
            this.isRequired = this.isRequired || false;
            this.clearDate = this.clearDate || false;
            this.setFocus = this.setFocus || false;
            this.validate = this.validate || false;
            this.datePickerOnClickRef = this.onDatePickerClick.bind(this);
            this.documentOnClickRef = this.onDocumentClick.bind(this);
            DatepickerComponent.dateInstanceCounter++;
            this.uniqueIdentifier = DatepickerComponent.dateInstanceCounter;
            DatepickerComponent.saveInstance(this);
            document.addEventListener('click', this.documentOnClickRef);
            if (this.uiFormGroup && this.controlName) {
                if (this.uiFormGroup.controls && this.uiFormGroup.controls[this.controlName]) {
                    if (this.isDisabled === null || this.isDisabled === undefined) {
                        this.isDisabled = this.uiFormGroup.controls[this.controlName].disabled;
                    }
                    this.uiFormGroup.controls[this.controlName].statusChanges.subscribe((value) => {
                        if (this.isDisabled === null || this.isDisabled === undefined) {
                            this.isDisabled = this.uiFormGroup.controls[this.controlName].disabled;
                        }
                        if (this.uiFormGroup.controls[this.controlName].invalid === true && this.uiFormGroup.controls[this.controlName].dirty) {
                            this.validateDateField();
                        }
                        if (typeof this.uiFormGroup.controls[this.controlName].value === 'string') {
                            let dateObj: Date | boolean = this.globalize.parseDateStringToDate(this.uiFormGroup.controls[this.controlName].value);
                            if (dateObj) {
                                this.dt = dateObj;
                                this.dtDisplay = this.globalize.formatDateToLocaleFormat(this.dt);
                                this.invalid = false;
                            } else {
                                this.clear();
                                this.dtDisplay = '';
                            }
                        }
                    });
                }
            }
        }
    }

    ngAfterViewInit(): void {
        if (!this.isDirectiveBased) {
            this.control.statusChanges.subscribe((data) => {
                if (!this.control.validator) {
                    this.isRequired = false;
                } else if (this.control.validator === Validators.required) {
                    this.isRequired = true;
                }

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
            this.inputElem = this.el.nativeElement.getElementsByTagName('input')[0];
            this.dpicker = this.el.nativeElement.getElementsByTagName('datepicker')[0];
        }
        else {
            let el = document.querySelectorAll('.datepicker-input-cont');
            this.addEvent(el, 'click', this.datePickerOnClickRef);
        }
    }

    ngOnChanges(change: any): void {
        if (this.isDirectiveBased) {
            if (change.clearDate && change.clearDate.currentValue === true) {
                this.dtDisplay = '';
                this.clear();
                if (!(this.uiFormGroup && this.uiFormGroup.controls && this.controlName)) {
                    this.processDate();
                } else {
                    if (this.uiFormGroup.controls[this.controlName]) {
                        this.uiFormGroup.controls[this.controlName].setValue(this.globalize.parseDateToFixedFormat(this.dtDisplay as string));
                    }
                }
                return;
            }
            if (change.validate && change.validate.currentValue === true) {
                this.validateDateField();
            }
            if (change.isDisabled && change.isDisabled.currentValue === true) {
                this.resetDateField();
            }
            if (this.dt && this.dt.toString() === 'Invalid Date') {
                this.invalid = true;
                this.dt = new Date();
                this.dtDisplay = '';
                if (!(this.uiFormGroup && this.uiFormGroup.controls && this.controlName)) {
                    this.processDate(this.dt);
                } else {
                    if (this.uiFormGroup.controls[this.controlName]) {
                        this.uiFormGroup.controls[this.controlName].setValue(this.globalize.parseDateToFixedFormat(this.dtDisplay as string));
                    }
                }
                setTimeout(() => {
                    this.invalid = false;
                    //this.dt = null;
                }, 500);
                //this.dtDisplay = '';
            } else if (!this.dt) {
                this.invalid = true;
                this.clear();
                this.dtDisplay = '';
                if (!(this.uiFormGroup && this.uiFormGroup.controls && this.controlName)) {
                    this.processDate();
                } else {
                    if (this.uiFormGroup.controls[this.controlName]) {
                        this.uiFormGroup.controls[this.controlName].setValue(this.globalize.parseDateToFixedFormat(this.dtDisplay as string));
                    }
                }
                setTimeout(() => {
                    this.invalid = false;
                }, 500);
            } else {
                if (typeof this.dt === 'string') {
                    this.dt = this.globalize.parseDateStringToDate(this.dt);
                    if (!this.dt) {
                        this.clear();
                        this.dtDisplay = '';
                        this.processDate();
                        return;
                    }
                }
                this.invalid = false;
                this.dtDisplay = this.globalize.formatDateToLocaleFormat(this.dt);
                if (!(this.uiFormGroup && this.uiFormGroup.controls && this.controlName)) {
                    this.processDate(this.dt);
                } else {
                    if (this.uiFormGroup.controls[this.controlName]) {
                        this.uiFormGroup.controls[this.controlName].setValue(this.globalize.parseDateToFixedFormat(this.dtDisplay as string));
                    }
                }
            }
        }
    }

    ngOnDestroy(): void {
        let el = document.querySelectorAll('.datepicker-input-cont');
        document.removeEventListener('click', this.documentOnClickRef);
        this.removeEvent(el, 'click', this.datePickerOnClickRef);
    }

    public static saveInstance(instance: any): void {
        DatepickerComponent.dateInstance.push(instance);
        for (let i = 0; i < DatepickerComponent.dateInstance.length; i++) {
            document.removeEventListener('click', DatepickerComponent.dateInstance[i].documentOnClickRef);
        }
    }

    public validateDateField(): void {
        if (this.randomId) {
            let elem = document.querySelector('#' + this.randomId);
            if (elem) {
                this.utils.removeClass(elem, 'ng-untouched');
                this.utils.addClass(elem, 'ng-touched');
            }
            elem = null;
        }
    }

    public resetDateField(): void {
        if (this.randomId) {
            let elem = document.querySelector('#' + this.randomId);
            if (elem) {
                this.utils.removeClass(elem, 'ng-touched');
                this.utils.addClass(elem, 'ng-untouched');
            }
            elem = null;
        }
    }

    // Function that triggers when clicking on calendar icons, it closes all other datepicker instances in the page
    public open(): void {
        if (!this.isDisabled) {
            if (DatepickerComponent.dateInstance) {
                for (let i = 0; i < DatepickerComponent.dateInstance.length; i++) {
                    if (this.uniqueIdentifier !== DatepickerComponent.dateInstance[i].uniqueIdentifier) {
                        DatepickerComponent.dateInstance[i].opened = false;
                    }
                }
            }
            this.opened = !this.opened;
            let el = document.querySelectorAll('.datepicker-cont');
            if (this.opened === true) {
                this.removeEvent(el, 'click', this.onDatePickerClick.bind(this));
                this.addEvent(el, 'click', this.onDatePickerClick.bind(this));
            } else {
                this.removeEvent(el, 'click', this.onDatePickerClick.bind(this));
            }
        }
    }
    public clear(): void {
        this.dt = void 0;
    }

    public setFormControl(): void {
        if (this.uiFormGroup && this.controlName) {
            if (this.uiFormGroup.controls && this.uiFormGroup.controls[this.controlName]) {
                this.uiFormGroup.controls[this.controlName].setValue(this.globalize.parseDateToFixedFormat(this.dtDisplay as string));
            }
        }
    }

    public processDate(event?: any, triggerFlag?: boolean): void {
        if (this.invalid === true) {
            this.dtDisplay = '';
        } else {
            if (this.dt !== null && this.dt !== undefined && this.dt !== 0) {
                this.dtDisplay = triggerFlag === true ? this.globalize.formatDateToLocaleFormat(this.dt, true) : this.globalize.formatDateToLocaleFormat(this.dt);
            }
            //this.opened = false;
        }
        if (event && typeof event === 'object') {
            this.dt = event;
            this.dtDisplay = triggerFlag === true ? this.globalize.formatDateToLocaleFormat(this.dt, true) : this.globalize.formatDateToLocaleFormat(this.dt);
        }
        if (this.dtDisplay === false) {
            this.dtDisplay = '';
            this.validateDateField();
        }
        this.setFormControl();
        this.triggerEmmitter((triggerFlag) ? true : false);
    }

    public dateChange(): void {
        this.invalid = false;
        if (this.dtDisplay === '*') {
            this.dt = new Date();
            this.dtDisplay = this.globalize.formatDateToLocaleFormat(this.dt, true);
        } else {
            this.dtDisplay = this.globalize.formatDateToLocaleFormat(this.dtDisplay as string, true);
        }
        if (!this.dtDisplay) {
            this.dtDisplay = '';
        } else {
            this.dt = this.globalize.parseDateStringToDate(this.dtDisplay as string);
        }
        this.setFormControl();
        this.triggerEmmitter(true);
    }

    public changeDateOnKeyDown(event: any): void {
        if (!this.isDirectiveBased) {
            this.onkeypress(event);
        }
        else {
            let keyCode: any;
            event = event || window.event;
            keyCode = event.which || event.keyCode;
            if (this.dtDisplay !== '') {
                if (keyCode === 107) {
                    if (this.dt instanceof Date) {
                        this.dt.setDate(this.dt.getDate() + 1);
                        this.dtDisplay = this.globalize.formatDateToLocaleFormat(this.dt);
                        event.preventDefault();
                    }
                }
                else if (keyCode === 109) {
                    if (this.dt instanceof Date) {
                        this.dt.setDate(this.dt.getDate() - 1);
                        this.dtDisplay = this.globalize.formatDateToLocaleFormat(this.dt);
                        event.preventDefault();
                    }
                }
                if (this.dt instanceof Date && (keyCode === 107 || keyCode === 109)) {
                    this.setFormControl();
                    this.triggerEmmitter(true);
                }
            }
            if (keyCode === 106 || (event.shiftKey === true && keyCode === 56)) {
                this.dt = new Date();
                this.dtDisplay = this.globalize.formatDateToLocaleFormat(this.dt);
                this.setFormControl();
                this.triggerEmmitter(true);
                event.preventDefault();
            }
            //this.dtDisplay = this.dtDisplay.replace(/\+|\-|\*/g, '');
        }
    }

    public onDatePickerClick(event: any): void {
        event.stopPropagation();
    }

    public onDocumentClick(event: any): void {
        setTimeout(() => {
            this.opened = false;
            for (let i = 0; i < DatepickerComponent.dateInstance.length; i++) {
                DatepickerComponent.dateInstance[i].opened = false;
            }
        }, 100);
    }

    public selectionDone(event: any): void {
        if (this.isDirectiveBased) {
            this.opened = false;
            this.processDate(event, true);
        } else {
            setTimeout(() => {
                let validDate: string | boolean = this.globalize.formatDateToLocaleFormat(this._datePickerValue, true);
                if (validDate === false) {
                    this.inputValue = '';
                    this._fieldInvalid = true;
                    if (this.isRequired) {
                        this.markAsError(this._fieldInvalid);
                        if (this.inputElem) {
                            this.renderer.setElementClass(this.inputElem, 'ng-touched', true);
                            this.renderer.setElementClass(this.inputElem, 'ng-untouched', false);
                        }
                    }
                } else {
                    this._fieldInvalid = false;
                }
            }, 0);
        }
    }

    public addEvent(el: any, type: any, handler: any): void {
        for (let i = 0; i < el.length; i++) {
            if (el[i].attachEvent) el[i].attachEvent('on' + type, handler); else el[i].addEventListener(type, handler);
        }
    }
    public removeEvent(el: any, type: any, handler: any): void {
        for (let i = 0; i < el.length; i++) {
            if (el[i].detachEvent) el[i].detachEvent('on' + type, handler); else el[i].removeEventListener(type, handler);
        }

    }
    private triggerEmmitter(trigger: boolean): void {
        this.selectedValue.emit({
            value: this.globalize.parseDateToFixedFormat(this.dtDisplay as string),
            trigger: trigger
        });
    }
    /**********************************************Directive Based Code Starts*******************************/

    public onkeypress(ev: KeyboardEvent): void {
        switch (ev.keyCode) {
            case 56:
                if (ev.shiftKey === true) {
                    ev.preventDefault();
                    this.getToday();
                }
                break;
            case 106:
                ev.preventDefault();
                this.getToday();
                break;
            case 107: //add
                ev.preventDefault();
                this.addDay();
                break;
            case 109: //subtract
                ev.preventDefault();
                this.subtractDay();
                break;
        }
    }

    public onTouched = (_: any) => {
        this.logger.log('On Touch event');
    }

    public valueChange = (_: any) => {
        this.logger.log('Value Changed callback');
    }

    public get inputValue(): any {
        return this._inputValue;
    }
    public set inputValue(value: any) {
        this._inputValue = value;
        if (!this.isDirectiveBased) {
            this.valueChange(this._inputValue);
        }
    }

    public get datePickerValue(): any {
        return this._datePickerValue;
    }

    public set datePickerValue(value: any) {
        this._datePickerValue = value;
        if (this.el.nativeElement.querySelectorAll('datepicker>datepicker-inner>div>daypicker')[0].children.length > 0) {
            if (this.showDatepicker) {
                this.inputValue = this.globalize.formatDateToLocaleFormat(this._datePickerValue);
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

    public onUpdate(dt: Date | string, calledFromChange?: boolean): void {
        let dateVal;
        dateVal = calledFromChange === true ? this.globalize.formatDateToLocaleFormat(dt, true) : this.globalize.formatDateToLocaleFormat(dt);
        this.convertDate(dateVal);
        if (!this._fieldInvalid && dateVal !== '') {
            let dateObj = this.globalize.parseDateStringToDate(dateVal);
            if (dateObj instanceof Date) {
                this._datePickerValue = dateObj;
            }
        }

        this.emitOnChange();
    }

    private emitOnChange(): void {
        this.onChange.emit({
            value: this.globalize.parseDateToFixedFormat(this._inputValue as string),
            fullDate: this._datePickerValue,
            valid: this._fieldInvalid ? 'invalid' : 'valid'
        });
    }

    public markAsError(isInvalid: boolean): void {
        if (!this.inputElem) return;

        this.renderer.setElementClass(this.el.nativeElement, 'ng-valid', !isInvalid);
        this.renderer.setElementClass(this.el.nativeElement, 'ng-invalid', isInvalid);

        this.renderer.setElementClass(this.inputElem, 'ng-valid', !isInvalid);
        this.renderer.setElementClass(this.inputElem, 'ng-invalid', isInvalid);
    }

    private convertDate(dt: string | boolean): void {
        if (dt) {
            this.inputValue = dt;
            this._fieldInvalid = false;
        } else {
            if (this.isRequired && dt === '') {
                this._fieldInvalid = true;
            } else {
                this._fieldInvalid = false;
            }
            this.inputValue = '';
        }
        this.markAsError(this._fieldInvalid);
    }

    public subtractDay(): void {
        let newDate: any = this.globalize.parseDateStringToDate(this.inputValue);
        if (newDate instanceof Date) {
            newDate.setDate(newDate.getDate() - 1);
        }
        this.onUpdate(newDate);
    }

    public getToday(): void {
        this.onUpdate(new Date());
    }

    public addDay(): void {
        let newDate: any = this.globalize.parseDateStringToDate(this.inputValue);
        if (newDate instanceof Date) {
            newDate.setDate(newDate.getDate() + 1);
        }
        this.onUpdate(newDate);
    }

    public writeValueInternals(value: any): void {
        this.convertDate(this.globalize.formatDateToLocaleFormat(value));
        this.oldInputValue = this.inputValue;
        let dateObj = this.globalize.parseDateStringToDate(this._inputValue);
        if (dateObj instanceof Date) {
            this._datePickerValue = dateObj;
        }
    }

    public writeValue(value: any): void {
        if (this.isDirectiveBased) {
            return;
        }

        if (value !== this._inputValue) {
            let prevDateObj = this.globalize.parseDateStringToDate(this.inputValue);
            let currDateObj = this.globalize.parseDateStringToDate(value);
            if (prevDateObj instanceof Date && currDateObj instanceof Date && (+prevDateObj) === (+currDateObj)) {
                return;
            }
            this._inputValue = value;
            if (value) {
                this.writeValueInternals(value);
            }

        }
    }

    public registerOnChange(fn: any): void {
        if (this.isDirectiveBased) {
            return;
        }
        this.valueChange = fn;
    }

    public registerOnTouched(fn: any): void {
        if (this.isDirectiveBased) {
            return;
        }
        this.onTouched = fn;
    }

    public setDisabledState(isDisabled: boolean): void {
        if (this.input)
            this.renderer.setElementProperty(this.input.nativeElement, 'disabled', isDisabled);
    }
    /***********************************Directive Based Code Ends*****************************************/
}
