import { Directive, EventEmitter, ElementRef, HostListener, Output } from '@angular/core';
import { NgControl } from '@angular/forms';
export var CapitalFirstLtrDirective = (function () {
    function CapitalFirstLtrDirective(element, control) {
        this.element = element;
        this.control = control;
        this.changedFormat = new EventEmitter();
    }
    CapitalFirstLtrDirective.prototype.onChange = function (event) {
        this.apply(event);
    };
    CapitalFirstLtrDirective.prototype.onKeyUp = function (event) {
        if (event.keyCode === 13) {
            this.apply(event);
        }
    };
    CapitalFirstLtrDirective.prototype.apply = function (event) {
        var elem = this.element.nativeElement, value = elem.value, char1, char2, finalStr, len;
        if (value && value.length > 0) {
            len = value.length;
            for (var i = 0; i < len; i++) {
                char1 = value.charAt(i);
                if (i === 0 && this.isChar(char1)) {
                    char1 = char1.toUpperCase();
                    finalStr += char1;
                }
                else if (i + 1 < len) {
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
    };
    CapitalFirstLtrDirective.prototype.isChar = function (char) {
        if ((char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z')) {
            return true;
        }
        return false;
    };
    CapitalFirstLtrDirective.decorators = [
        { type: Directive, args: [{
                    selector: '[icabsCapitalFirstLtr]'
                },] },
    ];
    CapitalFirstLtrDirective.ctorParameters = [
        { type: ElementRef, },
        { type: NgControl, },
    ];
    CapitalFirstLtrDirective.propDecorators = {
        'changedFormat': [{ type: Output },],
        'onChange': [{ type: HostListener, args: ['change', ['$event'],] },],
        'onKeyUp': [{ type: HostListener, args: ['keyup', ['$event'],] },],
    };
    return CapitalFirstLtrDirective;
}());
