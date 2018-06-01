import { Component, Input, Output, EventEmitter, NgZone } from '@angular/core';
import { RiExchange } from '../../../shared/services/riExchange';
import { Utils } from '../../../shared/services/utility';
export var DatepickerComponent = (function () {
    function DatepickerComponent(zone, utils, riExchange) {
        this.zone = zone;
        this.utils = utils;
        this.riExchange = riExchange;
        this.selectedValue = new EventEmitter();
        this.isEmptyRequired = false;
        this.randomId = '';
        this.minDate = void 0;
        this.formats = ['DD/MM/YYYY', 'YYYY/MM/DD', 'DD.MM.YYYY', 'shortDate'];
        this.format = this.formats[0];
        this.dateOptions = {
            formatYear: 'YY',
            startingDay: 1
        };
        this.opened = false;
        this.invalid = false;
        this.uniqueIdentifier = 0;
        (this.tomorrow = new Date()).setDate(this.tomorrow.getDate() + 1);
        (this.afterTomorrow = new Date()).setDate(this.tomorrow.getDate() + 2);
        (this.minDate = new Date()).setDate(this.minDate.getDate() - 1000);
        this.events = [
            { date: this.tomorrow, status: 'full' },
            { date: this.afterTomorrow, status: 'partially' }
        ];
        this.showWeeks = true;
    }
    DatepickerComponent.prototype.ngOnInit = function () {
        if (!this.dt && this.isEmptyRequired !== true) {
            this.dt = new Date();
        }
        this.randomId = 'id' + (Math.floor(Math.random() * 90000) + 10000).toString();
        this.dtDisplay = this.formatDate(this.dt);
        this.isDisabled = this.isDisabled || false;
        this.isReadonly = this.isReadonly || false;
        this.isRequired = this.isRequired || false;
        this.clearDate = this.clearDate || false;
        this.setFocus = this.setFocus || false;
        this.validate = this.validate || false;
        this.datePickerOnClickRef = this.onDatePickerClick.bind(this);
        this.documentOnClickRef = this.onDocumentClick.bind(this);
        DatepickerComponent.dateInstanceCounter++;
        this.uniqueIdentifier = DatepickerComponent.dateInstanceCounter;
        DatepickerComponent.saveInstance(this);
        document.addEventListener('click', this.documentOnClickRef);
    };
    DatepickerComponent.prototype.ngAfterViewInit = function () {
        var el = document.querySelectorAll('.datepicker-input-cont');
        this.addEvent(el, 'click', this.datePickerOnClickRef);
    };
    DatepickerComponent.prototype.ngOnChanges = function (change) {
        var _this = this;
        if (this.dt && this.dt.toString() === 'Invalid Date') {
            this.invalid = true;
            this.dt = new Date();
            setTimeout(function () {
                _this.invalid = false;
            }, 500);
        }
        else if (!this.dt) {
            this.invalid = true;
            this.clear();
            this.dtDisplay = '';
            setTimeout(function () {
                _this.invalid = false;
            }, 500);
        }
        else {
            this.invalid = false;
            this.dtDisplay = this.formatDate(this.dt);
        }
        if (change.clearDate && change.clearDate.currentValue === true) {
            this.dtDisplay = '';
            this.clear();
        }
        if (change.validate && change.validate.currentValue === true) {
            this.validateDateField();
        }
        if (change.isDisabled && change.isDisabled.currentValue === true) {
            this.resetDateField();
        }
    };
    DatepickerComponent.prototype.ngOnDestroy = function () {
        var el = document.querySelectorAll('.datepicker-input-cont');
        document.removeEventListener('click', this.documentOnClickRef);
        this.removeEvent(el, 'click', this.datePickerOnClickRef);
        this.riExchange.releaseReference(this);
    };
    DatepickerComponent.saveInstance = function (instance) {
        DatepickerComponent.dateInstance.push(instance);
        for (var i = 0; i < DatepickerComponent.dateInstance.length; i++) {
            document.removeEventListener('click', DatepickerComponent.dateInstance[i].documentOnClickRef);
        }
    };
    DatepickerComponent.prototype.validateDateField = function () {
        if (this.randomId) {
            var elem = document.querySelector('#' + this.randomId);
            if (elem) {
                this.utils.removeClass(elem, 'ng-untouched');
                this.utils.addClass(elem, 'ng-touched');
            }
            elem = null;
        }
    };
    DatepickerComponent.prototype.resetDateField = function () {
        if (this.randomId) {
            var elem = document.querySelector('#' + this.randomId);
            if (elem) {
                this.utils.removeClass(elem, 'ng-touched');
                this.utils.addClass(elem, 'ng-untouched');
            }
            elem = null;
        }
    };
    DatepickerComponent.prototype.getDate = function () {
        return this.dt && this.dt.getTime() || new Date().getTime();
    };
    DatepickerComponent.prototype.today = function () {
        this.dt = new Date();
        this.dtDisplay = this.formatDate(this.dt);
    };
    DatepickerComponent.prototype.getDayClass = function (date, mode) {
        if (mode === 'day') {
            var dayToCheck = new Date(date).setHours(0, 0, 0, 0);
            for (var i = 0; i < this.events.length; i++) {
                var currentDay = new Date(this.events[i].date).setHours(0, 0, 0, 0);
                if (dayToCheck === currentDay) {
                    return this.events[i].status;
                }
            }
        }
        return '';
    };
    DatepickerComponent.prototype.disabled = function (date, mode) {
        return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6));
    };
    DatepickerComponent.prototype.open = function () {
        if (this.isDisabled === false) {
            if (DatepickerComponent.dateInstance) {
                for (var i = 0; i < DatepickerComponent.dateInstance.length; i++) {
                    if (this.uniqueIdentifier !== DatepickerComponent.dateInstance[i].uniqueIdentifier) {
                        DatepickerComponent.dateInstance[i].opened = false;
                    }
                }
            }
            this.opened = !this.opened;
            var el = document.querySelectorAll('.datepicker-cont');
            if (this.opened === true) {
                this.removeEvent(el, 'click', this.onDatePickerClick.bind(this));
                this.addEvent(el, 'click', this.onDatePickerClick.bind(this));
            }
            else {
                this.removeEvent(el, 'click', this.onDatePickerClick.bind(this));
            }
        }
    };
    DatepickerComponent.prototype.clear = function () {
        this.dt = void 0;
    };
    DatepickerComponent.prototype.toggleMin = function () {
        this.dt = new Date(this.minDate.valueOf());
    };
    DatepickerComponent.prototype.formatDate = function (date) {
        if (date) {
            var d = new Date(date), month = '' + (d.getMonth() + 1), day = '' + d.getDate(), year = d.getFullYear();
            if (month.length < 2)
                month = '0' + month;
            if (day.length < 2)
                day = '0' + day;
            return [day, month, year].join('/');
        }
        else {
            return '';
        }
    };
    DatepickerComponent.prototype.processDate = function (event) {
        if (this.invalid === true) {
            this.dtDisplay = '';
        }
        else {
            if (this.dt !== null) {
                this.dtDisplay = this.formatDate(this.dt);
            }
            this.opened = false;
        }
        this.selectedValue.emit({
            value: this.dtDisplay
        });
    };
    DatepickerComponent.prototype.dateChange = function () {
        this.invalid = false;
        if (this.dtDisplay === '*') {
            this.dtDisplay = this.utils.formatDate(new Date());
            this.dt = new Date();
            this.selectedValue.emit({
                value: this.dtDisplay
            });
            return;
        }
        if (window['moment'](this.dtDisplay, 'DD/MM/YYYY', true).isValid()) {
            this.dtDisplay = this.utils.convertDateString(this.dtDisplay);
        }
        else if (window['moment'](this.dtDisplay, 'MM/DD/YYYY', true).isValid() || window['moment'](this.dtDisplay, 'YYYY/MM/DD', true).isValid()) {
            this.dtDisplay = this.utils.convertDateString(this.utils.formatDate(new Date(this.dtDisplay)));
        }
        else {
            if (!window['moment'](this.dtDisplay, 'YYYY-MM-DD', true).isValid()) {
                if (!isNaN(this.dtDisplay)) {
                    if (this.dtDisplay.length === 8) {
                        var textDate = this.dtDisplay.slice(0, 2) + '/' + this.dtDisplay.slice(2, 4) + '/' + this.dtDisplay.slice(4);
                        if (!window['moment'](textDate, 'DD/MM/YYYY', true).isValid()) {
                            this.dtDisplay = '';
                        }
                        else {
                            this.dtDisplay = this.utils.convertDateString(textDate);
                        }
                    }
                    else if (this.dtDisplay.length === 6) {
                        var textDate = this.dtDisplay.slice(0, 2) + '/' + this.dtDisplay.slice(2, 4) + '/' + new Date().getFullYear().toString().slice(0, 2) + this.dtDisplay.slice(4, 6);
                        if (!window['moment'](textDate, 'DD/MM/YYYY', true).isValid()) {
                            this.dtDisplay = '';
                        }
                        else {
                            this.dtDisplay = this.utils.convertDateString(textDate);
                        }
                    }
                    else {
                        this.dtDisplay = '';
                    }
                }
                else {
                    this.dtDisplay = '';
                }
            }
        }
        if (!this.dtDisplay) {
            this.dtDisplay = '';
        }
        else {
            this.dt = new Date(this.dtDisplay);
            if (!window['moment'](this.dtDisplay, 'DD/MM/YYYY', true).isValid()) {
                this.dtDisplay = this.utils.formatDate(new Date(this.dtDisplay));
            }
        }
        this.selectedValue.emit({
            value: this.dtDisplay
        });
    };
    DatepickerComponent.prototype.changeDateOnKeyDown = function (event) {
        if (this.dtDisplay !== '') {
            event = event || window.event;
            if (event.keyCode === 38 || event.keyCode === 107) {
                if (window['moment'](this.dtDisplay, 'DD/MM/YYYY', true).isValid()) {
                    this.dtDisplay = this.utils.convertDate(this.dtDisplay);
                    var next = new Date(this.dtDisplay);
                    next.setDate(next.getDate() + 1);
                    this.dt = next;
                    this.dtDisplay = this.utils.formatDate(next);
                }
                else {
                    this.dtDisplay = '';
                }
                this.selectedValue.emit({
                    value: this.dtDisplay
                });
            }
            else if (event.keyCode === 40 || event.keyCode === 109) {
                if (window['moment'](this.dtDisplay, 'DD/MM/YYYY', true).isValid()) {
                    this.dtDisplay = this.utils.convertDate(this.dtDisplay);
                    var prev = new Date(this.dtDisplay);
                    prev.setDate(prev.getDate() - 1);
                    this.dt = prev;
                    this.dtDisplay = this.utils.formatDate(prev);
                }
                else {
                    this.dtDisplay = '';
                }
                this.selectedValue.emit({
                    value: this.dtDisplay
                });
            }
            this.dtDisplay = this.dtDisplay.replace(/\+|\-/g, '');
        }
    };
    DatepickerComponent.prototype.isDate = function (date) {
        return ((new Date(date).toString() !== 'Invalid Date'));
    };
    DatepickerComponent.prototype.onDatePickerClick = function (event) {
        event.stopPropagation();
    };
    DatepickerComponent.prototype.onDocumentClick = function (event) {
        var _this = this;
        setTimeout(function () {
            _this.opened = false;
            for (var i = 0; i < DatepickerComponent.dateInstance.length; i++) {
                DatepickerComponent.dateInstance[i].opened = false;
            }
        }, 200);
    };
    DatepickerComponent.prototype.addEvent = function (el, type, handler) {
        for (var i = 0; i < el.length; i++) {
            if (el[i].attachEvent)
                el[i].attachEvent('on' + type, handler);
            else
                el[i].addEventListener(type, handler);
        }
    };
    DatepickerComponent.prototype.removeEvent = function (el, type, handler) {
        for (var i = 0; i < el.length; i++) {
            if (el[i].detachEvent)
                el[i].detachEvent('on' + type, handler);
            else
                el[i].removeEventListener(type, handler);
        }
    };
    DatepickerComponent.dateInstance = [];
    DatepickerComponent.dateInstanceCounter = 0;
    DatepickerComponent.decorators = [
        { type: Component, args: [{
                    selector: 'icabs-datepicker',
                    templateUrl: 'datepicker.html',
                    styles: ["\n    datepicker {\n      position: absolute;\n      z-index: 10;\n    }\n\n    .input-group-addon {\n        border-radius: 0;\n        padding: 4px 12px;\n    }\n\n    .input-group-addon.disabled {\n      cursor: not-allowed;\n      opacity: 1;\n    }\n\n    .input-group-addon.disabled .glyphicon-calendar {\n      opacity: 0.3;\n    }\n  "]
                },] },
    ];
    DatepickerComponent.ctorParameters = [
        { type: NgZone, },
        { type: Utils, },
        { type: RiExchange, },
    ];
    DatepickerComponent.propDecorators = {
        'dt': [{ type: Input },],
        'isDisabled': [{ type: Input },],
        'isReadonly': [{ type: Input },],
        'setFocus': [{ type: Input },],
        'isRequired': [{ type: Input },],
        'clearDate': [{ type: Input },],
        'validate': [{ type: Input },],
        'selectedValue': [{ type: Output },],
    };
    return DatepickerComponent;
}());
