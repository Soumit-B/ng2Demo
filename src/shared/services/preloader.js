import { Observable } from 'rxjs';
export var CustomPreloadingStrategy = (function () {
    function CustomPreloadingStrategy() {
    }
    CustomPreloadingStrategy.prototype.preload = function (route, fn) {
        if (route['data'] && route.data['preload']) {
            return Observable.of(true).delay(5000).flatMap(function (_) { return fn(); });
        }
        else {
            return Observable.of(null);
        }
    };
    return CustomPreloadingStrategy;
}());
