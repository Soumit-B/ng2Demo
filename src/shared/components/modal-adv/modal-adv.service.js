import { ICabsModalConstants } from './modal-adv-vo';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Logger } from '@nsalaun/ng2-logger';
export var ModalAdvService = (function () {
    function ModalAdvService(_logger) {
        this._logger = _logger;
        this._source = new BehaviorSubject(0);
        this._source$ = this._source.asObservable();
    }
    ModalAdvService.prototype.emitError = function (data) {
        if (data) {
            data.modalType = ICabsModalConstants.MODAL_TYPE_ERROR;
        }
        this._source.next(data);
    };
    ModalAdvService.prototype.emitMessage = function (data) {
        if (data) {
            data.modalType = ICabsModalConstants.MODAL_TYPE_MESSAGE;
        }
        this._source.next(data);
    };
    ModalAdvService.prototype.emitPrompt = function (data) {
        if (data) {
            data.modalType = ICabsModalConstants.MODAL_TYPE_PROMPT;
        }
        this._source.next(data);
    };
    ModalAdvService.prototype.getSource = function () {
        return this._source;
    };
    ModalAdvService.prototype.getObservableSource = function () {
        return this._source$;
    };
    ModalAdvService.decorators = [
        { type: Injectable },
    ];
    ModalAdvService.ctorParameters = [
        { type: Logger, },
    ];
    return ModalAdvService;
}());
