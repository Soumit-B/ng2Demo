import { Component, Input } from '@angular/core';
export var PremisePropertiesComponent = (function () {
    function PremisePropertiesComponent() {
    }
    PremisePropertiesComponent.prototype.ngOnInit = function () {
    };
    PremisePropertiesComponent.prototype.ngOnDestroy = function () {
    };
    PremisePropertiesComponent.decorators = [
        { type: Component, args: [{
                    selector: 'icabs-premise-properties',
                    templateUrl: 'iCABSAPremiseMaintenance.properties.html'
                },] },
    ];
    PremisePropertiesComponent.ctorParameters = [];
    PremisePropertiesComponent.propDecorators = {
        'uiForm': [{ type: Input },],
    };
    return PremisePropertiesComponent;
}());
