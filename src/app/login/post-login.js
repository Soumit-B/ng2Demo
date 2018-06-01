import { Component, ViewChild, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { AuthService } from '../../shared/services/auth.service';
import { ErrorService } from '../../shared/services/error.service';
import { GlobalConstant } from '../../shared/constants/global.constant';
import { ComponentInteractionService } from '../../shared/services/component-interaction.service';
import { LocalStorageService, SessionStorageService } from 'ng2-webstorage';
import { RiExchange } from '../../shared/services/riExchange';
export var PostLoginComponent = (function () {
    function PostLoginComponent(riExchange, _authService, _router, _ls, _componentInteractionService, _zone, _errorService, sessionStorage, titleService) {
        var _this = this;
        this.riExchange = riExchange;
        this._authService = _authService;
        this._router = _router;
        this._ls = _ls;
        this._componentInteractionService = _componentInteractionService;
        this._zone = _zone;
        this._errorService = _errorService;
        this.sessionStorage = sessionStorage;
        this.titleService = titleService;
        this.showErrorHeader = true;
        this.componentInteractionSubscription = this._componentInteractionService.getObservableSource().subscribe(function (msg) {
            if (msg !== 0) {
                _this._zone.run(function () {
                    _this.displayNavBar = msg;
                });
            }
        });
        this.routerSubscription = this._router.events.subscribe(function (event) {
            if (event.url === '/postlogin') {
                _this._componentInteractionService.emitMessage(true);
            }
        });
    }
    PostLoginComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.displayNavBar = true;
        this.titleService.setTitle(GlobalConstant.Configuration.AppName);
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
        this._errorService.emitError(0);
        this.errorSubscription = this._errorService.getObservableSource().subscribe(function (error) {
            if (error !== 0) {
                _this._zone.run(function () {
                    if (error.redirect) {
                        setTimeout(function () {
                            _this._authService.clearData();
                            _this._router.navigate(['/application/login']);
                        }, 1000);
                    }
                    else {
                        _this.errorModal.show({ error: error });
                    }
                });
            }
        });
        this.muleJson = this._authService.getMuleResponse();
        this.sessionStorage.clear('NAVIGATION_STACK');
    };
    PostLoginComponent.prototype.ngOnDestroy = function () {
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
    PostLoginComponent.decorators = [
        { type: Component, args: [{
                    selector: 'icabs-post-login',
                    template: " <div class=\"container-fluid custom-container\"><router-outlet></router-outlet></div>\n                <icabs-modal #errorModal=\"child\" [(showHeader)]=\"showErrorHeader\" [config]=\"{backdrop: 'static'}\"></icabs-modal>"
                },] },
    ];
    PostLoginComponent.ctorParameters = [
        { type: RiExchange, },
        { type: AuthService, },
        { type: Router, },
        { type: LocalStorageService, },
        { type: ComponentInteractionService, },
        { type: NgZone, },
        { type: ErrorService, },
        { type: SessionStorageService, },
        { type: Title, },
    ];
    PostLoginComponent.propDecorators = {
        'errorModal': [{ type: ViewChild, args: ['errorModal',] },],
    };
    return PostLoginComponent;
}());
