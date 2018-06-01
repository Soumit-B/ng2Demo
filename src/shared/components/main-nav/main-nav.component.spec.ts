// Import test dependencies
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By }  from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

// Import component dependencies// Import test dependencies
import { MainNavComponent } from './main-nav.component';
import { AccordionModule } from 'ng2-bootstrap';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { LocalStorageService } from 'ng2-webstorage';
import { LocationStrategy } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { UserAccessService } from '../../services/user-access.service';
import { ErrorService } from '../../services/error.service';
import { Store } from '@ngrx/store';
import { MockRouter } from '../../mock/mock.router';
import { MockAuthService } from '../../mock/mock.auth.service';
import { MockUserAccessService } from '../../mock/mock.user-access.service';
import { MockErrorService } from '../../mock/mock.error.service';
import { MockActivatedRoute } from '../../mock/mock.activatedRoute';
import { MockStore } from '../../mock/mock.store';
import { MockDataConstants } from '../../mock/mock.data';

describe('Main Nav Component - ', () => {
    let compMainNav: MainNavComponent;
    let fixture: ComponentFixture<MainNavComponent>;
    let ls: LocalStorageService = new LocalStorageService();

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ AccordionModule, RouterModule ],
            declarations: [ MainNavComponent ],
            schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
            providers: [
                {provide: Router, useClass: MockRouter},
                {provide: AuthService, useClass: MockAuthService},
                {provide: UserAccessService, useClass: MockUserAccessService},
                {provide: ErrorService, useClass: MockErrorService},
                {provide: ActivatedRoute, useClass: MockActivatedRoute},
                {provide: Store, useClass: MockStore},
                LocalStorageService,
                LocationStrategy
            ]
        });

        fixture = TestBed.createComponent(MainNavComponent);
        compMainNav = fixture.componentInstance;
        ls.store('LEFTMENU', MockDataConstants.c_o_MockLeftMenuData);

        fixture.autoDetectChanges(true);
    });

    // Test Cases
    it('Should define the Main Nav component', () => {
        expect(compMainNav).toBeDefined(jasmine.any(MainNavComponent));
    });

    it('Should clear data in store', () => {
        MockStore.mockDispatchStatus = false;
        compMainNav.clearStore();

        expect(MockStore.mockDispatchStatus).toBeTruthy();
    });
});
