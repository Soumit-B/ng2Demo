import { Injectable } from '@angular/core';
export var AjaxObservableConstant = (function () {
    function AjaxObservableConstant() {
        this.START = 'START';
        this.STOP = 'STOP';
        this.COMPLETE = 'COMPLETE';
        this.RESET = 'RESET';
        this.INCREMENT = 'INCREMENT';
    }
    AjaxObservableConstant.decorators = [
        { type: Injectable },
    ];
    AjaxObservableConstant.ctorParameters = [];
    return AjaxObservableConstant;
}());
