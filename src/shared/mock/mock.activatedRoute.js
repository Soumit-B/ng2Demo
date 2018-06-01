import { ActivatedRouteSnapshot } from '@angular/router';
var MockActivatedRoute = (function () {
    function MockActivatedRoute() {
        this.snapshot = new ActivatedRouteSnapshot();
        this.snapshot['data'] = {};
        this.snapshot.data['domain'] = 'Mock Domain';
    }
    MockActivatedRoute.prototype.toString = function () {
        return "";
    };
    ;
    return MockActivatedRoute;
}());
export { MockActivatedRoute };
