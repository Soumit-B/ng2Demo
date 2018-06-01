import { OrderBy } from './../../pipes/orderBy';
import { Observable } from 'rxjs';
import { Component, Input, Output, EventEmitter, ElementRef, NgZone } from '@angular/core';
var KEY_DW = 40;
var KEY_RT = 39;
var KEY_UP = 38;
var KEY_LF = 37;
var KEY_ES = 27;
var KEY_EN = 13;
var KEY_TAB = 9;
export var AutocompleteComponent = (function () {
    function AutocompleteComponent(el, zone, orderby) {
        this.el = el;
        this.zone = zone;
        this.orderby = orderby;
        this.datasource = [];
        this.placeholder = 'Search';
        this.autofocus = true;
        this.pause = 100;
        this.minlength = 1;
        this.displaySearching = true;
        this.displayNoResults = true;
        this.textSearching = 'Searching';
        this.textNoResults = 'No Results Found';
        this.autoMatch = true;
        this.clearSelected = false;
        this.focusFirst = false;
        this.selected = new EventEmitter();
        this.matchClass = true;
        this.searchTimer = null;
        this.showDropdown = false;
        this.results = [];
        this.currentIndex = -1;
        this.isSearching = false;
        this.inputName = '';
        this.fieldTabindex = 0;
    }
    AutocompleteComponent.prototype.ngOnInit = function () {
        this.nativeElement = this.el.nativeElement;
    };
    AutocompleteComponent.prototype.ngOnDestroy = function () {
        return;
    };
    Object.defineProperty(AutocompleteComponent.prototype, "dropdown", {
        get: function () {
            return this.el.nativeElement.querySelector('.autocomplete-dropdown');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AutocompleteComponent.prototype, "dropdownRow", {
        get: function () {
            return this.el.nativeElement.querySelectorAll('.autocomplete-row')[this.currentIndex];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AutocompleteComponent.prototype, "isScrollOn", {
        get: function () {
            var css = getComputedStyle(this.dropdown);
            return css.maxHeight && css.overflowY === 'auto';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AutocompleteComponent.prototype, "dropdownRowTop", {
        get: function () {
            return this.dropdownRow.getBoundingClientRect().top -
                (this.dropdown.getBoundingClientRect().top +
                    parseInt(getComputedStyle(this.dropdown).paddingTop, 10));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AutocompleteComponent.prototype, "dropdownHeight", {
        get: function () {
            return this.dropdown.getBoundingClientRect().top +
                parseInt(getComputedStyle(this.dropdown).maxHeight, 10);
        },
        enumerable: true,
        configurable: true
    });
    AutocompleteComponent.prototype.keyupHandler = function (event) {
        var _this = this;
        var row = null;
        var rowTop = null;
        if (event.keyCode === KEY_LF || event.keyCode === KEY_RT || event.keyCode === KEY_TAB) {
            return;
        }
        if (event.keyCode === KEY_UP || event.keyCode === KEY_EN) {
            event.preventDefault();
        }
        else if (event.keyCode === KEY_DW) {
            event.preventDefault();
            if (!this.showDropdown && this.searchStr && this.searchStr.length >= this.minlength) {
                this.initResults();
                this.isSearching = true;
                this.searchTimerComplete(this.searchStr);
            }
        }
        else if (event.keyCode === KEY_ES) {
            event.preventDefault();
        }
        else {
            if (this.minlength === 0 && !this.searchStr) {
                return;
            }
            if (!this.searchStr || this.searchStr === '') {
                this.showDropdown = false;
            }
            else if (this.searchStr.length >= this.minlength) {
                this.initResults();
                if (this.searchTimer) {
                    this.searchTimer.unsubscribe();
                }
                this.isSearching = true;
                this.searchTimer = Observable.timer(this.pause).subscribe(function () {
                    _this.searchTimerComplete(_this.searchStr);
                });
            }
            if (!this.clearSelected) {
                this.zone.run(function () {
                    _this.callOrAssign();
                });
            }
        }
    };
    AutocompleteComponent.prototype.keydownHandler = function (event) {
        if (event.keyCode === KEY_EN) {
            if (this.currentIndex >= 0 && this.currentIndex < this.results.length) {
                event.preventDefault();
                this.selectResult(this.results[this.currentIndex]);
            }
            else {
                this.clearResults();
            }
        }
        else if (event.keyCode === KEY_DW) {
            event.preventDefault();
            this.nextRow();
        }
        else if (event.keyCode === KEY_UP) {
            event.preventDefault();
            this.prevRow();
        }
        else if (event.keyCode === KEY_TAB) {
            if (this.results && this.results.length > 0 && this.showDropdown) {
                if (this.currentIndex === -1) {
                    this.currentIndex = 0;
                }
                this.selectResult(this.results[this.currentIndex]);
            }
        }
        else if (event.keyCode === KEY_ES) {
            event.preventDefault();
        }
    };
    AutocompleteComponent.prototype.searchTimerComplete = function (str) {
        var _this = this;
        if (!str || str.length < this.minlength) {
            this.isSearching = false;
            return;
        }
        if (this.datasource) {
            this.zone.run(function () {
                var matches;
                matches = _this.orderby.transform(_this.getLocalResults(str), _this.searchField);
                _this.isSearching = false;
                _this.processResults(matches, str);
            });
        }
    };
    AutocompleteComponent.prototype.getLocalResults = function (str) {
        var _this = this;
        var matches = [];
        var searchBy = this.searchField ? this.searchField.split(',') : null;
        if (this.searchField !== null && this.searchField !== undefined && str !== '') {
            matches = this.datasource.filter(function (item) {
                var values = searchBy ? searchBy.map(function (searchField) { return _this.extractValue(item, searchField); }).filter(function (value) { return !!value; }) : [item];
                return values.some(function (value) { return value.toString().toLowerCase().indexOf(str.toString().toLowerCase()) >= 0; });
            });
        }
        else {
            matches = this.datasource;
        }
        return matches;
    };
    AutocompleteComponent.prototype.processResults = function (responseData, str) {
        var formattedText, formattedDesc;
        if (responseData && responseData.length > 0) {
            this.results = [];
            for (var i = 0; i < responseData.length; i++) {
                if (this.titleField && this.titleField !== '') {
                    formattedText = this.extractTitle(responseData[i]);
                }
                formattedDesc = '';
                if (this.descriptionField) {
                    formattedDesc = this.extractValue(responseData[i], this.descriptionField);
                }
                this.results[this.results.length] = {
                    title: formattedText,
                    description: formattedDesc,
                    originalObject: responseData[i]
                };
            }
        }
        else {
            this.results = [];
        }
        if (this.autoMatch && this.results.length === 1 &&
            this.checkExactMatch(this.results[0], { title: formattedText, desc: formattedDesc || '' }, this.searchStr)) {
            this.showDropdown = false;
        }
        else if (this.results.length === 0 && !this.displayNoResults) {
            this.showDropdown = false;
        }
        else {
            this.showDropdown = true;
        }
    };
    AutocompleteComponent.prototype.extractTitle = function (data) {
        var _this = this;
        return this.titleField.split(',')
            .map(function (field) {
            var val = _this.extractValue(data, field);
            return val;
        })
            .join(' ');
    };
    AutocompleteComponent.prototype.extractValue = function (obj, key) {
        var keys, result;
        if (key) {
            keys = key.split('.');
            result = obj;
            for (var i = 0; i < keys.length; i++) {
                result = result[keys[i]];
            }
        }
        else {
            result = obj;
        }
        return result;
    };
    AutocompleteComponent.prototype.checkExactMatch = function (result, obj, str) {
        if (!str) {
            return false;
        }
        for (var key in obj) {
            if (obj[key].toLowerCase() === str.toLowerCase()) {
                this.selectResult(result);
                return true;
            }
        }
        return false;
    };
    AutocompleteComponent.prototype.selectResult = function (result) {
        if (this.matchClass) {
            result.title = this.extractTitle(result.originalObject);
            result.description = this.extractValue(result.originalObject, this.descriptionField);
        }
        if (this.clearSelected) {
            this.searchStr = null;
        }
        else {
            this.searchStr = result.title;
        }
        this.selected.emit(result);
        this.callOrAssign(result);
        this.clearResults();
    };
    ;
    AutocompleteComponent.prototype.hideDropdownList = function () {
        this.searchStr = '';
        this.showDropdown = false;
    };
    AutocompleteComponent.prototype.initResults = function () {
        this.showDropdown = this.displaySearching;
        this.currentIndex = this.focusFirst ? 0 : -1;
        this.results = [];
    };
    AutocompleteComponent.prototype.callOrAssign = function (value) {
        if (typeof this.selectedObject === 'function') {
            this.selectedObject(value, this.selectedObjectData);
        }
        else {
            this.selectedObject = value;
        }
    };
    AutocompleteComponent.prototype.inputChangeHandler = function (str) {
        if (str.length < this.minlength) {
            this.clearResults();
        }
        else if (str.length === 0 && this.minlength === 0) {
            this.showAll();
        }
    };
    ;
    AutocompleteComponent.prototype.updateInputField = function () {
        var current = this.results[this.currentIndex];
        if (this.matchClass) {
            this.searchStr = this.extractTitle(current.originalObject);
        }
        else {
            this.searchStr = current.title;
        }
    };
    AutocompleteComponent.prototype.showAll = function () {
        if (this.datasource) {
            this.isSearching = false;
            this.processResults(this.datasource, '');
        }
    };
    AutocompleteComponent.prototype.clearResults = function () {
        this.results = [];
        if (this.showDropdown) {
            this.dropdown.scrollTop = 0;
            this.showDropdown = false;
        }
    };
    AutocompleteComponent.prototype.prevRow = function () {
        var _this = this;
        var rowTop;
        if (this.currentIndex >= 1) {
            this.zone.run(function () {
                _this.currentIndex--;
                _this.updateInputField();
            });
            if (this.isScrollOn) {
                rowTop = this.dropdownRowTop;
                if (rowTop < 0) {
                    this.dropdownScrollTopTo(rowTop - 1);
                }
            }
        }
        else if (this.currentIndex === 0) {
            this.zone.run(function () {
                _this.currentIndex = 0;
                _this.updateInputField();
            });
        }
    };
    AutocompleteComponent.prototype.nextRow = function () {
        var _this = this;
        var row;
        if ((this.currentIndex + 1) < this.results.length && this.showDropdown) {
            this.zone.run(function () {
                _this.currentIndex++;
                _this.updateInputField();
            });
            if (this.isScrollOn) {
                row = this.dropdownRow;
                if (this.dropdownHeight < row.getBoundingClientRect().bottom) {
                    this.dropdownScrollTopTo(this.dropdownRowOffsetHeight(row));
                }
            }
        }
    };
    AutocompleteComponent.prototype.hoverRow = function (index) {
        this.currentIndex = index;
    };
    AutocompleteComponent.prototype.dropdownScrollTopTo = function (offset) {
        this.dropdown.scrollTop = this.dropdown.scrollTop + offset;
    };
    AutocompleteComponent.prototype.dropdownRowOffsetHeight = function (row) {
        var css = getComputedStyle(row);
        return row.offsetHeight +
            parseInt(css.marginTop, 10) + parseInt(css.marginBottom, 10);
    };
    AutocompleteComponent.decorators = [
        { type: Component, args: [{
                    selector: 'icabs-autocomplete',
                    templateUrl: 'autocomplete.html'
                },] },
    ];
    AutocompleteComponent.ctorParameters = [
        { type: ElementRef, },
        { type: NgZone, },
        { type: OrderBy, },
    ];
    AutocompleteComponent.propDecorators = {
        'datasource': [{ type: Input },],
        'placeholder': [{ type: Input },],
        'autofocus': [{ type: Input },],
        'pause': [{ type: Input },],
        'minlength': [{ type: Input },],
        'displaySearching': [{ type: Input },],
        'displayNoResults': [{ type: Input },],
        'textSearching': [{ type: Input },],
        'textNoResults': [{ type: Input },],
        'titleField': [{ type: Input },],
        'searchField': [{ type: Input },],
        'descriptionField': [{ type: Input },],
        'autoMatch': [{ type: Input },],
        'clearSelected': [{ type: Input },],
        'focusFirst': [{ type: Input },],
        'selected': [{ type: Output },],
    };
    return AutocompleteComponent;
}());
