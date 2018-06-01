// Import test dependencies
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By }  from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

// Import component dependencies
import { EllipsisComponent } from './ellipsis';
import { ModalComponent } from '../modal/modal';
import { CUSTOM_ELEMENTS_SCHEMA, ViewContainerRef, NgModule } from '@angular/core';
import { Router } from '@angular/router';
import { ModalModule } from 'ng2-bootstrap';
import { PageDataService } from '../../services/page-data.service';
import { MockRouter } from '../../mock/mock.router';
import { MockPageDataService } from '../../mock/mock.page-data.service';

describe('Ellipsis Component - ', () => {
    let compEllipsis: EllipsisComponent;
    let fixture: ComponentFixture<EllipsisComponent>;
    let elemDebug: DebugElement;
    let elemHTML: HTMLElement;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ ModalModule ],
            declarations: [ EllipsisComponent, ModalComponent ],
            schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
            providers: [
                {provide: Router, useClass: MockRouter},
                {provide: PageDataService, useClass: MockPageDataService},
                ViewContainerRef
            ]
        });
        fixture = TestBed.createComponent(EllipsisComponent);
        compEllipsis = fixture.componentInstance;
        fixture.autoDetectChanges(true);
    });

    // Test Cases
    it('Should define the Ellipsis component', () => {
        expect(compEllipsis).toBeDefined(jasmine.any(EllipsisComponent));
    });
});
