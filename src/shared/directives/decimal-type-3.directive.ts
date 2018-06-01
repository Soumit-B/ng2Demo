import { Directive, ElementRef, HostListener, Input, OnInit, OnDestroy } from '@angular/core';
import { NgControl, ControlContainer } from '@angular/forms';
import { GlobalizeService } from './../services/globalize.service';

@Directive({
    selector: '[eTypeDecimal3]'
})
export class DecimalType3Directive implements OnInit, OnDestroy {
    private valueSubscription: any;
    private statusSubscription: any;
    constructor(private el: ElementRef, private control: NgControl, private controlContainer: ControlContainer, private globalize: GlobalizeService) {}
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
            if (!calledFromChange) {
                let commaIndex = value.toString().indexOf(',');
                let dotIndex = value.toString().indexOf('.');
                if (commaIndex >= 0 && dotIndex >= 0 && dotIndex > commaIndex) {
                    value = value.toString().replace(/,/g, '');
                }
            }
            let formattedValue: any = this.globalize.formatDecimalToLocaleFormat(value, 3, calledFromChange);
            if (formattedValue === false) {
                this.controlContainer['form'].controls[this.control.name].markAsDirty();
                this.controlContainer['form'].controls[this.control.name].setErrors({
                    status: 'INVALID'
                });
            } else {
                this.controlContainer['form'].controls[this.control.name].setValue(formattedValue);
            }
        }
    }
}
