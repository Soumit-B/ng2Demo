import { Component, Input, Output, EventEmitter, OnInit, OnChanges, OnDestroy, ViewChild, ElementRef, ViewContainerRef, ChangeDetectorRef } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap/ng2-bootstrap';
import { RiExchange } from '../../../shared/services/riExchange';
import { Utils } from '../../../shared/services/utility';

@Component({
    selector: 'icabs-modal',
    templateUrl: 'modal.html',
    exportAs: 'child',
    styles: [`
        .modal-body {
            min-height: 150px;
        }
    `]
})
export class ModalComponent implements OnInit, OnChanges, OnDestroy {
    @ViewChild('childModal') childModal;
    @Input() config: any;
    @Input() title: string;
    @Input() content: any;
    @Input() showHeader: boolean;
    @Input() showCloseButton: boolean;
    @Input() triggerEmitterOnClose: boolean;
    @Output() modalClose = new EventEmitter<any>();

    public isArrayType = false;
    public isFullError = false;
    public isFullErrorArrayType = false;
    public fullErrorContent: any;
    private _title: string;
    private _content: any;
    public isfirstfocus: boolean = true;
    constructor(private _ref: ChangeDetectorRef, private riExchange: RiExchange, private ele: ElementRef, private util: Utils) { }

    ngOnInit(): void {
        if (typeof this.config !== 'object' || !this.config || ((Object.keys(this.config).length === 0 && this.config.constructor === Object))) {
            this.config = {
                backdrop: 'static',
                keyboard: true
            };
        }
        if (this.showCloseButton == null) {
            this.showCloseButton = true;
        }

        this._title = this.title;
        this._content = this.content;
        if (this.triggerEmitterOnClose === null || this.triggerEmitterOnClose === undefined) {
            this.triggerEmitterOnClose = true;
        }
    }

    ngOnChanges(...args: any[]): void {
        if (typeof this.config !== 'object' || !this.config || ((Object.keys(this.config).length === 0 && this.config.constructor === Object))) {
            this.config = {
                backdrop: 'static',
                keyboard: true
            };
        }
        if (this.showCloseButton == null) {
            this.showCloseButton = true;
        }
    }

    ngOnDestroy(): void {
        //this.riExchange.releaseReference(this);
    }

    show(data: any, error?: any): void {
        this.fullErrorContent = '';
        this.isFullError = false;
        if (error === true) {
            if (data && data.error) {
                this.title = data.error.title;
                this.content = data.error.message;
            } else if (data && (data.errorMessage || data.fullError)) {
                this.title = 'Error';
                this.content = data.errorMessage;
                if (this.content instanceof Array) {
                    this.isArrayType = true;
                } else {
                    this.isArrayType = false;
                }
                if (data.fullError) {
                    this.isFullError = true;
                    if (data.fullError instanceof Array) {
                        this.isFullErrorArrayType = true;
                    } else {
                        this.isFullErrorArrayType = false;
                    }
                    this.fullErrorContent = data.fullError;
                }
            } else if (data && (data.msg && data.stack)) {
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
                } else {
                    this.isArrayType = true;
                }
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
        this.isfirstfocus = true;
        this.childModal.hide();
        if (this.triggerEmitterOnClose === false) {
            return;
        }
        this.modalClose.emit();
    }

    onHidden(event: any): void {
        if (document.querySelectorAll('[bsmodal].in').length <= 0) {
            let elem = document.getElementsByClassName('modal-backdrop');
            while (elem[0]) {
                elem[0].parentNode.removeChild(elem[0]);
            }
        } else {
            document.querySelector('body').setAttribute('class', 'modal-open');
        }
        //document.querySelector('icabs-app .lazy-spinner .spinner')['style'].display = 'none';
        //document.querySelector('icabs-app .ajax-overlay')['style'].display = 'none';
        this.util.resetOptions();
        this.modalClose.emit();
    }
    gotofirst(): void {
        let tabbables = this.ele.nativeElement.querySelectorAll('.modal-content input, .modal-content textarea, .modal-content button, .modal-content a, .modal-content select');
        tabbables[0].focus();
    }
    gotolast(): void {
        let tabbables = this.ele.nativeElement.querySelectorAll('.modal-content input, .modal-content textarea, .modal-content button, .modal-content a, .modal-content select');
        if (this.isfirstfocus) {
            tabbables[0].focus();
            this.isfirstfocus = false;
        } else {
            tabbables[tabbables.length - 2].focus();
        }
    }
}
