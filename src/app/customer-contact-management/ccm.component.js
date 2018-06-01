import { Component, ViewContainerRef, ViewChild, NgZone } from '@angular/core';
import { ComponentsHelper } from 'ng2-bootstrap/ng2-bootstrap';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { ErrorService } from '../../shared/services/error.service';
import { ComponentInteractionService } from '../../shared/services/component-interaction.service';
import { LocalStorageService } from 'ng2-webstorage';
import { RiExchange } from '../../shared/services/riExchange';
export var CCMRootComponent = (function () {
    function CCMRootComponent(viewContainerRef, componentsHelper, riExchange, _authService, _router, _ls, _componentInteractionService, _zone, _errorService) {
        this.riExchange = riExchange;
        this._authService = _authService;
        this._router = _router;
        this._ls = _ls;
        this._componentInteractionService = _componentInteractionService;
        this._zone = _zone;
        this._errorService = _errorService;
        this.showErrorHeader = true;
        componentsHelper.setRootViewContainerRef(viewContainerRef);
    }
    CCMRootComponent.prototype.ngOnInit = function () {
        this.displayNavBar = true;
        this._authService.handleClientLoad(false, false);
        if (!this._authService.isSignedIn()) {
            this._router.navigate(['/application/login']);
            return;
        }
        if (!this._authService.oauthResponse) {
            this.authJson = this._ls.retrieve('OAUTH');
        }
        else {
            this.authJson = this._authService.oauthResponse;
        }
    };
    CCMRootComponent.prototype.ngAfterViewInit = function () {
    };
    CCMRootComponent.prototype.ngOnDestroy = function () {
        if (this.componentInteractionSubscription) {
            this.componentInteractionSubscription.unsubscribe();
        }
        if (this.errorSubscription) {
            this.errorSubscription.unsubscribe();
        }
        if (this.routerSubscription) {
            this.routerSubscription.unsubscribe();
        }
        this.riExchange.releaseReference(this);
    };
    CCMRootComponent.decorators = [
        { type: Component, args: [{
                    template: "\n        <router-outlet></router-outlet>\n        <icabs-modal #errorModal=\"child\" [(showHeader)]=\"showErrorHeader\" [config]=\"{backdrop: 'static'}\"></icabs-modal>\n    "
                },] },
    ];
    CCMRootComponent.ctorParameters = [
        { type: ViewContainerRef, },
        { type: ComponentsHelper, },
        { type: RiExchange, },
        { type: AuthService, },
        { type: Router, },
        { type: LocalStorageService, },
        { type: ComponentInteractionService, },
        { type: NgZone, },
        { type: ErrorService, },
    ];
    CCMRootComponent.propDecorators = {
        'errorModal': [{ type: ViewChild, args: ['errorModal',] },],
    };
    return CCMRootComponent;
}());
