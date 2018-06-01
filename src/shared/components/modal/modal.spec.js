import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ModalComponent } from './modal';
import { ModalModule } from 'ng2-bootstrap';
describe('Modal Component', function () {
    var compModal;
    var fixture;
    var elemDebug;
    var elemHTML;
    beforeEach(function () {
        TestBed.configureTestingModule({
            imports: [ModalModule],
            declarations: [ModalComponent]
        });
        fixture = TestBed.createComponent(ModalComponent);
        compModal = fixture.componentInstance;
        fixture.autoDetectChanges(true);
    });
    it('Should define the Modal component', function () {
        expect(compModal).toBeDefined(jasmine.any(ModalComponent));
    });
    it('Should show the modal', function () {
        compModal.childModal.config.backdrop = false;
        compModal.show({}, {
            error: {
                title: 'Mock Error Title',
                message: 'Mock Error Message'
            }
        });
        elemDebug = fixture.debugElement.query(By.css('div.modal'));
        elemHTML = elemDebug.nativeElement;
        expect(elemHTML.classList).toContain('modal' && 'in');
    });
    it('Should hide modal from DOM and emit close event on close', function () {
        spyOn(compModal.modalClose, 'emit');
        compModal.hide();
        elemDebug = fixture.debugElement.query(By.css('div.modal'));
        elemHTML = elemDebug.nativeElement;
        expect(elemHTML.classList).not.toContain('in');
        expect(compModal.modalClose.emit).toHaveBeenCalled();
    });
});
