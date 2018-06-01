import { StaticUtils } from './static.utility';
import { MAIN_NAV_DESIGN } from './../components/main-nav/main-nav-design';
import { Injectable } from '@angular/core';
import { Http, Response, Jsonp, Headers, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Logger } from '@nsalaun/ng2-logger';
import { LocalStorageService } from 'ng2-webstorage';

import 'rxjs/add/operator/map';

@Injectable()
export class UserAccessService {
    private _userAccessData;
    private _accessURL = process.env.USER_ACCESS_URL;
    private _bypass = process.env.BYPASS_MULE;
    private _leftMenuData;
    private _autoCompleteData;
    private muleClientId = process.env.MULE_CLIENT_ID;
    private muleClienSecret = process.env.MULE_CLIENT_SECRET;
    private userMenuPostFix = process.env.USER_ACCESS_POSTFIX;
    private baseURL;

    constructor(private _http: Http, private _jsonp: Jsonp, private _logger: Logger,
        private _ls: LocalStorageService) {
    }

    getUserAccessResponse(token: string, email: string): Observable<any> {
        let headers = new Headers();
        headers.append('Authorization', token);
        headers.append('client_id', this.muleClientId);
        headers.append('client_secret', this.muleClienSecret);
        let params = new URLSearchParams();
        params.set('email', email);
        params.set('action', '0');

        if (this._bypass) {
            return this._http.get(this._accessURL).map((res: Response) => {
                return StaticUtils.extractDataFromResponse(res);
            });
        } else {
            let url = '';
            if (this.baseURL) {
                url = this.baseURL + this.userMenuPostFix;
            } else {
                url = this._accessURL;
            }
            return this._http.get(url, { headers: headers, search: params }).map((res: Response) => {
                return StaticUtils.extractDataFromResponse(res);
            });
        }
    }

    setUserAccessData(data: any): void {
        if (data)
            this._userAccessData = data;
    }

    getUserAccessData(): any {
        return this._userAccessData;
    }

    setLeftMenuData(data: any): void {
        if (data)
            this._leftMenuData = data;
    }

    getLeftMenuData(): any {
        return this._leftMenuData;
    }
    setAutocompleteData(data: any): void {
        if (data)
            this._autoCompleteData = data;
    }

    getAutocompleteData(): any {
        return this._autoCompleteData;
    }


    getPageBusinessCodeMapping(): any {
        let pages = {};
        if (!this._userAccessData) {
            this._userAccessData = this._ls.retrieve('MENU');
        }
        this._userAccessData.pages.map(function (entry: any): any {
            if (pages[entry.ProgramURL]) {
                pages[entry.ProgramURL].push(entry.BusinessCode);
            } else {
                pages[entry.ProgramURL] = [entry.BusinessCode];
            }
        });
        return pages;
    }

    getPageKeys(): any {
        return Object.keys(this.getPageBusinessCodeMapping());
    }

    getRouteUrlKeys(): any {
        let keys = this.getPageKeys();
        let pageBusinessMapping = this.getPageBusinessCodeMapping();
        let domains = JSON.parse(MAIN_NAV_DESIGN).menu;

        let routes = {};
        for (let i = 0; i < (keys.length); i++) {
            for (let j = 0; j < domains.length; j++) {
                for (let k = 0; k < domains[j].feature.length; k++) {

                    for (let l = 0; l < domains[j].feature[k].module.length; l++) {
                        //
                        if (keys[i] === domains[j].feature[k].module[l].programURL) {
                            routes[domains[j].feature[k].module[l].routeURL] = pageBusinessMapping[keys[i]];
                        }
                    }
                }
            }
        }
        return routes;
    }

    setBaseURL(val: string): void {
        this.baseURL = val;
    }
}
