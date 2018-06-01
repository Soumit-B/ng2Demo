// Import test dependencies
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By }  from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

// Import component dependencies
import { SpinnerComponent } from './spinner';

describe('Spinner Component - ', () => {
    let compSpinner: SpinnerComponent;
    let fixture: ComponentFixture<SpinnerComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ SpinnerComponent ]
        });
        fixture = TestBed.createComponent(SpinnerComponent);
        compSpinner = fixture.componentInstance;
    });

    // Test Cases
    it('Should define the Spinner component', () => {
        expect(compSpinner).toBeDefined(jasmine.any(SpinnerComponent));
    });

    it('Should set isDelayedRunning to false', () => {
        compSpinner.isRunning = false;

        expect(compSpinner.isDelayedRunning).toBeFalsy();
    });
});
