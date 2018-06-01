import {
    Observable
} from 'rxjs/Observable';
import {
    Subject
} from 'rxjs/Subject';
import {
    Injectable
} from '@angular/core';

@Injectable()
export class SubjectService {
    private dataEvent: any;
    constructor() {
        this.init();
    }

    init(): void {
        this.dataEvent = new Subject < any > ();
    }

    getObservable(): any {
        return this.dataEvent.asObservable();
    }

    getDataEvent(): any {
        return this.dataEvent;
    }
}
