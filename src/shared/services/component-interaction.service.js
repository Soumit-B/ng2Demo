import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Logger } from '@nsalaun/ng2-logger';
export var ComponentInteractionService = (function () {
    function ComponentInteractionService(_logger) {
        this._logger = _logger;
        this._interactionSource = new BehaviorSubject(0);
        this._interactionSource$ = this._interactionSource.asObservable();
    }
    ComponentInteractionService.prototype.emitMessage = function (msg) {
        this._interactionSource.next(msg);
    };
    ComponentInteractionService.prototype.getInteractionSource = function () {
        return this._interactionSource;
    };
    ComponentInteractionService.prototype.getObservableSource = function () {
        return this._interactionSource$;
    };
    ComponentInteractionService.decorators = [
        { type: Injectable },
    ];
    ComponentInteractionService.ctorParameters = [
        { type: Logger, },
    ];
    return ComponentInteractionService;
}());
