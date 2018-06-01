import { Component } from '@angular/core';
var MockComponent = (function () {
    function MockComponent() {
        this.name = 'Dummy Component';
    }
    return MockComponent;
}());
MockComponent = __decorate([
    Component({
        selector: 'dummy',
        template: '<p>Dummy Component</p>'
    })
], MockComponent);
export { MockComponent };
