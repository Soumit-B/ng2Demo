import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TranslateService } from 'ng2-translate';
import { LocaleTranslationService } from '../../../shared/services/translation.service';
import { RiExchange } from '../../../shared/services/riExchange';
export var DropdownStaticComponent = (function () {
    function DropdownStaticComponent(translate, localeTranslateService, riExchange) {
        this.translate = translate;
        this.localeTranslateService = localeTranslateService;
        this.riExchange = riExchange;
        this.defaultSelected = true;
        this.disabled = false;
        this.onSelect = new EventEmitter();
        this.isValid = true;
    }
    DropdownStaticComponent.prototype.ngOnInit = function () {
        this.localeTranslateService.setUpTranslation();
    };
    DropdownStaticComponent.prototype.ngOnChanges = function (change) {
        if (change.inputData) {
            this.populateDropDown();
        }
    };
    DropdownStaticComponent.prototype.populateDropDown = function () {
        var option = {};
        if (!this.defaultSelected || this.defaultOption) {
            option = {
                text: (this.defaultOption) ? this.defaultOption.text : '',
                value: (this.defaultOption) ? this.defaultOption.value : ''
            };
            this.inputData.splice(0, 0, option);
        }
        if (this.inputData.length === 0)
            return;
        this.updateSelectedItem();
    };
    DropdownStaticComponent.prototype.updateSelectedItem = function (index) {
        var _this = this;
        var i = 0;
        if (index) {
            i = index;
        }
        if (this.inputData !== undefined && this.inputData !== null) {
            this.selectedItem = this.inputData[i].value;
            this.onSelect.emit(this.selectedItem);
        }
        else {
            return;
        }
        if (this.inputData) {
            this.translateSubscription = this.localeTranslateService.ajaxSource$.subscribe(function (event) {
                if (event !== 0) {
                    _this.fetchTranslationContent(_this.inputData);
                }
            });
        }
    };
    DropdownStaticComponent.prototype.ngOnDestroy = function () {
        if (this.translateSubscription) {
            this.translateSubscription.unsubscribe();
        }
    };
    DropdownStaticComponent.prototype.fetchTranslationContent = function (data) {
        var _loop_1 = function(i) {
            if (data[i].text) {
                this_1.localeTranslateService.getTranslatedValue(data[i].text, null).subscribe(function (res) {
                    if (res) {
                        data[i].text = res;
                    }
                });
            }
        };
        var this_1 = this;
        for (var i = 0; i < data.length; i++) {
            _loop_1(i);
        }
    };
    DropdownStaticComponent.prototype.onChange = function () {
        if (this.inputData) {
            this.onSelect.emit(this.selectedItem);
        }
    };
    DropdownStaticComponent.decorators = [
        { type: Component, args: [{
                    selector: 'icabs-dropdown-static',
                    template: "\n    <select class=\"form-control\" [disabled]=\"disabled\" (change)=\"onChange()\" [(ngModel)]=\"selectedItem\" [ngClass]=\"{'invalid' : !isValid}\">\n        <option *ngFor=\"let item of inputData\" [value]=\"item.value\" [selected]=\"selectedItem === item.value\">\n            {{item.text | translate}}\n        </option>\n    </select>"
                },] },
    ];
    DropdownStaticComponent.ctorParameters = [
        { type: TranslateService, },
        { type: LocaleTranslationService, },
        { type: RiExchange, },
    ];
    DropdownStaticComponent.propDecorators = {
        'inputData': [{ type: Input },],
        'defaultSelected': [{ type: Input },],
        'defaultOption': [{ type: Input },],
        'disabled': [{ type: Input },],
        'onSelect': [{ type: Output },],
    };
    return DropdownStaticComponent;
}());
