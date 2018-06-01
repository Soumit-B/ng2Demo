import { TestBed } from '@angular/core/testing';
import { EllipsisComponent } from './ellipsis';
import { ModalComponent } from '../modal/modal';
import { CUSTOM_ELEMENTS_SCHEMA, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { ModalModule } from 'ng2-bootstrap';
import { PageDataService } from '../../services/page-data.service';
import { MockRouter } from '../../mock/mock.router';
import { MockPageDataService } from '../../mock/mock.page-data.service';
describe('Ellipsis Component - ', function () {
    var compEllipsis;
    var fixture;
    var elemDebug;
    var elemHTML;
    beforeEach(function () {
        TestBed.configureTestingModule({
            imports: [ModalModule],
            declarations: [EllipsisComponent, ModalComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            providers: [
                { provide: Router, useClass: MockRouter },
                { provide: PageDataService, useClass: MockPageDataService },
                ViewContainerRef
            ]
        });
        fixture = TestBed.createComponent(EllipsisComponent);
        compEllipsis = fixture.componentInstance;
        fixture.autoDetectChanges(true);
    });
    it('Should define the Ellipsis component', function () {
        expect(compEllipsis).toBeDefined(jasmine.any(EllipsisComponent));
    });
});
