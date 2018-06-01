import { Component, ViewContainerRef, ViewChild, NgZone } from '@angular/core';
import { ComponentsHelper } from 'ng2-bootstrap/ng2-bootstrap';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { ErrorService } from '../../shared/services/error.service';
import { ComponentInteractionService } from '../../shared/services/component-interaction.service';
import { LocalStorageService } from 'ng2-webstorage';
var ContractManagementRootComponent = (function () {
    function ContractManagementRootComponent(viewContainerRef, componentsHelper, _authService, _router, _ls, _componentInteractionService, _zone, _errorService) {
        var _this = this;
        this._authService = _authService;
        this._router = _router;
        this._ls = _ls;
        this._componentInteractionService = _componentInteractionService;
        this._zone = _zone;
        this._errorService = _errorService;
        this.showErrorHeader = true;
        componentsHelper.setRootViewContainerRef(viewContainerRef);
        this.componentInteractionSubscription = this._componentInteractionService.getObservableSource().subscribe(function (msg) {
            if (msg !== 0) {
                _this._zone.run(function () {
                    _this.displayNavBar = msg;
                });
            }
        });
        this._router.events.subscribe(function (event) {
            if (event.url === '/conttractmanagement') {
                _this._componentInteractionService.emitMessage(true);
            }
        });
    }
    ContractManagementRootComponent.prototype.ngOnInit = function () {
        var _this = this;
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
        this._errorService.emitError(0);
        this.errorSubscription = this._errorService.getObservableSource().subscribe(function (error) {
            if (error !== 0) {
                _this._zone.run(function () {
                    if (error.redirect) {
                        setTimeout(function () {
                            _this.errorModal.show({ error: error });
                            setTimeout(function () {
                                _this._authService.clearData();
                                _this._router.navigate(['/application/login']);
                            }, 3000);
                        }, 1000);
                    }
                    else {
                        setTimeout(function () {
                            _this.errorModal.show({ error: error });
                        }, 1000);
                    }
                });
            }
        });
        this.muleJson = this._authService.getMuleResponse();
    };
    ContractManagementRootComponent.prototype.ngAfterViewInit = function () {
    };
    ContractManagementRootComponent.prototype.ngOnDestroy = function () {
        if (this.componentInteractionSubscription) {
            this.componentInteractionSubscription.unsubscribe();
        }
        if (this.errorSubscription) {
            this.errorSubscription.unsubscribe();
        }
    };
    return ContractManagementRootComponent;
}());
__decorate([
    ViewChild('errorModal'),
    __metadata("design:type", Object)
], ContractManagementRootComponent.prototype, "errorModal", void 0);
ContractManagementRootComponent = __decorate([
    Component({
        templateUrl: 'contract-management.html',
        styles: []
    }),
    __metadata("design:paramtypes", [ViewContainerRef, ComponentsHelper, AuthService, Router, LocalStorageService, ComponentInteractionService, NgZone, ErrorService])
], ContractManagementRootComponent);
export { ContractManagementRootComponent };
