import { Observable } from 'rxjs/Rx';
import { Injectable, Component } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    CanActivate,
    CanDeactivate,
    Router,
    RouterStateSnapshot
} from '@angular/router';

export interface ComponentCanDeactivate {
  canDeactivate: () => Observable<boolean>;
}

@Injectable()
export class RouteAwayGuardService implements CanDeactivate<ComponentCanDeactivate> {
    canDeactivate(component: ComponentCanDeactivate, route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
        if (component.canDeactivate !== undefined) {
            return component.canDeactivate().take(2);
        } else {
            return true;
        }
    }
}
