import { Component, Input, EventEmitter, Output } from '@angular/core';
import { Logger } from '@nsalaun/ng2-logger';
export var RefreshComponent = (function () {
    function RefreshComponent(_logger) {
        this._logger = _logger;
        this.disabled = false;
        this.onRefresh = new EventEmitter();
    }
    RefreshComponent.prototype.ngOnInit = function () {
    };
    RefreshComponent.prototype.refresh = function (event) {
        event.preventDefault();
        if (!this.disabled) {
            this.onRefresh.emit();
        }
    };
    ;
    RefreshComponent.decorators = [
        { type: Component, args: [{
                    selector: 'icabs-refresh',
                    templateUrl: 'refresh.html'
                },] },
    ];
    RefreshComponent.ctorParameters = [
        { type: Logger, },
    ];
    RefreshComponent.propDecorators = {
        'disabled': [{ type: Input },],
        'onRefresh': [{ type: Output },],
    };
    return RefreshComponent;
}());
