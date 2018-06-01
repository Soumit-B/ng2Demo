import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Logger } from '@nsalaun/ng2-logger';
export var MessageService = (function () {
    function MessageService(_logger) {
        this._logger = _logger;
        this.messageSource = new BehaviorSubject(0);
        this.messageSource$ = this.messageSource.asObservable();
    }
    MessageService.prototype.emitMessage = function (message) {
        this.messageSource.next(message);
    };
    MessageService.prototype.getMessageSource = function () {
        return this.messageSource;
    };
    MessageService.prototype.getObservableSource = function () {
        return this.messageSource;
    };
    MessageService.decorators = [
        { type: Injectable },
    ];
    MessageService.ctorParameters = [
        { type: Logger, },
    ];
    return MessageService;
}());
