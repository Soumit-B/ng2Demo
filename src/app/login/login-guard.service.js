import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Logger } from '@nsalaun/ng2-logger';
import { AuthService } from '../../shared/services/auth.service';
export var LoginGuardService = (function () {
    function LoginGuardService(_router, _authService, _logger) {
        this._router = _router;
        this._authService = _authService;
        this._logger = _logger;
    }
    LoginGuardService.prototype.canActivate = function (route) {
        this._authService.handleClientLoad(false, false);
        if (this._authService.isSignedIn() && this._authService.getMuleResponse()) {
            this._router.navigate(['/postlogin']);
            return false;
        }
        return true;
    };
    LoginGuardService.decorators = [
        { type: Injectable },
    ];
    LoginGuardService.ctorParameters = [
        { type: Router, },
        { type: AuthService, },
        { type: Logger, },
    ];
    return LoginGuardService;
}());
