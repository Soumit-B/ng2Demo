// Import test dependencies
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

// Import component depedencies
import { HeaderComponent } from './header';
import { LocalStorageService } from 'ng2-webstorage';
import { MockAuthService } from '../../mock/mock.auth.service';
import { AuthService } from '../../services/auth.service';

describe('Header Component - ', () => {
  let compHeader: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let elemDebug: DebugElement;
  let elemHTML: HTMLElement;

  beforeEach(() => {
    window['gapi'] = {
      auth2: 'mock'
    };
  });

  beforeEach(() => {
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

  // Test Cases
  it('Should define the Header component', () => {
    expect(compHeader).toBeDefined(jasmine.any(HeaderComponent));
  });

  it('User flag not set Right hand side nav not available', () => {
    compHeader.displayUser = false;
    fixture.detectChanges();
    elemDebug = fixture.debugElement.query(By.css('ul'));
    expect(elemDebug).toBeFalsy();
  });

  it('User flag set Right hand side nav available', () => {
    compHeader.displayUser = true;
    fixture.detectChanges();
    elemDebug = fixture.debugElement.query(By.css('ul'));
    elemHTML = elemDebug.nativeElement;
    expect(elemHTML).toBeTruthy();
  });

  it('User name to be "John Doe"', () => {
    fixture.detectChanges();
    expect(compHeader.name).toBe('John Doe');
  });
});
