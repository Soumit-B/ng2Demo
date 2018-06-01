import { TestBed } from '@angular/core/testing';
import { SpinnerComponent } from './spinner';
describe('Spinner Component - ', function () {
    var compSpinner;
    var fixture;
    beforeEach(function () {
        TestBed.configureTestingModule({
            declarations: [SpinnerComponent]
        });
        fixture = TestBed.createComponent(SpinnerComponent);
        compSpinner = fixture.componentInstance;
    });
    it('Should define the Spinner component', function () {
        expect(compSpinner).toBeDefined(jasmine.any(SpinnerComponent));
    });
    it('Should set isDelayedRunning to false', function () {
        compSpinner.isRunning = false;
        expect(compSpinner.isDelayedRunning).toBeFalsy();
    });
});
