// Import test dependencies
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By }  from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

// Import component dependencies
import { TabsComponent } from './tabs';
import { GridComponent } from '../grid/grid';
import { CUSTOM_ELEMENTS_SCHEMA, ElementRef, Renderer, Component, NgModule } from '@angular/core';
import { TabsModule } from 'ng2-bootstrap';
import { HttpService } from './../../services/http-service';
import { MockHttpService } from './../../mock/mock.http-service';
import { GlobalConstant } from '../../constants/global.constant';
import { AjaxObservableConstant } from '../../../shared/constants/ajax-observable.constant';
import { Logger, LOGGER_LEVEL } from '@nsalaun/ng2-logger';
import { MockComponent } from './../../mock/mock.component';
import { MockDataConstants } from './../../mock/mock.data';

class MockElementRef implements ElementRef {
  nativeElement = {};
}

describe('Tabs Component - ', () => {
    let compTabs: TabsComponent;
    let fixture: ComponentFixture<TabsComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ TabsModule ],
            declarations: [ TabsComponent ],
            providers: [
                {provide: ElementRef, useValue: new MockElementRef()}
            ],
            schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
        });
        fixture = TestBed.createComponent(TabsComponent);
        compTabs = fixture.componentInstance;
        compTabs.tabs = MockDataConstants.c_o_MockTabsData;
        compTabs.componentList = [MockComponent];

        fixture.autoDetectChanges(true);
    });

    // Test Cases
    it('Should define the Tabs component', () => {
        expect(compTabs).toBeDefined(jasmine.any(TabsComponent));
    });

    it('Should set active tab to 3', () => {
        //compTabs.tabFocusTo(3);

        expect(compTabs.tabs[3].active).toBeTruthy();
    });
});
