import { TestBed } from '@angular/core/testing';
import { TabsComponent } from './tabs';
import { CUSTOM_ELEMENTS_SCHEMA, ElementRef } from '@angular/core';
import { TabsModule } from 'ng2-bootstrap';
import { MockComponent } from './../../mock/mock.component';
import { MockDataConstants } from './../../mock/mock.data';
var MockElementRef = (function () {
    function MockElementRef() {
        this.nativeElement = {};
    }
    return MockElementRef;
}());
describe('Tabs Component - ', function () {
    var compTabs;
    var fixture;
    beforeEach(function () {
        TestBed.configureTestingModule({
            imports: [TabsModule],
            declarations: [TabsComponent],
            providers: [
                { provide: ElementRef, useValue: new MockElementRef() }
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        });
        fixture = TestBed.createComponent(TabsComponent);
        compTabs = fixture.componentInstance;
        compTabs.tabs = MockDataConstants.c_o_MockTabsData;
        compTabs.componentList = [MockComponent];
        fixture.autoDetectChanges(true);
    });
    it('Should define the Tabs component', function () {
        expect(compTabs).toBeDefined(jasmine.any(TabsComponent));
    });
    it('Should set active tab to 3', function () {
        expect(compTabs.tabs[3].active).toBeTruthy();
    });
});
