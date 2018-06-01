import { AuthService } from '../services/auth.service';
var MockAuthService = (function (_super) {
    __extends(MockAuthService, _super);
    function MockAuthService() {
        var _this = _super.apply(this, arguments) || this;
        _this.displayName = 'John Doe';
        return _this;
    }
    MockAuthService.prototype.signOut = function () {
        return true;
    };
    MockAuthService.prototype.getSavedUserCode = function () {
        return 'A';
    };
    return MockAuthService;
}(AuthService));
export { MockAuthService };
