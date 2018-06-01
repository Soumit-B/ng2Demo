import { StaticUtils } from './static.utility';
import { MAIN_NAV_DESIGN } from './../components/main-nav/main-nav-design';
import { Injectable } from '@angular/core';
import { Http, Jsonp, Headers, URLSearchParams } from '@angular/http';
import { Logger } from '@nsalaun/ng2-logger';
import { LocalStorageService } from 'ng2-webstorage';
import 'rxjs/add/operator/map';
export var UserAccessService = (function () {
    function UserAccessService(_http, _jsonp, _logger, _ls) {
        this._http = _http;
        this._jsonp = _jsonp;
        this._logger = _logger;
        this._ls = _ls;
        this._accessURL = process.env.USER_ACCESS_URL;
        this._bypass = process.env.BYPASS_MULE;
        this.muleClientId = process.env.MULE_CLIENT_ID;
        this.muleClienSecret = process.env.MULE_CLIENT_SECRET;
    }
    UserAccessService.prototype.getUserAccessResponse = function (token, email) {
        var headers = new Headers();
        headers.append('Authorization', token);
        headers.append('client_id', this.muleClientId);
        headers.append('client_secret', this.muleClienSecret);
        var params = new URLSearchParams();
        params.set('email', email);
        params.set('action', '0');
        if (this._bypass) {
            return this._http.get(this._accessURL).map(function (res) {
                return StaticUtils.extractDataFromResponse(res);
            });
        }
        else {
            return this._http.get(this._accessURL, { headers: headers, search: params }).map(function (res) {
                return StaticUtils.extractDataFromResponse(res);
            });
        }
    };
    UserAccessService.prototype.setUserAccessData = function (data) {
        if (data)
            this._userAccessData = data;
    };
    UserAccessService.prototype.getUserAccessData = function () {
        return this._userAccessData;
    };
    UserAccessService.prototype.setLeftMenuData = function (data) {
        if (data)
            this._leftMenuData = data;
    };
    UserAccessService.prototype.getLeftMenuData = function () {
        return this._leftMenuData;
    };
    UserAccessService.prototype.setAutocompleteData = function (data) {
        if (data)
            this._autoCompleteData = data;
    };
    UserAccessService.prototype.getAutocompleteData = function () {
        return this._autoCompleteData;
    };
    UserAccessService.prototype.getPageBusinessCodeMapping = function () {
        var pages = {};
        if (!this._userAccessData) {
            this._userAccessData = this._ls.retrieve('MENU');
        }
        this._userAccessData.pages.map(function (entry) {
            if (pages[entry.ProgramURL]) {
                pages[entry.ProgramURL].push(entry.BusinessCode);
            }
            else {
                pages[entry.ProgramURL] = [entry.BusinessCode];
            }
        });
        return pages;
    };
    UserAccessService.prototype.getPageKeys = function () {
        return Object.keys(this.getPageBusinessCodeMapping());
    };
    UserAccessService.prototype.getRouteUrlKeys = function () {
        var keys = this.getPageKeys();
        var pageBusinessMapping = this.getPageBusinessCodeMapping();
        var domains = JSON.parse(MAIN_NAV_DESIGN).menu;
        var routes = {};
        for (var i = 0; i < (keys.length); i++) {
            for (var j = 0; j < domains.length; j++) {
                for (var k = 0; k < domains[j].feature.length; k++) {
                    for (var l = 0; l < domains[j].feature[k].module.length; l++) {
                        if (keys[i] === domains[j].feature[k].module[l].programURL) {
                            routes[domains[j].feature[k].module[l].routeURL] = pageBusinessMapping[keys[i]];
                        }
                    }
                }
            }
        }
        return routes;
    };
    UserAccessService.decorators = [
        { type: Injectable },
    ];
    UserAccessService.ctorParameters = [
        { type: Http, },
        { type: Jsonp, },
        { type: Logger, },
        { type: LocalStorageService, },
    ];
    return UserAccessService;
}());
