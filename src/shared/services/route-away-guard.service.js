import { Injectable } from '@angular/core';
export var RouteAwayGuardService = (function () {
    function RouteAwayGuardService() {
    }
    RouteAwayGuardService.prototype.canDeactivate = function (component, route, state) {
        if (component.canDeactivate !== undefined) {
            return component.canDeactivate().take(2);
        }
        else {
            return true;
        }
    };
    RouteAwayGuardService.decorators = [
        { type: Injectable },
    ];
    RouteAwayGuardService.ctorParameters = [];
    return RouteAwayGuardService;
}());
