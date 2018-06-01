// Import test dependencies
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By }  from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

// Import component dependencies
import { ModalComponent } from './modal';
import { ModalModule, ComponentsHelper, ModalDirective } from 'ng2-bootstrap';
import { ViewContainerRef } from '@angular/core';

describe('Modal Component', () => {
    let compModal: ModalComponent;
    let fixture: ComponentFixture<ModalComponent>;
    let elemDebug: DebugElement;
    let elemHTML: HTMLElement;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ ModalModule ],
            declarations: [ ModalComponent ]
        });
        fixture = TestBed.createComponent(ModalComponent);
        compModal = fixture.componentInstance;
        fixture.autoDetectChanges(true);
    });

    it('Should define the Modal component', () => {
        expect(compModal).toBeDefined(jasmine.any(ModalComponent));
    });

    it('Should show the modal', () => {
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

    it('Should hide modal from DOM and emit close event on close', () => {
        spyOn(compModal.modalClose, 'emit');

        compModal.hide();
        elemDebug = fixture.debugElement.query(By.css('div.modal'));
        elemHTML = elemDebug.nativeElement;

        expect(elemHTML.classList).not.toContain('in');
        expect(compModal.modalClose.emit).toHaveBeenCalled();
    });
});
