import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Logger } from '@nsalaun/ng2-logger';

import { Observable } from 'rxjs/Observable';

@Injectable()
export class ErrorService {
    private _errorSource = new BehaviorSubject<any>(0);
    private _errorSource$ = this._errorSource.asObservable();

    constructor(private _logger: Logger) {
    }

    emitError(error: any): void {
        this._errorSource.next(error);
    }

    getErrorSource(): any {
        return this._errorSource;
    }

    getObservableSource(): any {
        return this._errorSource$;
    }
}
