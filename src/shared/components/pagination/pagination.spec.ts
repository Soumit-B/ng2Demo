// Import test dependencies
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By }  from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

// Import component dependencies
import { PaginationComponent } from './pagination';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { PaginationModule } from 'ng2-bootstrap';
import { Logger, LOGGER_LEVEL } from '@nsalaun/ng2-logger';
import { GlobalConstant } from '../../constants/global.constant';
import { AjaxObservableConstant } from '../../../shared/constants/ajax-observable.constant';

describe('Pagination Component - ', () => {
    let compPagination: PaginationComponent;
    let fixture: ComponentFixture<PaginationComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ PaginationModule ],
            declarations: [ PaginationComponent ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            providers: [
                {provide: LOGGER_LEVEL, useValue: 'LoggerLevel'},
                Logger,
                GlobalConstant,
                AjaxObservableConstant
            ]
        });
        fixture = TestBed.createComponent(PaginationComponent);
        compPagination = fixture.componentInstance;
        fixture.autoDetectChanges(true);
    });

    // Test Cases
    it('Should define the Pagination component', () => {
        expect(compPagination).toBeDefined(jasmine.any(PaginationComponent));
    });

    it('Should set current page number to 3', () => {
        compPagination.setPage(3);

        expect(compPagination.currentPage).toBe(3);
    });

    it('currentPageChanged should emit value as 3', () => {
        let emitterParam: Object = {
            page: 3
        };

        spyOn(compPagination.getCurrentPage, 'emit');

        compPagination.currentPageChanged(emitterParam);
        expect(compPagination.getCurrentPage.emit).toHaveBeenCalledWith({
            value: emitterParam['page']
        });
    });
});
