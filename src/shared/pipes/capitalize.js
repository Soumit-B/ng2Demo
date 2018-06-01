import { Pipe } from '@angular/core';
export var CapitalizePipe = (function () {
    function CapitalizePipe() {
    }
    CapitalizePipe.prototype.transform = function (value, args) {
        if (!value)
            return value;
        return value.replace(/\w\S*/g, function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    };
    CapitalizePipe.decorators = [
        { type: Pipe, args: [{ name: 'capitalize' },] },
    ];
    CapitalizePipe.ctorParameters = [];
    return CapitalizePipe;
}());
