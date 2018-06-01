import { DropdownStaticComponent } from './dropdownstatic';
import { Component, Input, Output, EventEmitter, OnInit, NgModule  } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';


describe('Dropdownstatic component - ', () => {
    let comp: DropdownStaticComponent;
    let fixture: ComponentFixture<DropdownStaticComponent>;
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [DropdownStaticComponent],
            schemas: [],
            imports: [],
            providers: []
        });
        fixture = TestBed.createComponent(DropdownStaticComponent);
        comp = fixture.componentInstance;
        fixture.autoDetectChanges();
    });
});
