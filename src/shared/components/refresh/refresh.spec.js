import { TestBed } from '@angular/core/testing';
import { RefreshComponent } from './refresh';
import { Logger, LOGGER_LEVEL } from '@nsalaun/ng2-logger';
import { MockEvent } from '../../mock/mock.event';
describe('Spinner Component - ', function () {
    var compRefresh;
    var fixture;
    beforeEach(function () {
        TestBed.configureTestingModule({
            declarations: [RefreshComponent],
            providers: [
                { provide: LOGGER_LEVEL, useValue: 'LoggerLevel' },
                Logger
            ]
        });
        fixture = TestBed.createComponent(RefreshComponent);
        compRefresh = fixture.componentInstance;
    });
    it('Should define the Refresh component', function () {
        expect(compRefresh).toBeDefined(jasmine.any(RefreshComponent));
    });
    it('Should emit onRefresh', function () {
        var mockEvent = new MockEvent();
        spyOn(compRefresh.onRefresh, 'emit');
        compRefresh.refresh(mockEvent);
        expect(compRefresh.onRefresh.emit).toHaveBeenCalled();
    });
});
