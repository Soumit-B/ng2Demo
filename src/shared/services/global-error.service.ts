import { LocalStorageService } from 'ng2-webstorage';
import { AuthService } from './auth.service';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { Logger } from '@nsalaun/ng2-logger';
import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { SubjectService } from './subject.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
    //Inject classes
    private logger: Logger;
    private location: LocationStrategy;
    private authService: AuthService;
    private ls: LocalStorageService;
    private subjectService: SubjectService;

    constructor(private injector: Injector) {
        this.injectServices(injector);
    }
    private injectServices(injector: Injector): void {
        this.logger = injector.get(Logger);
        this.location = injector.get(LocationStrategy);
        this.authService = injector.get(AuthService);
        this.ls = injector.get(LocalStorageService);
        this.subjectService = injector.get(SubjectService);
    }
    handleError(error: any): void {
        let obj: any = {}, dt: any, user: any, message: any, stack;

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

        // IMPORTANT: Rethrow the error otherwise it gets swallowed
        throw error;
    }
}
