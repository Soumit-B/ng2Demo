import { Injectable } from '@angular/core';
export var VariableService = (function () {
    function VariableService() {
        this.menuClick = false;
        this.logoutClick = false;
    }
    VariableService.prototype.setMenuClick = function (val) {
        this.menuClick = val;
    };
    VariableService.prototype.getMenuClick = function () {
        return this.menuClick;
    };
    VariableService.prototype.setLogoutClick = function (val) {
        this.logoutClick = val;
    };
    VariableService.prototype.getLogoutClick = function () {
        return this.logoutClick;
    };
    VariableService.decorators = [
        { type: Injectable },
    ];
    VariableService.ctorParameters = [];
    return VariableService;
}());
