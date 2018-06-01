import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Logger } from '@nsalaun/ng2-logger';
export var ErrorService = (function () {
    function ErrorService(_logger) {
        this._logger = _logger;
        this._errorSource = new BehaviorSubject(0);
        this._errorSource$ = this._errorSource.asObservable();
    }
    ErrorService.prototype.emitError = function (error) {
        this._errorSource.next(error);
    };
    ErrorService.prototype.getErrorSource = function () {
        return this._errorSource;
    };
    ErrorService.prototype.getObservableSource = function () {
        return this._errorSource$;
    };
    ErrorService.decorators = [
        { type: Injectable },
    ];
    ErrorService.ctorParameters = [
        { type: Logger, },
    ];
    return ErrorService;
}());
