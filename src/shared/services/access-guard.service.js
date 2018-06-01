import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Logger } from '@nsalaun/ng2-logger';
import { LocalStorageService } from 'ng2-webstorage';
import { AuthService } from './auth.service';
import { UserAccessService } from './user-access.service';
export var AccessGuardService = (function () {
    function AccessGuardService(router, logger, ls, userAccess, authService) {
        this.router = router;
        this.logger = logger;
        this.ls = ls;
        this.userAccess = userAccess;
        this.authService = authService;
    }
    AccessGuardService.prototype.canActivate = function (route, state) {
        this.authService.handleClientLoad(false, false);
        if (!this.authService.isSignedIn()) {
            this.router.navigate(['/application/login']);
            return false;
        }
        return true;
    };
    AccessGuardService.decorators = [
        { type: Injectable },
    ];
    AccessGuardService.ctorParameters = [
        { type: Router, },
        { type: Logger, },
        { type: LocalStorageService, },
        { type: UserAccessService, },
        { type: AuthService, },
    ];
    return AccessGuardService;
}());
