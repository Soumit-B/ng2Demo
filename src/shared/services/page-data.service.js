import { Injectable } from '@angular/core';
export var PageDataService = (function () {
    function PageDataService() {
    }
    PageDataService.prototype.getData = function () {
        return this.data;
    };
    PageDataService.prototype.getSecondaryData = function () {
        return this.secondaryData;
    };
    PageDataService.prototype.saveData = function (data) {
        this.data = data;
    };
    PageDataService.prototype.saveSecondaryData = function (data) {
        this.secondaryData = data;
    };
    PageDataService.prototype.getEllipsisIdentifier = function () {
        return this.ellipsis;
    };
    PageDataService.prototype.saveEllipsisIdentifier = function (data) {
        this.ellipsis = data;
    };
    PageDataService.prototype.clearData = function () {
        this.data = null;
    };
    PageDataService.prototype.clearSecondaryData = function () {
        this.secondaryData = null;
    };
    PageDataService.decorators = [
        { type: Injectable },
    ];
    PageDataService.ctorParameters = [];
    return PageDataService;
}());
