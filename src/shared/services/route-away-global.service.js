import { Injectable } from '@angular/core';
export var RouteAwayGlobals = (function () {
    function RouteAwayGlobals() {
        this.ellipseOpenFlag = false;
        this.saveEnabledFlag = false;
        this.checkDirtyFlag = false;
    }
    RouteAwayGlobals.prototype.setEllipseOpenFlag = function (flag) {
        this.ellipseOpenFlag = flag;
    };
    RouteAwayGlobals.prototype.getEllipseOpenFlag = function () {
        return this.ellipseOpenFlag;
    };
    RouteAwayGlobals.prototype.setSaveEnabledFlag = function (flag) {
        this.saveEnabledFlag = flag;
    };
    RouteAwayGlobals.prototype.getDirtyFlag = function () {
        return this.checkDirtyFlag;
    };
    RouteAwayGlobals.prototype.setDirtyFlag = function (flag) {
        this.checkDirtyFlag = flag;
    };
    RouteAwayGlobals.prototype.getSaveEnabledFlag = function () {
        return this.saveEnabledFlag;
    };
    RouteAwayGlobals.prototype.resetRouteAwayFlags = function () {
        this.ellipseOpenFlag = false;
        this.saveEnabledFlag = false;
        this.checkDirtyFlag = false;
    };
    RouteAwayGlobals.decorators = [
        { type: Injectable },
    ];
    RouteAwayGlobals.ctorParameters = [];
    return RouteAwayGlobals;
}());
