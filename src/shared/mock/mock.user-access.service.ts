import { UserAccessService } from '../services/user-access.service';
import { LocalStorageService } from 'ng2-webstorage';
import { MockDataConstants } from './mock.data';

export class MockUserAccessService extends UserAccessService {
    public getPageBusinessCodeMapping(): any {
        let pages: Object = {};
        let userAccessData: Object = {};
        let ls: LocalStorageService = new LocalStorageService();
        ls.store('MENU', MockDataConstants.c_o_MockMenuData);
        userAccessData = ls.retrieve('MENU');
        userAccessData['pages'].map(function (entry: any): any {
            if (pages[entry.ProgramURL]) {
                pages[entry.ProgramURL].push(entry.BusinessCode);
            } else {
                pages[entry.ProgramURL] = [entry.BusinessCode];
            }
        });
        return pages;
    }
}
