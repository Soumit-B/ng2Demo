import { HttpService } from './../../services/http-service';
import { Component, NgZone, Input, Output, EventEmitter } from '@angular/core';
import { RiExchange } from '../../../shared/services/riExchange';
import { Utils } from '../../../shared/services/utility';
export var DropdownComponent = (function () {
    function DropdownComponent(searchService, zone, riExchange, utils) {
        this.searchService = searchService;
        this.zone = zone;
        this.riExchange = riExchange;
        this.utils = utils;
        this.seperator = ' - ';
        this.allowClear = false;
        this.showUnique = true;
        this.selectedValue = new EventEmitter();
        this.items = null;
        this.isError = false;
        this.randomId = '';
        this.value = {};
    }
    DropdownComponent.prototype.ngOnInit = function () {
        if (this.inputArray !== null && this.inputArray !== undefined) {
            this.drawComponent();
        }
        if (this.disabled === null || this.disabled === undefined) {
            this.disabled = false;
        }
        if (this.active === null || this.active === undefined) {
            this.active = {
                id: '',
                text: ''
            };
        }
        if (this.isRequired === null || this.isRequired === undefined) {
            this.isRequired = false;
        }
        this.currentSelection = this.active;
        this.randomId = 'id' + (Math.floor(Math.random() * 90000) + 10000).toString();
        if (window['Element']) {
            window['Element'].prototype.matches = window['Element'].prototype.matches ||
                window['Element'].prototype.matchesSelector ||
                window['Element'].prototype.webkitMatchesSelector ||
                window['Element'].prototype.msMatchesSelector ||
                function (selector) {
                    var node = this, nodes = (node.parentNode || node.document).querySelectorAll(selector), i = -1;
                    while (nodes[++i] && nodes[i] !== node)
                        ;
                    return !!nodes[i];
                };
        }
    };
    DropdownComponent.prototype.ngAfterViewInit = function () {
        this.validate({});
        if (this.inputArray && this.active && this.active.text !== '') {
            for (var i = 0; i < this.inputArray.length; i++) {
                if (this.inputArray[i].riCountryCode) {
                    this.active.text = this.active.text + this.seperator + this.inputArray['riCountryDescription'];
                    break;
                }
                else if (this.inputArray[i].code) {
                    this.active.text = this.active.text + this.seperator + this.inputArray['desc'];
                    break;
                }
            }
        }
        this.onFocusRef = this.dropdownFocus.bind(this);
        this.onBlurRef = this.dropdownBlur.bind(this);
        this.live('#' + this.randomId + ' li:last-child .dropdown-item', 'blur', function (el, event) {
            document.querySelector('body').click();
        }, document.querySelector('#' + this.randomId));
        document.querySelector('#' + this.randomId + ' .ui-select-container').addEventListener('focus', this.onFocusRef);
        document.querySelector('#' + this.randomId + ' .ui-select-container').addEventListener('blur', this.onBlurRef);
    };
    DropdownComponent.prototype.ngOnChanges = function () {
        if (this.inputArray !== null && this.inputArray !== undefined) {
            this.drawComponent();
        }
        this.validate({});
    };
    DropdownComponent.prototype.ngOnDestroy = function () {
        var elem = document.querySelector('#' + this.randomId + ' .ui-select-container');
        if (elem) {
            elem.removeEventListener('focus', this.onFocusRef);
            elem.removeEventListener('blur', this.onBlurRef);
        }
    };
    DropdownComponent.prototype.dropdownFocus = function (event) {
        var _this = this;
        if (event.relatedTarget && this.utils.hasClass(event.relatedTarget, 'ui-select-search')) {
            return;
        }
        var elem = document.querySelector('#' + this.randomId + ' .ui-select-toggle');
        if (elem && !this.utils.hasClass(elem, 'focus')) {
            this.utils.addClass(elem, 'focus');
        }
        else {
            setTimeout(function () {
                var textElem = document.querySelector('#' + _this.randomId + ' .ui-select-search');
                if (textElem) {
                    textElem['focus']();
                }
            }, 0);
        }
    };
    DropdownComponent.prototype.dropdownBlur = function (event) {
        var elem = document.querySelector('#' + this.randomId + ' .ui-select-toggle');
        if (elem && this.utils.hasClass(elem, 'focus')) {
            this.utils.removeClass(elem, 'focus');
        }
    };
    DropdownComponent.prototype.live = function (selector, event, callback, context) {
        this.addEvent(context || document, event, function (e) {
            var found, el = e.target || e.srcElement;
            found = el.matches(selector);
            while (el && el.matches && el !== context && !(found)) {
                el = el.parentElement;
                found = el.matches(selector);
            }
            if (found)
                callback.call(el, e);
        });
    };
    DropdownComponent.prototype.addEvent = function (el, type, handler) {
        el.addEventListener(type, handler, true);
    };
    DropdownComponent.prototype.updateComponent = function (data) {
        this.inputArray = data;
        this.drawComponent();
    };
    DropdownComponent.prototype.drawComponent = function () {
        try {
            this.items = [];
            if (!this.isRequired) {
                this.items.push({
                    id: (this.inputArray.length + 1),
                    text: ' '
                });
            }
            if (!this.itemsToDisplay) {
                this.items = this.inputArray;
            }
            else {
                for (var i = 0; i < this.inputArray.length; i++) {
                    var item = this.inputArray[i];
                    var displayText = item[this.itemsToDisplay[0]];
                    if (this.itemsToDisplay.length > 1) {
                        for (var j = 1; j < this.itemsToDisplay.length; j++) {
                            displayText = displayText + this.seperator + item[this.itemsToDisplay[j]];
                        }
                    }
                    this.items.push({
                        id: i + 1,
                        text: displayText
                    });
                }
                ;
            }
            this.itemsClone = JSON.parse(JSON.stringify(this.items));
        }
        catch (e) {
        }
    };
    DropdownComponent.prototype.removed = function (value) {
    };
    DropdownComponent.prototype.typed = function (value) {
        var _this = this;
        if (value === '') {
            setTimeout(function () {
                document.querySelector('#' + _this.randomId + ' .ui-select-search')['value'] = '';
            }, 0);
        }
        else {
            this.value = value;
            this.validate(value);
        }
    };
    DropdownComponent.prototype.selected = function (value) {
        if (!this.itemsToDisplay) {
            this.currentSelection = {
                value: value.id
            };
            this.selectedValue.emit({
                value: value.id
            });
        }
        else {
            var obj = {};
            if (!this.inputArray[value.id - 1]) {
                for (var j = 0; j < this.itemsToDisplay.length; j++) {
                    obj[this.itemsToDisplay[j]] = '';
                }
            }
            this.currentSelection = {
                value: this.inputArray[value.id - 1] ? this.inputArray[value.id - 1] : obj
            };
            this.selectedValue.emit({
                value: this.inputArray[value.id - 1] ? this.inputArray[value.id - 1] : obj
            });
        }
        if (this.active && this.active.text) {
            this.active.text = '';
        }
        this.validate(value);
    };
    DropdownComponent.prototype.validate = function (value) {
        var _this = this;
        setTimeout(function () {
            _this.zone.run(function () {
                if (!_this.disabled) {
                    var query = '#' + _this.randomId + ' .ui-select-match-text';
                    if (document.querySelectorAll(query).length <= 0) {
                        if (_this.isRequired && !value['id'] && !_this.active.text) {
                            _this.isError = true;
                        }
                        else {
                            _this.isError = false;
                        }
                    }
                    else {
                        if (_this.isRequired && !value['id'] && !_this.active.text && _this.triggerValidate) {
                            _this.isError = true;
                        }
                        else {
                            _this.isError = false;
                        }
                    }
                }
                else {
                    _this.isError = false;
                }
            });
        }, 200);
    };
    DropdownComponent.prototype.refreshValue = function (value) {
        this.validate(value);
    };
    DropdownComponent.decorators = [
        { type: Component, args: [{
                    selector: 'icabs-dropdown',
                    template: "\n        <div [id]=\"randomId\" [ngClass]=\"{'required': isRequired, 'error': isError }\">\n            <ng-select [allowClear]=\"allowClear\" [items]=\"items\" [active]=[active] [disabled]=\"disabled\" (data)=\"refreshValue($event)\" (selected)=\"selected($event)\" (removed)=\"removed($event)\" (typed)=\"typed($event)\" [placeholder]=\"placeholder\">\n            </ng-select>\n        </div>\n    "
                },] },
    ];
    DropdownComponent.ctorParameters = [
        { type: HttpService, },
        { type: NgZone, },
        { type: RiExchange, },
        { type: Utils, },
    ];
    DropdownComponent.propDecorators = {
        'inputArray': [{ type: Input },],
        'url': [{ type: Input },],
        'seperator': [{ type: Input },],
        'itemsToDisplay': [{ type: Input },],
        'allowClear': [{ type: Input },],
        'showUnique': [{ type: Input },],
        'disabled': [{ type: Input },],
        'active': [{ type: Input },],
        'isRequired': [{ type: Input },],
        'triggerValidate': [{ type: Input },],
        'selectedValue': [{ type: Output },],
    };
    return DropdownComponent;
}());
