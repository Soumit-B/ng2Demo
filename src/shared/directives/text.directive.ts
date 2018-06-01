import { Directive, ElementRef, HostListener, Input, OnInit, OnDestroy } from '@angular/core';
import { NgControl, ControlContainer, Validators, FormControl } from '@angular/forms';
import { Utils } from './../services/utility';

@Directive({
    selector: '[eTypeText]'
})
export class TextDirective implements OnInit, OnDestroy {
    private valueSubscription: any;
    private statusSubscription: any;
    constructor(private el: ElementRef, private control: NgControl, private controlContainer: ControlContainer, private utils: Utils) { }
    @HostListener('change', ['$event']) onChange(event: any): void {
        let value = this.el.nativeElement.value;
        this.updateFormControl(value);
    }
    @HostListener('focus', ['$event']) onFocus(event: any): void {
        this.removeValueSubscription();
    }
    @HostListener('blur', ['$event']) onBlur(event: any): void {
        this.addValueSubscription();
    }
    public ngOnInit(): void {
        // statement
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
    private updateFormControl(value: string): void {
        if (typeof value !== 'undefined' && value !== null && value !== '') {
            let isWhiteSpace = /^\s+$/.test(value);
            if (isWhiteSpace === true && this.required(this.controlContainer['form'].controls[this.control.name])) {
                this.setError();
            } else {
                this.controlContainer['form'].controls[this.control.name].setValue(this.utils.toTitleCase(value));
            }
        }
    }
    private setError(): void {
        this.controlContainer['form'].controls[this.control.name].markAsDirty();
        this.controlContainer['form'].controls[this.control.name].setErrors({
            status: 'INVALID'
        });
    }
    private required(control: any): boolean {
        let _validator: any = control.validator && control.validator(new FormControl());
        return _validator && _validator.required;
    }
}
