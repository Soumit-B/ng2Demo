import { DropdownComponent } from './dropdown';
import { HttpService } from './../../services/http-service';
import { TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MockHttpService } from '../../mock/mock.http-service';
describe('Dropdown component - ', function () {
    var comp;
    var fixture;
    var dropDownObject = {
        'id': 1
    };
    var itemsToDisplay;
    var inputArray;
    beforeEach(function () {
        TestBed.configureTestingModule({
            declarations: [DropdownComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            imports: [],
            providers: [
                { provide: HttpService, useClass: MockHttpService }
            ]
        });
        fixture = TestBed.createComponent(DropdownComponent);
        comp = fixture.componentInstance;
    });
    it('updateComponent should create a display text and items should match the supplied data', function () {
        comp.itemsToDisplay = ['1', '2', '3', '4', '5'];
        inputArray = ['one', 'two', 'three', 'four', 'five'];
        comp.updateComponent(inputArray);
        fixture.detectChanges();
        expect(comp.items.length).toBe(5);
    });
    it('updateComponent should create a display text if itemsToDisplay is not assigned, items to match data', function () {
        inputArray = ['one', 'two', 'three', 'four', 'five'];
        comp.updateComponent(inputArray);
        fixture.detectChanges();
        expect(comp.items[0]).toBe('one');
    });
});
