import { Directive, Input, ElementRef, Renderer, Inject } from '@angular/core';
export var FocusDirective = (function () {
    function FocusDirective(element, renderer) {
        this.element = element;
        this.renderer = renderer;
    }
    FocusDirective.prototype.ngOnInit = function () {
        var _this = this;
        this.icabsDirFocus.subscribe(function (event) {
            _this.renderer.invokeElementMethod(_this.element.nativeElement, 'focus', []);
        });
    };
    FocusDirective.decorators = [
        { type: Directive, args: [{
                    selector: '[icabsDirFocus]'
                },] },
    ];
    FocusDirective.ctorParameters = [
        { type: ElementRef, decorators: [{ type: Inject, args: [ElementRef,] },] },
        { type: Renderer, },
    ];
    FocusDirective.propDecorators = {
        'icabsDirFocus': [{ type: Input, args: ['icabsDirFocus',] },],
    };
    return FocusDirective;
}());
