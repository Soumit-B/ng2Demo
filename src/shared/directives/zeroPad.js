import { StaticUtils } from './../services/static.utility';
import { Directive, EventEmitter, ElementRef, HostListener, Output } from '@angular/core';
import { NgControl } from '@angular/forms';
export var ZeroPadDirective = (function () {
    function ZeroPadDirective(element, control) {
        this.element = element;
        this.control = control;
        this.changedFormat = new EventEmitter();
    }
    ZeroPadDirective.prototype.onChange = function (event) {
        this.format(event);
    };
    ZeroPadDirective.prototype.onKeyUp = function (event) {
        if (event.keyCode === 13) {
            this.format(event);
        }
    };
    ZeroPadDirective.prototype.format = function (event) {
        var elem = this.element.nativeElement;
        var value = elem.value;
        var maxLen = elem.maxLength;
        var pattern = /^(0*[1-9][0-9]*)$/;
        if (maxLen < 0) {
            maxLen = StaticUtils.c_i_DEFAULT_FORMAT_SIZE;
        }
        if (!value.length || !pattern.test(value)) {
            elem.value = '';
            return;
        }
        if (value.length < maxLen) {
            this.control.control.setValue(StaticUtils.fillLeadingZeros(value, maxLen));
        }
        this.changedFormat.next(event);
    };
    ZeroPadDirective.decorators = [
        { type: Directive, args: [{
                    selector: '[icabsZeroPad]'
                },] },
    ];
    ZeroPadDirective.ctorParameters = [
        { type: ElementRef, },
        { type: NgControl, },
    ];
    ZeroPadDirective.propDecorators = {
        'changedFormat': [{ type: Output },],
        'onChange': [{ type: HostListener, args: ['change', ['$event'],] },],
        'onKeyUp': [{ type: HostListener, args: ['keyup', ['$event'],] },],
    };
    return ZeroPadDirective;
}());
