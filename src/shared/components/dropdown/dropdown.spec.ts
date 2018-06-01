import { Http, ConnectionBackend, RequestOptions } from '@angular/http';
import { DropdownComponent } from './dropdown';
import { HttpService } from './../../services/http-service';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By }              from '@angular/platform-browser';
import { DebugElement, CUSTOM_ELEMENTS_SCHEMA }    from '@angular/core';
import { MockHttpService } from '../../mock/mock.http-service';

describe('Dropdown component - ', () => {
    let comp: DropdownComponent;
    let fixture: ComponentFixture<DropdownComponent>;
    let dropDownObject = {
        'id': 1
    };
    let itemsToDisplay: Array<any>;
    let inputArray: Array<any>;
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [DropdownComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            imports: [],
            providers: [
                {provide: HttpService, useClass: MockHttpService}
            ]
        });
        fixture = TestBed.createComponent(DropdownComponent);
        comp = fixture.componentInstance;
    });

    it('updateComponent should create a display text and items should match the supplied data', () => {
        comp.itemsToDisplay = ['1','2','3','4','5'];
        inputArray = ['one','two','three','four','five'];
        comp.updateComponent(inputArray);
        fixture.detectChanges();
        expect(comp.items.length).toBe(5);
    });
    it('updateComponent should create a display text if itemsToDisplay is not assigned, items to match data', () => {
        inputArray = ['one','two','three','four','five'];
        comp.updateComponent(inputArray);
        fixture.detectChanges();
        expect(comp.items[0]).toBe('one');
    });
});
