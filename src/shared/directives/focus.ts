import { Directive, Input, EventEmitter, ElementRef, Renderer, Inject, OnInit } from '@angular/core';

@Directive({
    selector: '[icabsDirFocus]'
})
export class FocusDirective implements OnInit {
    @Input('icabsDirFocus') icabsDirFocus: EventEmitter<boolean>;

    constructor( @Inject(ElementRef) private element: ElementRef, private renderer: Renderer) {
    }

    public ngOnInit(): void {
        this.icabsDirFocus.subscribe(event => {
            this.renderer.invokeElementMethod(this.element.nativeElement, 'focus', []);
        });
    }
}
