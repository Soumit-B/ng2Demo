import { Component, Input } from '@angular/core';
import { RiExchange } from '../../../shared/services/riExchange';
export var SpinnerComponent = (function () {
    function SpinnerComponent(riExchange) {
        this.riExchange = riExchange;
        this.isDelayedRunning = false;
        this.delay = 300;
    }
    Object.defineProperty(SpinnerComponent.prototype, "isRunning", {
        set: function (value) {
            var _this = this;
            if (!value) {
                this.cancelTimeout();
                this.isDelayedRunning = false;
                return;
            }
            if (this.currentTimeout) {
                return;
            }
            this.currentTimeout = setTimeout(function () {
                _this.isDelayedRunning = value;
                _this.cancelTimeout();
            }, this.delay);
        },
        enumerable: true,
        configurable: true
    });
    SpinnerComponent.prototype.cancelTimeout = function () {
        clearTimeout(this.currentTimeout);
        this.currentTimeout = undefined;
    };
    SpinnerComponent.prototype.ngOnDestroy = function () {
        this.cancelTimeout();
        this.riExchange.releaseReference(this);
    };
    SpinnerComponent.decorators = [
        { type: Component, args: [{
                    selector: 'icabs-spinner',
                    template: "\n        <div [hidden]=\"!isDelayedRunning\" [attr.data-hidden]=\"!isDelayedRunning\" class=\"spinner\">\n            <div class=\"bounce1\"></div>\n            <div class=\"bounce2\"></div>\n            <div class=\"bounce3\"></div>\n        </div>\n        <div [hidden]=\"!isDelayedRunning\" [attr.data-hidden]=\"!isDelayedRunning\" class=\"screen-overlay\"></div>\n    "
                },] },
    ];
    SpinnerComponent.ctorParameters = [
        { type: RiExchange, },
    ];
    SpinnerComponent.propDecorators = {
        'delay': [{ type: Input },],
        'isRunning': [{ type: Input },],
    };
    return SpinnerComponent;
}());
