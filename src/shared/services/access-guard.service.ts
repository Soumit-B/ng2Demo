import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, UrlSegment, RouterStateSnapshot } from '@angular/router';
import { Logger } from '@nsalaun/ng2-logger';
import { LocalStorageService } from 'ng2-webstorage';
import { AuthService } from './auth.service';
import { UserAccessService } from './user-access.service';

@Injectable()
export class AccessGuardService implements CanActivate {
    constructor(
        private router: Router,
        private logger: Logger,
        private ls: LocalStorageService,
        private userAccess: UserAccessService,
        private authService: AuthService) {
    }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        this.authService.handleClientLoad(false, false);
        if (!this.authService.isSignedIn()) {
            this.router.navigate(['/application/login']);
            this.setDisplay('none');
            return false;
        }
        return true;
    }

    private setDisplay(val: string): void {
        document.querySelector('icabs-app .lazy-spinner .spinner')['style'].display = val;
        document.querySelector('icabs-app .ajax-overlay')['style'].display = val;
    }
}
