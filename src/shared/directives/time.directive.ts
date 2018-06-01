import { Directive, ElementRef, HostListener, Input, OnInit, OnDestroy } from '@angular/core';
import { NgControl, ControlContainer } from '@angular/forms';
import * as moment from 'moment';
import { GlobalizeService } from './../services/globalize.service';

@Directive({
    selector: '[eTypeTime]'
})
export class TimeDirective implements OnInit, OnDestroy {
    private valueSubscription: any;
    private statusSubscription: any;
    constructor(private el: ElementRef, private control: NgControl, private controlContainer: ControlContainer, private globalize: GlobalizeService) { }
    @HostListener('change', ['$event']) onChange(event: any): void {
        let value = this.el.nativeElement.value;
        this.updateFormControl(value, true);
    }
    @HostListener('focus', ['$event']) onFocus(event: any): void {
        this.removeValueSubscription();
    }
    @HostListener('blur', ['$event']) onBlur(event: any): void {
        this.addValueSubscription();
    }
    public ngOnInit(): void {
        this.initialCall();
        this.addValueSubscription();
    }
    public ngOnDestroy(): void {
        this.removeValueSubscription();
        if (this.statusSubscription) {
            this.statusSubscription.unsubscribe();
        }
    }
    private initialCall(): void {
        if (this.controlContainer && this.controlContainer['form'] && this.control && this.controlContainer['form'].controls[this.control.name]) {
            this.updateFormControl(this.controlContainer['form'].controls[this.control.name].value);
        }
    }
    private addValueSubscription(): void {
        this.removeValueSubscription();
        this.valueSubscription = this.control.valueChanges.distinctUntilChanged().subscribe((value) => {
            this.updateFormControl(value);
        });
    }
    private removeValueSubscription(): void {
        if (this.valueSubscription) {
            this.valueSubscription.unsubscribe();
        }
    }
    private updateFormControl(value: any, calledFromChange?: boolean): void {
        if (typeof value !== 'undefined' && value !== null && value !== '') {
            let formattedValue: any;
            formattedValue = this.globalize.formatTimeToLocaleFormat(value, calledFromChange);
            if (formattedValue === false) {
                this.setError();
            } else {
                this.controlContainer['form'].controls[this.control.name].setValue(formattedValue);
            }
        }
    }

    private setError(): void {
        this.controlContainer['form'].controls[this.control.name].markAsDirty();
        this.controlContainer['form'].controls[this.control.name].setErrors({
            status: 'INVALID'
        });
    }
}