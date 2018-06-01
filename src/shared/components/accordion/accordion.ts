import { Component } from '@angular/core';

@Component({
    selector: 'icabs-accordion',
    templateUrl: 'accordion.html'
})

export class AccordionComponent {
    public oneAtATime: boolean = true;

    public status: Object = {
        isFirstOpen: true,
        isFirstDisabled: false
    };

    public groups: Array<any> = [
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
