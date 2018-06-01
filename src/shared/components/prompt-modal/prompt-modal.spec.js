import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { PromptModalComponent } from './prompt-modal';
import { ModalModule } from 'ng2-bootstrap';
describe('Prompt Modal Component - ', function () {
    var compPromptModal;
    var fixture;
    var elemDebug;
    var elemHTML;
    beforeEach(function () {
        TestBed.configureTestingModule({
            imports: [ModalModule],
            declarations: [PromptModalComponent]
        });
        fixture = TestBed.createComponent(PromptModalComponent);
        compPromptModal = fixture.componentInstance;
        fixture.autoDetectChanges(true);
    });
    it('Should define the Prompt Modal component', function () {
        expect(compPromptModal).toBeDefined(jasmine.any(PromptModalComponent));
    });
    it('Should show the modal', function () {
        compPromptModal.childModal.config.backdrop = false;
        compPromptModal.show({}, {
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
        compPromptModal.hide();
        elemDebug = fixture.debugElement.query(By.css('div.modal'));
        elemHTML = elemDebug.nativeElement;
        expect(elemHTML.classList).not.toContain('in');
    });
    it('Should call modal hide method on cancel', function () {
        spyOn(compPromptModal.childModal, 'hide');
        compPromptModal.cancel();
        expect(compPromptModal.childModal.hide).toHaveBeenCalled();
    });
    it('save should with value "save"', function () {
        spyOn(compPromptModal.saveEmit, 'emit');
        compPromptModal.save();
        expect(compPromptModal.saveEmit.emit).toHaveBeenCalledWith({ value: 'save' });
    });
});
