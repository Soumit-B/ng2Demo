import { Injectable } from '@angular/core';

@Injectable()
export class AjaxObservableConstant {

    public START: string;
    public STOP: string;
    public COMPLETE: string;
    public RESET: string;
    public INCREMENT: string;

    constructor() {
        this.START = 'START';
        this.STOP = 'STOP';
        this.COMPLETE = 'COMPLETE';
        this.RESET = 'RESET';
        this.INCREMENT = 'INCREMENT';
    }
}
