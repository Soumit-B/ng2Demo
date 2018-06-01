import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Logger } from '@nsalaun/ng2-logger';

import { Observable } from 'rxjs/Observable';

@Injectable()
export class ComponentInteractionService {
    private _interactionSource = new BehaviorSubject<any>(0);
    private _interactionSource$ = this._interactionSource.asObservable();

    constructor(private _logger: Logger) { }

    emitMessage(msg: any): void {
        this._interactionSource.next(msg);
    }

    getInteractionSource(): any {
        return this._interactionSource;
    }

    getObservableSource(): any {
        return this._interactionSource$;
    }
}
