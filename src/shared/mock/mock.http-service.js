import { HttpService } from '../services/http-service';
var MockHttpService = (function (_super) {
    __extends(MockHttpService, _super);
    function MockHttpService() {
        return _super.apply(this, arguments) || this;
    }
    MockHttpService.prototype.getData = function (url, options) {
        return true;
    };
    MockHttpService.prototype.setUrl = function (url) {
        return true;
    };
    MockHttpService.prototype.clearUrl = function () {
        return true;
    };
    MockHttpService.prototype.makePostRequest = function (method, moduleAPI, operation, search, form_data) {
        return true;
    };
    MockHttpService.prototype.makeGetRequest = function (method, moduleAPI, operation, search) {
    };
    return MockHttpService;
}(HttpService));
export { MockHttpService };
