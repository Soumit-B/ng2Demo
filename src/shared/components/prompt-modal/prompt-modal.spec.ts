// Import test dependencies
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By }  from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

// Import component dependencies
import { PromptModalComponent } from './prompt-modal';
import { ModalModule } from 'ng2-bootstrap';

describe('Prompt Modal Component - ', () => {
    let compPromptModal: PromptModalComponent;
    let fixture: ComponentFixture<PromptModalComponent>;
    let elemDebug: DebugElement;
    let elemHTML: HTMLElement;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ ModalModule ],
            declarations: [ PromptModalComponent ]
        });
        fixture = TestBed.createComponent(PromptModalComponent);
        compPromptModal = fixture.componentInstance;
        fixture.autoDetectChanges(true);
    });

    // Test Cases
    it('Should define the Prompt Modal component', () => {
        expect(compPromptModal).toBeDefined(jasmine.any(PromptModalComponent));
    });

    it('Should show the modal', () => {
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

    it('Should hide modal from DOM and emit close event on close', () => {
        compPromptModal.hide();
        elemDebug = fixture.debugElement.query(By.css('div.modal'));
        elemHTML = elemDebug.nativeElement;

        expect(elemHTML.classList).not.toContain('in');
    });

    it('Should call modal hide method on cancel', () => {
        spyOn(compPromptModal.childModal, 'hide');
        compPromptModal.cancel();

        expect(compPromptModal.childModal.hide).toHaveBeenCalled();
    });

    it('save should with value "save"', () => {
        spyOn(compPromptModal.saveEmit, 'emit');
        compPromptModal.save();

        expect(compPromptModal.saveEmit.emit).toHaveBeenCalledWith({ value: 'save' });
    });
});
