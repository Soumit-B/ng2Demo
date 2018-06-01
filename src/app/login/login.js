import { Component, ViewChild, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { AuthService } from '../../shared/services/auth.service';
import { ErrorService } from '../../shared/services/error.service';
import { AjaxObservableConstant } from '../../shared/constants/ajax-observable.constant';
import { RiExchange } from '../../shared/services/riExchange';
export var LoginComponent = (function () {
    function LoginComponent(riExchange, _authService, _errorService, _router, _ajaxconstant, _zone, titleService) {
        var _this = this;
        this.riExchange = riExchange;
        this._authService = _authService;
        this._errorService = _errorService;
        this._router = _router;
        this._ajaxconstant = _ajaxconstant;
        this._zone = _zone;
        this.titleService = titleService;
        this.isRequesting = false;
        this.showHeader = true;
        this.pageTitle = 'iCabs';
        this.loginEnable = true;
        this.isRequesting = false;
        this._errorService.emitError(0);
        this._authService.ajaxSource.next(0);
        this.errorSubscription = this._errorService.getObservableSource().subscribe(function (error) {
            if (error !== 0) {
                _this._zone.run(function () {
                    console.log(error);
                    _this.errorTitle = error.title;
                    _this.errorMessage = error.message;
                    _this.childModal.show({ error: error }, true);
                });
            }
        });
        this.ajaxSubscription = this._authService.ajaxSource$.subscribe(function (event) {
            if (event !== 0) {
                _this._zone.run(function () {
                    switch (event) {
                        case _this._ajaxconstant.START:
                            _this.isRequesting = true;
                            break;
                        case _this._ajaxconstant.COMPLETE:
                            _this.isRequesting = false;
                            _this._zone.run(function () {
                                _this.isRequesting = false;
                            });
                            break;
                    }
                });
            }
        });
        this._authService.handleClientLoad(true, true);
    }
    LoginComponent.prototype.ngOnInit = function () {
        this.titleService.setTitle(this.pageTitle);
    };
    LoginComponent.prototype.ngAfterViewInit = function () {
    };
    LoginComponent.prototype.ngOnDestroy = function () {
        this.errorSubscription.unsubscribe();
        this.ajaxSubscription.unsubscribe();
    };
    LoginComponent.prototype.signIn = function (event) {
        event.preventDefault();
        this._authService.signIn();
    };
    ;
    LoginComponent.decorators = [
        { type: Component, args: [{
                    selector: 'icabs-login',
                    templateUrl: 'login.html'
                },] },
    ];
    LoginComponent.ctorParameters = [
        { type: RiExchange, },
        { type: AuthService, },
        { type: ErrorService, },
        { type: Router, },
        { type: AjaxObservableConstant, },
        { type: NgZone, },
        { type: Title, },
    ];
    LoginComponent.propDecorators = {
        'childModal': [{ type: ViewChild, args: ['childModal',] },],
    };
    return LoginComponent;
}());
