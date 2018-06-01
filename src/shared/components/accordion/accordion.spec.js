import { TestBed } from '@angular/core/testing';
import { AccordionComponent } from './accordion';
import { AccordionModule } from 'ng2-bootstrap';
describe('Accordion Component - ', function () {
    var compAccordion;
    var fixture;
    beforeEach(function () {
        TestBed.configureTestingModule({
            imports: [AccordionModule],
            declarations: [AccordionComponent]
        });
        fixture = TestBed.createComponent(AccordionComponent);
        compAccordion = fixture.componentInstance;
        fixture.autoDetectChanges(true);
    });
    it('Should define the Accordion component', function () {
        expect(compAccordion).toBeDefined(jasmine.any(AccordionComponent));
    });
});
