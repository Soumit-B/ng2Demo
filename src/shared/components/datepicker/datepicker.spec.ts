// Import test dependencies
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By }  from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

// Import component dependencies
import { DatepickerComponent } from './datepicker';
import { FormsModule }   from '@angular/forms';
import { DatepickerModule } from 'ng2-bootstrap';

// Define constants
const dateFormatRegExpCorrect: any =  /^(0[1-9]|1\d|2\d|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/;
const dateFormatRegExpIncorrect: any =  /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/;

describe('Datepicker Component - ', () => {
    let compDatepicker: DatepickerComponent;
    let fixture: ComponentFixture<DatepickerComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [FormsModule, DatepickerModule],
            declarations: [DatepickerComponent]
        });
        fixture = TestBed.createComponent(DatepickerComponent);
        compDatepicker = fixture.componentInstance;
        fixture.autoDetectChanges(true);
    });

    // Test Cases
    it('Should define the Datepicker component', () => {
        expect(compDatepicker).toBeDefined(jasmine.any(DatepickerComponent));
    });

    it('Should return current date in milliseconds', () => {
        let today: Date = new Date();
        compDatepicker.dt = today;
        expect(compDatepicker.getDate()).toBe(today.getTime());
    });

    it('today() should return current date in format dd/mm/yyyy', () => {
        compDatepicker.today();
        expect(dateFormatRegExpCorrect.test(compDatepicker.dtDisplay)).toBeTruthy();
    });

    it('today() should not return current date in format mm/dd/yyyy', () => {
        compDatepicker.today();
        expect(dateFormatRegExpIncorrect.test(compDatepicker.dtDisplay)).toBeFalsy();
    });

    it('Should return status for tomorrow as "Fully"', () => {
        expect(compDatepicker.getDayClass(compDatepicker.tomorrow, 'day')).toBe('full');
    });

    it('Should return status for day after tomorrow as "partially"', () => {
        expect(compDatepicker.getDayClass(compDatepicker.afterTomorrow, 'day')).toBe('partially');
    });

    it('Should return disabled true for 6th day/Saturday of the week', () => {
        let todaysDate: Date = new Date();
        let dateForSaturdayOfWeek: Date = new Date();
        dateForSaturdayOfWeek.setDate(todaysDate.getDate() + (6 - todaysDate.getDay()));
        expect(compDatepicker.disabled(dateForSaturdayOfWeek, 'day')).toBeTruthy();
    });

    it('Should return disabled true for 0th day/Sunday of the week', () => {
        let todaysDate: Date = new Date();
        let dateForSundayOfWeek: Date = new Date();
        dateForSundayOfWeek.setDate(todaysDate.getDate() - todaysDate.getDay());
        expect(compDatepicker.disabled(dateForSundayOfWeek, 'day')).toBeTruthy();
    });

    it('Should return disabled false for Monday to Friday of the week', () => {
        let todaysDate: Date = new Date();
        let todaysDayOfWeek: number = todaysDate.getDay();
        let todaysDateOfMonth: number = todaysDate.getDate();
        let dateForWeekDay: Date = todaysDate;

        switch (todaysDayOfWeek) {
        case 0:
            dateForWeekDay.setDate(todaysDateOfMonth + 1);
            break;
        case 6:
            dateForWeekDay.setDate(todaysDateOfMonth - 1);
            break;
        }

        expect(compDatepicker.disabled(dateForWeekDay, 'day')).toBeFalsy();
    });

    it('Should open if disabled is false', () => {
        compDatepicker.isDisabled = false;
        compDatepicker.open();

        expect(compDatepicker.opened).toBeTruthy();
    });

    it('Should not open if disabled is true', () => {
        compDatepicker.isDisabled = true;
        compDatepicker.open();

        expect(compDatepicker.opened).toBeFalsy();
    });

    it('formatDate() Should return date in dd/mm/yyyy format', () => {
        let formattedDate = compDatepicker.formatDate(new Date());

        expect(dateFormatRegExpCorrect.test(formattedDate)).toBeTruthy();
    });

    it('Should set dtDisplay property to blank if invalid', () => {
        compDatepicker.invalid = true;
        compDatepicker.processDate({});
        expect(compDatepicker.dtDisplay).toBeFalsy();
    });

    it('Should set dtDisplay property to date if not invalid', () => {
        compDatepicker.invalid = false;
        compDatepicker.processDate({});
        expect(compDatepicker.dtDisplay).toBeTruthy();
    });

    it('isDate() should return false if "Invalid Date" string is passed', () => {
        expect(compDatepicker.isDate('Invalid Date')).toBeFalsy();
    });

    it('isDate() should return false if a "20170113" string is passed', () => {
        expect(compDatepicker.isDate('20170113')).toBeFalsy();
    });

    it('isDate() should return false if a 2017 number is passed', () => {
        expect(compDatepicker.isDate(2017)).toBeFalsy();
    });

    it('isDate() should return true if a "January 13, 2017" string is passed', () => {
        expect(compDatepicker.isDate('January 13, 2017')).toBeTruthy();
    });

    it('Should set dtDisplay property to blank if invalid date set', () => {
        compDatepicker.dtDisplay = 'invalid string assignment';
        compDatepicker.dateChange();
        expect(compDatepicker.dtDisplay).toBeFalsy();
    });

    it('Should set dt property to blank if a valid date set in dtDisplay property', () => {
        let today = new Date();

        compDatepicker.dtDisplay = today.toString();
        compDatepicker.dateChange();
        expect(compDatepicker.dt).toBe(compDatepicker.formatDate(today));
    });
});
