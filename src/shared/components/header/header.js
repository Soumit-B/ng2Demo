import { Component, Input, ViewChild } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { LocalStorageService } from 'ng2-webstorage';
import { Store } from '@ngrx/store';
import { VariableService } from '../../services/variable.service';
export var HeaderComponent = (function () {
    function HeaderComponent(_authService, _ls, store, location, router, variableService) {
        var _this = this;
        this._authService = _authService;
        this._ls = _ls;
        this.store = store;
        this.location = location;
        this.router = router;
        this.variableService = variableService;
        this.displayUserMenu = false;
        this.displayNav = false;
        this.displayBackLink = true;
        this.promptConfirmTitle = 'Confirm';
        this.promptConfirmContent = [];
        this.routerSubscription = router.events.subscribe(function (event) {
            if (event instanceof NavigationEnd) {
                if (event.url.indexOf('/postlogin') !== -1 || event.url === '/') {
                    _this.displayBackLink = false;
                }
                else {
                    _this.displayBackLink = true;
                }
            }
        });
    }
    HeaderComponent.prototype.ngOnInit = function () {
        var _this = this;
        if (window.location.hash.indexOf('/postlogin') !== -1 || window.location.hash === '/') {
            this.displayBackLink = false;
        }
        if (typeof this.displayUser === 'undefined') {
            this.displayUser = true;
        }
        this.name = this._authService.displayName;
        if (!this.name) {
            this.name = this._ls.retrieve('DISPLAYNAME');
        }
        this.mainnavref.closeNavEmit.subscribe(function (data) {
            _this.closeNav(data);
        });
        this.promptConfirmContent = ['Are you sure you want to sign out?', 'Any unsaved changes made will be lost if you continue'];
    };
    HeaderComponent.prototype.ngAfterViewInit = function () {
    };
    HeaderComponent.prototype.ngOnDestroy = function () {
        if (this.routerSubscription) {
            this.routerSubscription.unsubscribe();
        }
    };
    HeaderComponent.prototype.signOut = function (e) {
        e.preventDefault();
        this.promptModal.show();
    };
    HeaderComponent.prototype.UserMenu = function (e) {
        e.preventDefault();
        this.displayUserMenu = true;
    };
    HeaderComponent.prototype.closeUserMenu = function (e) {
        e.preventDefault();
        this.displayUserMenu = false;
    };
    HeaderComponent.prototype.hamburger = function (e) {
        e.preventDefault();
        this.displayNav = true;
    };
    HeaderComponent.prototype.closeNav = function (e) {
        e.preventDefault();
        this.displayNav = false;
    };
    HeaderComponent.prototype.promptConfirm = function (event) {
        this.variableService.setLogoutClick(true);
        this._authService.signOut();
    };
    HeaderComponent.prototype.settings = function (e) {
        e.preventDefault();
    };
    HeaderComponent.prototype.clearStore = function () {
    };
    HeaderComponent.prototype.backLinkOnClick = function (event) {
        event.preventDefault();
        this.location.back();
    };
    HeaderComponent.decorators = [
        { type: Component, args: [{
                    selector: 'icabs-header',
                    templateUrl: 'header.html'
                },] },
    ];
    HeaderComponent.ctorParameters = [
        { type: AuthService, },
        { type: LocalStorageService, },
        { type: Store, },
        { type: Location, },
        { type: Router, },
        { type: VariableService, },
    ];
    HeaderComponent.propDecorators = {
        'promptModal': [{ type: ViewChild, args: ['promptModal',] },],
        'mainnavref': [{ type: ViewChild, args: ['mainnavref',] },],
        'displayUser': [{ type: Input },],
    };
    return HeaderComponent;
}());
