/**
 * @directive - ZeroPadDirective
 * @type - Attribute
 * Trigered with change or keyup event
 * Prefills the input value with 0, if length is not same as max length
 * Emits event to handle on change
 * NOTES
 *  - On key up only formats the input when enter key is pressed
 *  - If value is blank breaks out
 *  - If entered value does not contain any non zero integer clears the input and breaks out of logic
 */
import { StaticUtils } from './../services/static.utility';
import { Directive, EventEmitter, ElementRef, HostListener, Output } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
    selector: '[icabsZeroPad]'
})
export class ZeroPadDirective {
    @Output() changedFormat: EventEmitter<any> = new EventEmitter();

    constructor(private element: ElementRef, private control: NgControl) {
    }

    // Event handlers - change and keyup
    @HostListener('change', ['$event']) onChange(event: any): void {
        this.format(event);
    }

    @HostListener('keyup', ['$event']) onKeyUp(event: any): void {
        if (event.keyCode === 13) {
            this.format(event);
        }
    }

    /**
     * Formats the input value
     * @method - format
     * @param event - DOM event object
     * @return void
     */
    private format(event: any): void {
        let elem: any = this.element.nativeElement;
        let value: string = elem.value;
        let maxLen: number = elem.maxLength;

        // Set to default size
        if (maxLen < 0) {
            maxLen = StaticUtils.c_i_DEFAULT_FORMAT_SIZE;
        }

        if (!value.length) {
            elem.value = '';
            return;
        }

        if (value.length < maxLen) {
            this.control.control.setValue(StaticUtils.fillLeadingZeros(value, maxLen));
        }

        this.changedFormat.next(event);
    }
}
