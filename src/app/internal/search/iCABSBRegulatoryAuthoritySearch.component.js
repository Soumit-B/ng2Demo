import { Component, Input, EventEmitter, ViewChild, Output } from '@angular/core';
export var RegulatoryAuthoritySearchComponent = (function () {
    function RegulatoryAuthoritySearchComponent() {
        this.receivedsearchdata = new EventEmitter();
        this.displayFields = ['RegulatoryAuthorityNumber', 'RegulatoryAuthorityName'];
    }
    RegulatoryAuthoritySearchComponent.prototype.ngOnInit = function () { console.log(); };
    RegulatoryAuthoritySearchComponent.prototype.ngOnChanges = function (data) { console.log(); };
    RegulatoryAuthoritySearchComponent.prototype.onReceivedData = function (obj) {
        this.receivedsearchdata.emit(obj.value);
    };
    RegulatoryAuthoritySearchComponent.decorators = [
        { type: Component, args: [{
                    selector: 'icabs-regulatory-authority-search',
                    template: "<icabs-dropdown #regulatoryauthoritysearchDropDown\n  [itemsToDisplay]=\"displayFields\" [disabled]=\"isDisabled\" [isRequired]=\"isRequired\" [active]=\"active\" (selectedValue)=\"onReceivedData($event)\">\n  </icabs-dropdown>"
                },] },
    ];
    RegulatoryAuthoritySearchComponent.ctorParameters = [];
    RegulatoryAuthoritySearchComponent.propDecorators = {
        'regulatoryauthoritysearchDropDown': [{ type: ViewChild, args: ['regulatoryauthoritysearchDropDown',] },],
        'inputParams': [{ type: Input },],
        'isDisabled': [{ type: Input },],
        'active': [{ type: Input },],
        'isRequired': [{ type: Input },],
        'receivedsearchdata': [{ type: Output },],
    };
    return RegulatoryAuthoritySearchComponent;
}());
