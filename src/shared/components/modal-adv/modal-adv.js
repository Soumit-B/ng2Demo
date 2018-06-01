import { ICabsModalVO, ICabsModalConstants } from './modal-adv-vo';
import { Component, ViewChild } from '@angular/core';
export var ModalAdvComponent = (function () {
    function ModalAdvComponent() {
        this.config = {};
        this.options = new ICabsModalVO();
        this.showFooter = false;
    }
    ModalAdvComponent.prototype.ngOnInit = function () {
    };
    ModalAdvComponent.prototype.ngOnChanges = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
    };
    ModalAdvComponent.prototype.ngOnDestroy = function () {
    };
    ModalAdvComponent.prototype.show = function (data, error) {
        this.processData(data);
        this.childModal.show();
    };
    ModalAdvComponent.prototype.hide = function () {
        this.childModal.hide();
    };
    ModalAdvComponent.prototype.onHidden = function (event) {
        if (document.querySelectorAll('[bsmodal].in').length <= 0) {
            var elem = document.getElementsByClassName('modal-backdrop');
            while (elem[0]) {
                elem[0].parentNode.removeChild(elem[0]);
            }
        }
    };
    ModalAdvComponent.prototype.cancel = function () {
        if (this.options.cancelCallback) {
            this.options.cancelCallback.call({
                value: ModalAdvComponent.CANCEL,
                data: this.options.data
            });
        }
        this.hide();
    };
    ModalAdvComponent.prototype.save = function () {
        if (this.options.confirmCallback) {
            this.options.confirmCallback.call({
                value: ModalAdvComponent.SAVE,
                data: this.options.data
            });
        }
        this.hide();
    };
    ModalAdvComponent.prototype.processData = function (data) {
        this.resetView();
        if (data) {
            this.options.modalType = data.modalType;
            this.options.msg = data.msg;
            switch (data.modalType) {
                case ICabsModalConstants.MODAL_TYPE_ERROR:
                    this.options.title = (data.title) ? data.title : 'Error';
                    break;
                case ICabsModalConstants.MODAL_TYPE_MESSAGE:
                    this.options.title = (data.title) ? data.title : 'Message';
                    break;
                case ICabsModalConstants.MODAL_TYPE_PROMPT:
                    this.options.title = (data.title) ? data.title : 'Confirm';
                    this.options.showConfirmButton = true;
                    this.options.confirmCallback = data.confirmCallback;
                    this.options.confirmLabel = (data.confirmLabel) ? data.confirmLabel : 'Confirm';
                    this.options.showCancelButton = true;
                    this.options.cancelCallback = data.cancelCallback;
                    this.options.cancelLabel = (data.cancelLabel) ? data.cancelLabel : 'Cancel';
                    this.showFooter = true;
                    break;
            }
        }
    };
    ModalAdvComponent.prototype.resetView = function () {
        this.options = new ICabsModalVO();
        this.showFooter = false;
    };
    ModalAdvComponent.SAVE = 'save';
    ModalAdvComponent.CANCEL = 'cancel';
    ModalAdvComponent.decorators = [
        { type: Component, args: [{
                    selector: 'icabs-modal-adv',
                    templateUrl: 'modal-adv.html',
                    exportAs: 'child',
                    styles: ["\n        .shiftTop {\n            top: 35%\n        }\n        .modal-body {\n                min-height: 150px;\n            }\n    "]
                },] },
    ];
    ModalAdvComponent.ctorParameters = [];
    ModalAdvComponent.propDecorators = {
        'childModal': [{ type: ViewChild, args: ['childModal',] },],
    };
    return ModalAdvComponent;
}());
