import { Component, Input, Output, EventEmitter, ViewChild, ChangeDetectorRef } from '@angular/core';
import { RiExchange } from '../../../shared/services/riExchange';
export var ConfirmOkComponent = (function () {
    function ConfirmOkComponent(_ref, riExchange) {
        this._ref = _ref;
        this.riExchange = riExchange;
        this.confirmClose = new EventEmitter();
        this.confirmCancel = new EventEmitter();
    }
    ConfirmOkComponent.prototype.ngOnInit = function () {
        if (typeof this.config !== 'object' || !this.config) {
            this.config = { ignoreBackdropClick: true };
        }
        if (this.showHeader == null) {
            this.showHeader = true;
        }
        if (this.showCloseButton == null) {
            this.showCloseButton = true;
        }
        if (this.showCancel == null) {
            this.showCancel = false;
        }
        if (this.showOk == null) {
            this.showOk = true;
        }
        if (this.okText == null) {
            this.okText = 'Ok';
        }
        if (this.cancelText == null) {
            this.cancelText = 'Cancel';
        }
        this._title = this.title;
        this._content = this.content;
    };
    ConfirmOkComponent.prototype.ngOnChanges = function () {
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
    ConfirmOkComponent.prototype.ngOnDestroy = function () {
        this.riExchange.releaseReference(this);
        delete this;
    };
    ConfirmOkComponent.prototype.show = function (data, error) {
        if (error === true) {
            if (data && data.error) {
                this.title = data.error.title;
                this.content = data.error.message;
            }
            else if (data && data.errorMessage) {
                this.title = 'Error';
                this.content = data.errorMessage || data.fullError;
            }
        }
        else if (error === false) {
            if (data && data.msg) {
                this.title = data.title;
                this.content = data.msg;
            }
        }
        else {
            if (data && data.error) {
                this.title = data.error.title;
                this.content = data.error.message;
            }
        }
        this.childModal.show();
    };
    ConfirmOkComponent.prototype.hide = function () {
        this.childModal.hide();
        this.confirmClose.emit();
    };
    ConfirmOkComponent.prototype.close = function () {
        this.childModal.hide();
    };
    ConfirmOkComponent.prototype.cancel = function () {
        this.childModal.hide();
        this.confirmCancel.emit();
    };
    ConfirmOkComponent.prototype.onHidden = function (event) {
        if (document.querySelectorAll('[bsmodal].in').length <= 0) {
            var elem = document.getElementsByClassName('modal-backdrop');
            while (elem[0]) {
                elem[0].parentNode.removeChild(elem[0]);
            }
        }
    };
    ConfirmOkComponent.decorators = [
        { type: Component, args: [{
                    selector: 'icabs-confirmok',
                    templateUrl: 'confirm-ok.html',
                    exportAs: 'child',
                    styles: ["\n        .modal-body {\n            min-height: 150px;\n        }\n    "]
                },] },
    ];
    ConfirmOkComponent.ctorParameters = [
        { type: ChangeDetectorRef, },
        { type: RiExchange, },
    ];
    ConfirmOkComponent.propDecorators = {
        'childModal': [{ type: ViewChild, args: ['childModal',] },],
        'config': [{ type: Input },],
        'title': [{ type: Input },],
        'content': [{ type: Input },],
        'showHeader': [{ type: Input },],
        'showCloseButton': [{ type: Input },],
        'showCancel': [{ type: Input },],
        'showOk': [{ type: Input },],
        'okText': [{ type: Input },],
        'cancelText': [{ type: Input },],
        'confirmClose': [{ type: Output },],
        'confirmCancel': [{ type: Output },],
    };
    return ConfirmOkComponent;
}());
