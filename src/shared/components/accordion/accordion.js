import { Component } from '@angular/core';
export var AccordionComponent = (function () {
    function AccordionComponent() {
        this.oneAtATime = true;
        this.status = {
            isFirstOpen: true,
            isFirstDisabled: false
        };
        this.groups = [
            {
                title: 'Dynamic Group Header - 1',
                content: 'Dynamic Group Body - 1'
            },
            {
                title: 'Dynamic Group Header - 2',
                content: 'Dynamic Group Body - 2'
            }
        ];
    }
    AccordionComponent.decorators = [
        { type: Component, args: [{
                    selector: 'icabs-accordion',
                    templateUrl: 'accordion.html'
                },] },
    ];
    AccordionComponent.ctorParameters = [];
    return AccordionComponent;
}());
