import { Component, Input, Output, EventEmitter } from '@angular/core';
import { LocaleTranslationService } from './../../services/translation.service';
import { TranslateService } from 'ng2-translate';
import { RiExchange } from '../../../shared/services/riExchange';
export var DropdownStaticGroupedComponent = (function () {
    function DropdownStaticGroupedComponent(translate, localeTranslateService, riExchange) {
        this.translate = translate;
        this.localeTranslateService = localeTranslateService;
        this.riExchange = riExchange;
        this.defaultSelected = true;
        this.disabled = false;
        this.onSelect = new EventEmitter();
    }
    DropdownStaticGroupedComponent.prototype.ngOnInit = function () {
        var _this = this;
        var option = {};
        this.localeTranslateService.setUpTranslation();
        this.selectedItem = this.defaultOption || 'Options';
        this.onSelect.emit(this.selectedItem);
        if (this.inputData) {
            this.translateSubscription = this.localeTranslateService.ajaxSource$.subscribe(function (event) {
                if (event !== 0) {
                    _this.fetchTranslationContent(_this.inputData);
                }
            });
        }
    };
    DropdownStaticGroupedComponent.prototype.ngOnDestroy = function () {
        if (this.translateSubscription) {
            this.translateSubscription.unsubscribe();
        }
    };
    DropdownStaticGroupedComponent.prototype.fetchTranslationContent = function (data) {
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
    DropdownStaticGroupedComponent.prototype.onChange = function () {
        this.onSelect.emit(this.selectedItem);
    };
    DropdownStaticGroupedComponent.decorators = [
        { type: Component, args: [{
                    selector: 'icabs-dropdown-static-grouped',
                    templateUrl: 'dropdown-static-grouped.html'
                },] },
    ];
    DropdownStaticGroupedComponent.ctorParameters = [
        { type: TranslateService, },
        { type: LocaleTranslationService, },
        { type: RiExchange, },
    ];
    DropdownStaticGroupedComponent.propDecorators = {
        'inputData': [{ type: Input },],
        'defaultSelected': [{ type: Input },],
        'defaultOption': [{ type: Input },],
        'disabled': [{ type: Input },],
        'onSelect': [{ type: Output },],
    };
    return DropdownStaticGroupedComponent;
}());
