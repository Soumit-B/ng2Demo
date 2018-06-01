import { Component, Input, Output, EventEmitter, ViewChild, ChangeDetectorRef } from '@angular/core';
import { RiExchange } from '../../../shared/services/riExchange';
export var PromptModalComponent = (function () {
    function PromptModalComponent(_ref, riExchange) {
        this._ref = _ref;
        this.riExchange = riExchange;
        this.saveEmit = new EventEmitter();
        this.cancelEmit = new EventEmitter();
        this.isContentAnArray = false;
    }
    PromptModalComponent.prototype.ngOnInit = function () {
        if (typeof this.config !== 'object' || !this.config) {
            this.config = {};
        }
        if (this.showCloseButton == null) {
            this.showCloseButton = true;
        }
        if (this.shiftTop === null || this.shiftTop === undefined) {
            this.shiftTop = false;
        }
        this._title = this.title;
        this._content = this.content;
    };
    PromptModalComponent.prototype.ngOnChanges = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        if (typeof this.config !== 'object' && this.config) {
            this.config = {};
        }
        if (this.showCloseButton == null) {
            this.showCloseButton = true;
        }
    };
    PromptModalComponent.prototype.ngOnDestroy = function () {
        this.riExchange.releaseReference(this);
    };
    PromptModalComponent.prototype.show = function (data, error) {
        this._data = data;
        if (this.content instanceof Array) {
            this.isContentAnArray = true;
        }
        else {
            this.isContentAnArray = false;
        }
        this.childModal.show();
    };
    PromptModalComponent.prototype.hide = function () {
        this.childModal.hide();
    };
    PromptModalComponent.prototype.onHidden = function (event) {
        if (document.querySelectorAll('[bsmodal].in').length <= 0) {
            var elem = document.getElementsByClassName('modal-backdrop');
            while (elem[0]) {
                elem[0].parentNode.removeChild(elem[0]);
            }
        }
    };
    PromptModalComponent.prototype.cancel = function () {
        this.cancelEmit.emit({
            value: PromptModalComponent.CANCEL,
            data: this._data
        });
        if (this.childModal !== null)
            this.childModal.hide();
    };
    PromptModalComponent.prototype.save = function () {
        this.saveEmit.emit({
            value: PromptModalComponent.SAVE,
            data: this._data
        });
        if (this.childModal !== null)
            this.childModal.hide();
    };
    PromptModalComponent.SAVE = 'save';
    PromptModalComponent.CANCEL = 'cancel';
    PromptModalComponent.decorators = [
        { type: Component, args: [{
                    selector: 'icabs-prompt-modal',
                    templateUrl: 'prompt-modal.html',
                    exportAs: 'child',
                    styles: ["\n    .shiftTop {\n        top: 35%\n    }\n    "]
                },] },
    ];
    PromptModalComponent.ctorParameters = [
        { type: ChangeDetectorRef, },
        { type: RiExchange, },
    ];
    PromptModalComponent.propDecorators = {
        'childModal': [{ type: ViewChild, args: ['childModal',] },],
        'config': [{ type: Input },],
        'title': [{ type: Input },],
        'optValueYesorNo': [{ type: Input },],
        'content': [{ type: Input },],
        'shiftTop': [{ type: Input },],
        'showHeader': [{ type: Input },],
        'showCloseButton': [{ type: Input },],
        'saveEmit': [{ type: Output },],
        'cancelEmit': [{ type: Output },],
    };
    return PromptModalComponent;
}());
