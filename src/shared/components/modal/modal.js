import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { RiExchange } from '../../../shared/services/riExchange';
export var ModalComponent = (function () {
    function ModalComponent(_ref, riExchange, ele) {
        this._ref = _ref;
        this.riExchange = riExchange;
        this.ele = ele;
        this.modalClose = new EventEmitter();
        this.isArrayType = false;
        this.isfirstfocus = true;
    }
    ModalComponent.prototype.ngOnInit = function () {
        if (typeof this.config !== 'object' || !this.config) {
            this.config = {};
        }
        if (this.showCloseButton == null) {
            this.showCloseButton = true;
        }
        this._title = this.title;
        this._content = this.content;
    };
    ModalComponent.prototype.ngOnChanges = function () {
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
    ModalComponent.prototype.ngOnDestroy = function () {
    };
    ModalComponent.prototype.show = function (data, error) {
        if (error === true) {
            if (data && data.error) {
                this.title = data.error.title;
                this.content = data.error.message;
            }
            else if (data && (data.errorMessage || data.fullError)) {
                this.title = 'Error';
                this.content = data.errorMessage || data.fullError;
                if (this.content instanceof Array) {
                    this.isArrayType = true;
                }
                else {
                    this.isArrayType = false;
                }
            }
            else if (data && (data.msg && data.stack)) {
                this.title = 'UI Console Error';
                this.content = data.msg + ' ' + data.stack;
            }
        }
        else if (error === false) {
            if (data && data.msg) {
                this.title = data.title;
                this.content = data.msg;
                if (typeof this.content === 'string') {
                    this.isArrayType = false;
                }
                else {
                    this.isArrayType = true;
                }
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
    ModalComponent.prototype.hide = function () {
        this.isfirstfocus = true;
        this.childModal.hide();
        this.modalClose.emit();
    };
    ModalComponent.prototype.onHidden = function (event) {
        if (document.querySelectorAll('[bsmodal].in').length <= 0) {
            var elem = document.getElementsByClassName('modal-backdrop');
            while (elem[0]) {
                elem[0].parentNode.removeChild(elem[0]);
            }
        }
        else {
            document.querySelector('body').setAttribute('class', 'modal-open');
        }
        this.modalClose.emit();
    };
    ModalComponent.prototype.gotofirst = function () {
        var tabbables = this.ele.nativeElement.querySelectorAll('.modal-content input, .modal-content textarea, .modal-content button, .modal-content a, .modal-content select');
        tabbables[0].focus();
    };
    ModalComponent.prototype.gotolast = function () {
        var tabbables = this.ele.nativeElement.querySelectorAll('.modal-content input, .modal-content textarea, .modal-content button, .modal-content a, .modal-content select');
        if (this.isfirstfocus) {
            tabbables[0].focus();
            this.isfirstfocus = false;
        }
        else {
            tabbables[tabbables.length - 2].focus();
        }
    };
    ModalComponent.decorators = [
        { type: Component, args: [{
                    selector: 'icabs-modal',
                    templateUrl: 'modal.html',
                    exportAs: 'child',
                    styles: ["\n        .modal-body {\n            min-height: 150px;\n        }\n    "]
                },] },
    ];
    ModalComponent.ctorParameters = [
        { type: ChangeDetectorRef, },
        { type: RiExchange, },
        { type: ElementRef, },
    ];
    ModalComponent.propDecorators = {
        'childModal': [{ type: ViewChild, args: ['childModal',] },],
        'config': [{ type: Input },],
        'title': [{ type: Input },],
        'content': [{ type: Input },],
        'showHeader': [{ type: Input },],
        'showCloseButton': [{ type: Input },],
        'modalClose': [{ type: Output },],
    };
    return ModalComponent;
}());
