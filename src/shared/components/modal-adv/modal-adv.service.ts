import { ICabsModalConstants } from './modal-adv-vo';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Logger } from '@nsalaun/ng2-logger';

import { Observable } from 'rxjs/Observable';

@Injectable()
export class ModalAdvService {
    private _source = new BehaviorSubject<any>(0);
    private _source$ = this._source.asObservable();

    constructor(private _logger: Logger) {
    }

    public emitError(data: any): void {
        if (data) {
            data.modalType = ICabsModalConstants.MODAL_TYPE_ERROR;
        }
        this._source.next(data);
    }

    public emitMessage(data: any): void {
        if (data) {
            data.modalType = ICabsModalConstants.MODAL_TYPE_MESSAGE;
        }
        this._source.next(data);
    }

    public emitPrompt(data: any): void {
        if (data) {
            data.modalType = ICabsModalConstants.MODAL_TYPE_PROMPT;
        }
        this._source.next(data);
    }

    public getSource(): any {
        return this._source;
    }

    public getObservableSource(): any {
        return this._source$;
    }
}
