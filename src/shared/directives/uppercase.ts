/**
 * @directive - UpperCaseDirective
 * @type - Attribute
 * Trigered with change or keyup event
 * Converts all alphabetic characters to uppercase
 * NOTES
 *  - On key up only formats the input when enter key is pressed
 *  - If value is blank breaks out
 */
import { StaticUtils } from './../services/static.utility';
import { Directive, ElementRef, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
    selector: '[icabsUpperCase]'
})
export class UpperCaseDirective {
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
        this.control.control.setValue(StaticUtils.toUpperCase(elem.value));
    }
}
