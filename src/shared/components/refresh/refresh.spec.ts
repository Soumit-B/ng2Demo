// Import test dependencies
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By }  from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

// Import component dependencies
import { RefreshComponent } from './refresh';
import { Logger, LOGGER_LEVEL } from '@nsalaun/ng2-logger';
import { MockEvent } from '../../mock/mock.event';

describe('Spinner Component - ', () => {
    let compRefresh: RefreshComponent;
    let fixture: ComponentFixture<RefreshComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ RefreshComponent ],
            providers: [
                {provide: LOGGER_LEVEL, useValue: 'LoggerLevel'},
                Logger
            ]
        });
        fixture = TestBed.createComponent(RefreshComponent);
        compRefresh = fixture.componentInstance;
    });

    // Test Cases
    it('Should define the Refresh component', () => {
        expect(compRefresh).toBeDefined(jasmine.any(RefreshComponent));
    });

    it('Should emit onRefresh', () => {
        let mockEvent: MockEvent = new MockEvent();
        spyOn(compRefresh.onRefresh, 'emit');

        compRefresh.refresh(mockEvent);

        expect(compRefresh.onRefresh.emit).toHaveBeenCalled();
    });
});
