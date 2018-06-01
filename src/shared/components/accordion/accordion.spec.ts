// Import test dependencies
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By }  from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

// Import component dependencies
import { AccordionComponent } from './accordion';
import { AccordionModule } from 'ng2-bootstrap';

describe('Accordion Component - ', () => {
    let compAccordion: AccordionComponent;
    let fixture: ComponentFixture<AccordionComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ AccordionModule ],
            declarations: [ AccordionComponent ]
        });
        fixture = TestBed.createComponent(AccordionComponent);
        compAccordion = fixture.componentInstance;
        fixture.autoDetectChanges(true);
    });

    // Test Cases
    it('Should define the Accordion component', () => {
        expect(compAccordion).toBeDefined(jasmine.any(AccordionComponent));
    });
});
