import { Subject } from 'rxjs/Subject';
import { Injectable } from '@angular/core';
export var SubjectService = (function () {
    function SubjectService() {
        this.init();
    }
    SubjectService.prototype.init = function () {
        this.dataEvent = new Subject();
    };
    SubjectService.prototype.getObservable = function () {
        return this.dataEvent.asObservable();
    };
    SubjectService.prototype.getDataEvent = function () {
        return this.dataEvent;
    };
    SubjectService.decorators = [
        { type: Injectable },
    ];
    SubjectService.ctorParameters = [];
    return SubjectService;
}());
