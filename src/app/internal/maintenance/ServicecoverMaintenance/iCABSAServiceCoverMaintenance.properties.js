import { Component, Input } from '@angular/core';
export var ServiceCoverPropertiesComponent = (function () {
    function ServiceCoverPropertiesComponent() {
    }
    ServiceCoverPropertiesComponent.prototype.ngOnInit = function () {
    };
    ServiceCoverPropertiesComponent.prototype.ngOnDestroy = function () {
    };
    ServiceCoverPropertiesComponent.decorators = [
        { type: Component, args: [{
                    selector: 'icabs-service-cover-properties',
                    templateUrl: 'iCABSAServiceCoverMaintenance.properties.html'
                },] },
    ];
    ServiceCoverPropertiesComponent.ctorParameters = [];
    ServiceCoverPropertiesComponent.propDecorators = {
        'uiForm': [{ type: Input },],
    };
    return ServiceCoverPropertiesComponent;
}());
