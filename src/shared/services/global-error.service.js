import { LocalStorageService } from 'ng2-webstorage';
import { AuthService } from './auth.service';
import { LocationStrategy } from '@angular/common';
import { Logger } from '@nsalaun/ng2-logger';
import { Injectable, Injector } from '@angular/core';
import { SubjectService } from './subject.service';
export var GlobalErrorHandler = (function () {
    function GlobalErrorHandler(injector) {
        this.injector = injector;
        this.injectServices(injector);
    }
    GlobalErrorHandler.prototype.injectServices = function (injector) {
        this.logger = injector.get(Logger);
        this.location = injector.get(LocationStrategy);
        this.authService = injector.get(AuthService);
        this.ls = injector.get(LocalStorageService);
        this.subjectService = injector.get(SubjectService);
    };
    GlobalErrorHandler.prototype.handleError = function (error) {
        var obj = {}, dt, user, message, stack;
        message = error.message ? error.message : error.toString();
        stack = error.stack ? error.stack : '';
        if (error.rejection && error.rejection instanceof Error) {
            message = error.rejection.message;
            stack = error.rejection.stack;
        }
        dt = new Date().toISOString();
        user = this.authService.displayName;
        if (!user) {
            user = this.ls.retrieve('DISPLAYNAME');
        }
        obj.msg = message;
        obj.stack = stack;
        obj.dt = dt;
        obj.user = user;
        this.logger.error(obj);
        if (this.subjectService.getDataEvent())
            this.subjectService.getDataEvent().next(obj);
        throw error;
    };
    GlobalErrorHandler.decorators = [
        { type: Injectable },
    ];
    GlobalErrorHandler.ctorParameters = [
        { type: Injector, },
    ];
    return GlobalErrorHandler;
}());
