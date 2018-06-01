import { Component, Input, Output, EventEmitter, OnInit, OnChanges, OnDestroy, ViewChild, ViewContainerRef, ChangeDetectorRef } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap/ng2-bootstrap';
import { RiExchange } from '../../../shared/services/riExchange';

@Component({
    selector: 'icabs-confirmok',
    templateUrl: 'confirm-ok.html',
    exportAs: 'child',
    styles: [`
        .modal-body {
            min-height: 150px;
        }
    `]
})
export class ConfirmOkComponent implements OnInit, OnChanges, OnDestroy {
    @ViewChild('childModal') childModal;
    @Input() config: any;
    @Input() title: string;
    @Input() content: string;
    @Input() showHeader: boolean;
    @Input() showCloseButton: boolean;
    @Input() showCancel: boolean;
    @Input() showOk: boolean;
    @Input() okText: string;
    @Input() cancelText: string;
    @Output() confirmClose = new EventEmitter<any>();
    @Output() confirmCancel = new EventEmitter<any>();

    private _title: string;
    private _content: string;

    constructor(private _ref: ChangeDetectorRef, private riExchange: RiExchange) {}

    ngOnInit(): void {
        if (typeof this.config !== 'object' || !this.config) {
            this.config = {ignoreBackdropClick: true};
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
    }

    ngOnChanges(...args: any[]): void {
        if (typeof this.config !== 'object' && this.config) {
            this.config = {};
        }
        if (this.showCloseButton == null) {
            this.showCloseButton = true;
        }
    }

    ngOnDestroy(): void {
        this.riExchange.releaseReference(this);
        delete this;
    }

    show(data: any, error: any): void {
        if (error === true) {
            if (data && data.error) {
                this.title = data.error.title;
                this.content = data.error.message;
            } else if (data && data.errorMessage) {
                this.title = 'Error';
                this.content = data.errorMessage || data.fullError;
            }
        }
        else if (error === false) {
            if (data && data.msg) {
                this.title = data.title;
                this.content = data.msg;
            }
        } else {
            if (data && data.error) {
                this.title = data.error.title;
                this.content = data.error.message;
            }
        }
        this.childModal.show();
    }

    hide(): void {
        this.childModal.hide();
        this.confirmClose.emit();
    }
    public close(): void {
        this.childModal.hide();
    }
    public cancel(): void {
        this.childModal.hide();
        this.confirmCancel.emit();
    }

    onHidden(event: any): void {
        if (document.querySelectorAll('[bsmodal].in').length <= 0) {
            let elem = document.getElementsByClassName('modal-backdrop');
            while (elem[0]) {
                elem[0].parentNode.removeChild(elem[0]);
            }
        }
        //this.modalClose.emit();
    }
}
