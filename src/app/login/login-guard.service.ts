import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { Logger } from '@nsalaun/ng2-logger';
import { AuthService } from '../../shared/services/auth.service';

@Injectable()
export class LoginGuardService implements CanActivate {

    constructor(private _router: Router, private _authService: AuthService, private _logger: Logger) { }

    canActivate(route: ActivatedRouteSnapshot): boolean {
        this._authService.handleClientLoad(false, false);
        if (this._authService.isSignedIn() && this._authService.getMuleResponse()) {
            this._router.navigate(['/postlogin']);
            return false;
        }
        return true;
    }
}
