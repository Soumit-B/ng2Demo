import { TestBed } from '@angular/core/testing';
import { DatepickerComponent } from './datepicker';
import { FormsModule } from '@angular/forms';
import { DatepickerModule } from 'ng2-bootstrap';
var dateFormatRegExpCorrect = /^(0[1-9]|1\d|2\d|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/;
var dateFormatRegExpIncorrect = /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/;
describe('Datepicker Component - ', function () {
    var compDatepicker;
    var fixture;
    beforeEach(function () {
        TestBed.configureTestingModule({
            imports: [FormsModule, DatepickerModule],
            declarations: [DatepickerComponent]
        });
        fixture = TestBed.createComponent(DatepickerComponent);
        compDatepicker = fixture.componentInstance;
        fixture.autoDetectChanges(true);
    });
    it('Should define the Datepicker component', function () {
        expect(compDatepicker).toBeDefined(jasmine.any(DatepickerComponent));
    });
    it('Should return current date in milliseconds', function () {
        var today = new Date();
        compDatepicker.dt = today;
        expect(compDatepicker.getDate()).toBe(today.getTime());
    });
    it('today() should return current date in format dd/mm/yyyy', function () {
        compDatepicker.today();
        expect(dateFormatRegExpCorrect.test(compDatepicker.dtDisplay)).toBeTruthy();
    });
    it('today() should not return current date in format mm/dd/yyyy', function () {
        compDatepicker.today();
        expect(dateFormatRegExpIncorrect.test(compDatepicker.dtDisplay)).toBeFalsy();
    });
    it('Should return status for tomorrow as "Fully"', function () {
        expect(compDatepicker.getDayClass(compDatepicker.tomorrow, 'day')).toBe('full');
    });
    it('Should return status for day after tomorrow as "partially"', function () {
        expect(compDatepicker.getDayClass(compDatepicker.afterTomorrow, 'day')).toBe('partially');
    });
    it('Should return disabled true for 6th day/Saturday of the week', function () {
        var todaysDate = new Date();
        var dateForSaturdayOfWeek = new Date();
        dateForSaturdayOfWeek.setDate(todaysDate.getDate() + (6 - todaysDate.getDay()));
        expect(compDatepicker.disabled(dateForSaturdayOfWeek, 'day')).toBeTruthy();
    });
    it('Should return disabled true for 0th day/Sunday of the week', function () {
        var todaysDate = new Date();
        var dateForSundayOfWeek = new Date();
        dateForSundayOfWeek.setDate(todaysDate.getDate() - todaysDate.getDay());
        expect(compDatepicker.disabled(dateForSundayOfWeek, 'day')).toBeTruthy();
    });
    it('Should return disabled false for Monday to Friday of the week', function () {
        var todaysDate = new Date();
        var todaysDayOfWeek = todaysDate.getDay();
        var todaysDateOfMonth = todaysDate.getDate();
        var dateForWeekDay = todaysDate;
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
    it('Should open if disabled is false', function () {
        compDatepicker.isDisabled = false;
        compDatepicker.open();
        expect(compDatepicker.opened).toBeTruthy();
    });
    it('Should not open if disabled is true', function () {
        compDatepicker.isDisabled = true;
        compDatepicker.open();
        expect(compDatepicker.opened).toBeFalsy();
    });
    it('formatDate() Should return date in dd/mm/yyyy format', function () {
        var formattedDate = compDatepicker.formatDate(new Date());
        expect(dateFormatRegExpCorrect.test(formattedDate)).toBeTruthy();
    });
    it('Should set dtDisplay property to blank if invalid', function () {
        compDatepicker.invalid = true;
        compDatepicker.processDate();
        expect(compDatepicker.dtDisplay).toBeFalsy();
    });
    it('Should set dtDisplay property to date if not invalid', function () {
        compDatepicker.invalid = false;
        compDatepicker.processDate();
        expect(compDatepicker.dtDisplay).toBeTruthy();
    });
    it('isDate() should return false if "Invalid Date" string is passed', function () {
        expect(compDatepicker.isDate('Invalid Date')).toBeFalsy();
    });
    it('isDate() should return false if a "20170113" string is passed', function () {
        expect(compDatepicker.isDate('20170113')).toBeFalsy();
    });
    it('isDate() should return false if a 2017 number is passed', function () {
        expect(compDatepicker.isDate(2017)).toBeFalsy();
    });
    it('isDate() should return true if a "January 13, 2017" string is passed', function () {
        expect(compDatepicker.isDate('January 13, 2017')).toBeTruthy();
    });
    it('Should set dtDisplay property to blank if invalid date set', function () {
        compDatepicker.dtDisplay = "invalid string assignment";
        compDatepicker.dateChange();
        expect(compDatepicker.dtDisplay).toBeFalsy();
    });
    it('Should set dt property to blank if a valid date set in dtDisplay property', function () {
        var today = new Date();
        compDatepicker.dtDisplay = today.toString();
        compDatepicker.dateChange();
        expect(compDatepicker.dt).toBe(compDatepicker.formatDate(today));
    });
});
