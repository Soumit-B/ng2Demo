import { DropdownStaticComponent } from './dropdownstatic';
import { TestBed } from '@angular/core/testing';
describe('Dropdownstatic component - ', function () {
    var comp;
    var fixture;
    beforeEach(function () {
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
