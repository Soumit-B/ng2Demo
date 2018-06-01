import { UserAccessService } from '../services/user-access.service';
import { LocalStorageService } from 'ng2-webstorage';
import { MockDataConstants } from './mock.data';
var MockUserAccessService = (function (_super) {
    __extends(MockUserAccessService, _super);
    function MockUserAccessService() {
        return _super.apply(this, arguments) || this;
    }
    MockUserAccessService.prototype.getPageBusinessCodeMapping = function () {
        var pages = {};
        var userAccessData = {};
        var ls = new LocalStorageService();
        ls.store('MENU', MockDataConstants.c_o_MockMenuData);
        userAccessData = ls.retrieve('MENU');
        userAccessData['pages'].map(function (entry) {
            if (pages[entry.ProgramURL]) {
                pages[entry.ProgramURL].push(entry.BusinessCode);
            }
            else {
                pages[entry.ProgramURL] = [entry.BusinessCode];
            }
        });
        return pages;
    };
    return MockUserAccessService;
}(UserAccessService));
export { MockUserAccessService };
