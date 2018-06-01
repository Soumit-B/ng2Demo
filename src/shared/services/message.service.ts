import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Logger } from '@nsalaun/ng2-logger';

import { Observable } from 'rxjs/Observable';

@Injectable()
export class MessageService {
    private messageSource = new BehaviorSubject<any>(0);
    private messageSource$ = this.messageSource.asObservable();
    private interComponentMessageSource = new BehaviorSubject<any>(0);
    private interComponentMessageSource$ = this.interComponentMessageSource.asObservable();

    constructor(private _logger: Logger) {
    }

    emitMessage(message: any): void {
        this.messageSource.next(message);
    }

    emitComponentMessage(message: any): void {
        this.interComponentMessageSource.next(message);
    }

    getMessageSource(): any {
        return this.messageSource;
    }

    getObservableSource(): any {
        return this.messageSource;
    }

    getComponentMessageSource(): any {
        return this.interComponentMessageSource;
    }

    getComponentObservableSource(): any {
        return this.interComponentMessageSource;
    }
}
