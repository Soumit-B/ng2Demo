import { Component, Input, Output, EventEmitter, OnInit, OnChanges, OnDestroy, ViewChild, ViewContainerRef, ChangeDetectorRef } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap/ng2-bootstrap';
import { RiExchange } from '../../../shared/services/riExchange';

@Component({
    selector: 'icabs-prompt-modal',
    templateUrl: 'prompt-modal.html',
    exportAs: 'child',
    styles: [`
    .shiftTop {
        top: 35%;
        width: 100%;
        position: fixed;
        z-index: 1050;
    }
    .shiftTop .modal {
        position: relative;
    }
    `]
})
export class PromptModalComponent implements OnInit, OnChanges, OnDestroy {
    @ViewChild('childModal') childModal;
    @Input() config: any;
    @Input() title: string;
    @Input() optValueYesorNo: string;
    @Input() content: any;
    @Input() shiftTop: boolean;
    @Input() showHeader: boolean;
    @Input() showCloseButton: boolean;
    @Output() saveEmit = new EventEmitter();
    @Output() cancelEmit = new EventEmitter();

    private _title: string;
    private _content: string;
    private _data: any;

    public static readonly SAVE: string = 'save';
    public static readonly CANCEL: string = 'cancel';
    public isContentAnArray: boolean = false;

    constructor(private _ref: ChangeDetectorRef, private riExchange: RiExchange) { }

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
        if (this.shiftTop === null || this.shiftTop === undefined) {
            this.shiftTop = false;
        }
        this._title = this.title;
        this._content = this.content;
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
        this.riExchange.releaseReference(this);
        //delete this;
    }

    show(data: any, error: any): void {
        this._data = data;
        if (this.content instanceof Array) {
            this.isContentAnArray = true;
        } else {
            this.isContentAnArray = false;
        }
        this.childModal.show();
    }

    hide(): void {
        this.childModal.hide();
    }

    onHidden(event: any): void {
        if (document.querySelectorAll('[bsmodal].in').length <= 0) {
            let elem = document.getElementsByClassName('modal-backdrop');
            while (elem[0]) {
                elem[0].parentNode.removeChild(elem[0]);
            }
        }
    }

    cancel(): void {
        this.cancelEmit.emit({
            value: PromptModalComponent.CANCEL,
            data: this._data
        });
        if (this.childModal !== null)
            this.childModal.hide();
    }

    save(): void {
        this.saveEmit.emit({
            value: PromptModalComponent.SAVE,
            data: this._data
        });
        if (this.childModal !== null)
            this.childModal.hide();
    }
}
