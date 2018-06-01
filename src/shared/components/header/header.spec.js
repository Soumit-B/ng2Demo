import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { HeaderComponent } from './header';
import { LocalStorageService } from 'ng2-webstorage';
import { MockAuthService } from '../../mock/mock.auth.service';
import { AuthService } from '../../services/auth.service';
describe('Header Component - ', function () {
    var compHeader;
    var fixture;
    var elemDebug;
    var elemHTML;
    beforeEach(function () {
        window['gapi'] = {
            auth2: 'mock'
        };
    });
    beforeEach(function () {
        TestBed.configureTestingModule({
            declarations: [HeaderComponent],
            providers: [
                { provide: AuthService, useClass: MockAuthService },
                LocalStorageService
            ]
        });
        fixture = TestBed.createComponent(HeaderComponent);
        compHeader = fixture.componentInstance;
        elemDebug = fixture.debugElement.query(By.css('ul'));
    });
    it('Should define the Header component', function () {
        expect(compHeader).toBeDefined(jasmine.any(HeaderComponent));
    });
    it('User flag not set Right hand side nav not available', function () {
        compHeader.displayUser = false;
        fixture.detectChanges();
        elemDebug = fixture.debugElement.query(By.css('ul'));
        expect(elemDebug).toBeFalsy();
    });
    it('User flag set Right hand side nav available', function () {
        compHeader.displayUser = true;
        fixture.detectChanges();
        elemDebug = fixture.debugElement.query(By.css('ul'));
        elemHTML = elemDebug.nativeElement;
        expect(elemHTML).toBeTruthy();
    });
    it('User name to be "John Doe"', function () {
        fixture.detectChanges();
        expect(compHeader.name).toBe('John Doe');
    });
});
