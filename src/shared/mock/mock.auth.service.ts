// Dependency Import
import { AuthService } from '../services/auth.service';
import { Http, Response, Jsonp, Headers, URLSearchParams } from '@angular/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { LocalStorageService } from 'ng2-webstorage';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Logger } from '@nsalaun/ng2-logger';
import { ErrorService } from '../services/error.service';
import { AjaxObservableConstant } from '../constants/ajax-observable.constant';
import { UserAccessService } from '../services/user-access.service';

// Public class
export class MockAuthService extends AuthService {
    public displayName: string = 'John Doe';


    public signOut(): boolean {
      return true;
    }

    /**
     * getSavedUserCode - Method
     * Override and mock super method
     */
    public getSavedUserCode(): any {
      return 'A';
    }
}
