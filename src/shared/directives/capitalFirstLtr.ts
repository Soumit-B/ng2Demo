/**
 * @directive - CapitalFirstLtrDirective
 * @type - Attribute
 * Trigered with change and keyup event
 * Capitalize first letter of every word prsent in  input value
 * Emits event to handle on change
 * NOTES
 *  - On key up only formats the input when enter key is pressed.
 *  - If value is blank nothing will happend.
 */
import { Directive, EventEmitter, ElementRef, HostListener, Output } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
    selector: '[icabsCapitalFirstLtr]'
})
export class CapitalFirstLtrDirective {
    @Output() changedFormat: EventEmitter<any> = new EventEmitter();

    constructor(private element: ElementRef, private control: NgControl) {
    }

    // Event handlers - change and keyup
    @HostListener('change', ['$event']) onChange(event: any): void {
        this.apply(event);
    }

    @HostListener('keyup', ['$event']) onKeyUp(event: any): void {
        if (event.keyCode === 13) {
            this.apply(event);
        }
    }

    /**
     * Capitalize first letter of every word the input string value
     * @method - doApply
     * @param event - DOM event object
     * @return void
     */
    private apply(event: any): void {
        let elem: any = this.element.nativeElement,
            value: string = elem.value,
            char1: string, char2: string, finalStr: string, len: number;

        if (value && value.length > 0) {
            len = value.length;
            for (let i = 0; i < len; i++) {
                char1 = value.charAt(i);

                if (i === 0 && this.isChar(char1)) {
                    char1 = char1.toUpperCase();
                    finalStr += char1;
                } else if (i + 1 < len) {
                    finalStr += char1;
                    char2 = value.charAt(i + 1);
                    if (!this.isChar(char1) && this.isChar(char2)) {
                        char2 = char2.toUpperCase();
                        finalStr += char2;
                        i++;
                    }
                }
            }
            this.control.control.setValue(finalStr);
        }
        this.changedFormat.next(event);
    }

    private isChar(char: string): boolean {
        if ((char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z')) {
            return true;
        }
        return false;
    }
}
