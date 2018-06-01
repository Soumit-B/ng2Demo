/**
 * @description
 * Advanced Modal component
 * AVOID CALLING METHODS MARKED AS 'View Only' FROM OUTSIDE THE COMPONENT
 * @class ModalAdvComponent
 * @implements OnInit, OnChanges, OnDestroy
 * @todo
 *  - Remove commented unused class properties and method
 * @version 1.0.0
 */
import { ICabsModalVO, ICabsModalConstants } from './modal-adv-vo';
import { modalConfigDefaults } from 'ng2-bootstrap';
import { constants } from 'os';
import { Component, Input, Output, EventEmitter, OnInit, OnChanges, OnDestroy, ViewChild, ViewContainerRef, ChangeDetectorRef, Injectable } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap/ng2-bootstrap';

@Component({
    selector: 'icabs-modal-adv',
    templateUrl: 'modal-adv.html',
    exportAs: 'child',
    styles: [`
        .shiftTop {
            top: 35%;
        }
        .modal-body-min-height {
            min-height: 100px;
            white-space: pre-line;
        }
    `]
})
export class ModalAdvComponent implements OnInit, OnChanges, OnDestroy {
    @ViewChild('childModal') childModal;

    public config: any = {
        backdrop: 'static',
        keyboard: true
    };
    public options: ICabsModalVO = new ICabsModalVO();
    public showFooter: boolean = false;
    public showMsg: boolean = true;
    public showFullError: boolean = false;
    public msgArr: any = [];
    public fullErrorArr: any = [];

    constructor() {
        //todo
    }
    /************************* Start: Lifecycle Hooks ********************************/
    public ngOnInit(): void {
        //todo
    }

    public ngOnChanges(...args: any[]): void {
        //todo
    }
    public ngOnDestroy(): void {
        //todo
    }
    /************************* End: Lifecycle Hooks ********************************/

    public show(data: any): void {
        this.processData(data);
        this.childModal.show();
    }

    public hide(): void {
        if (this.options.closeCallback) {
            this.options.closeCallback.call();
        }
        this.resetView();
        this.childModal.hide();
    }

    public onHidden(event: any): void {
        if (document.querySelectorAll('[bsmodal].in').length <= 0) {
            let elem = document.getElementsByClassName('modal-backdrop');
            while (elem[0]) {
                elem[0].parentNode.removeChild(elem[0]);
            }
        } else {
            document.querySelector('body').setAttribute('class', 'modal-open');
        }
    }

    public cancel(): void {
        let callbackData: any;
        if (this.options.cancelCallback) {
            callbackData = {
                value: ICabsModalConstants.CANCEL,
                data: this.options.data
            };
            this.options.cancelCallback.call(callbackData, callbackData);
        }
        this.hide();
    }

    public confirm(): void {
        let callbackData: any;
        if (this.options.confirmCallback) {
            callbackData = {
                value: ICabsModalConstants.CONFIRM,
                data: this.options.data
            };
            this.options.confirmCallback.call(callbackData, callbackData);
        }
        this.hide();
    }

    private processData(data: ICabsModalVO): void {
        this.resetView();
        if (data) {
            this.options.modalType = data.modalType;
            if (data.msg) {
                this.msgArr = data.msg;
                if (!Array.isArray(data.msg)) {
                    this.msgArr = [data.msg];
                }
            } else {
                this.showMsg = false;
            }

            if (data.fullError) {
                this.showFullError = true;
                this.fullErrorArr = data.fullError;
                if (!Array.isArray(data.fullError)) {
                    this.fullErrorArr = [data.fullError];
                }
            }
            if (this.options.config) {
                this.config = this.options.config;
            }
            this.options.msg = data.msg;
            this.options.confirmCallback = data.confirmCallback;
            this.options.cancelCallback = data.cancelCallback;
            this.options.closeCallback = data.closeCallback;
            this.options.data = data.data;
            switch (data.modalType) {
                case ICabsModalConstants.MODAL_TYPE_ERROR:
                    this.options.title = (data.title) ? data.title : 'Error';
                    break;
                case ICabsModalConstants.MODAL_TYPE_MESSAGE:
                    this.options.title = (data.title) ? data.title : 'Message';
                    break;
                case ICabsModalConstants.MODAL_TYPE_PROMPT:
                    this.options.title = (data.title) ? data.title : '';
                    this.options.confirmLabel = (data.confirmLabel) ? data.confirmLabel : 'Confirm';
                    this.options.cancelLabel = (data.cancelLabel) ? data.cancelLabel : 'Cancel';
                    this.showFooter = true;
                    break;
            }
        }
    }
    private resetView(): void {
        this.options = new ICabsModalVO();
        this.showFooter = false;
        this.showMsg = true;
        this.showFullError = false;
        this.msgArr = [];
        this.fullErrorArr = [];
    }
}
