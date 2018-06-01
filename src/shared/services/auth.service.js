import { StaticUtils } from './static.utility';
import { CBBConstants } from '../constants/cbb.constants';
import { CBBService } from './cbb.service';
import { UserAccessService } from './user-access.service';
import { Injectable, Injector } from '@angular/core';
import { Http, Jsonp, Headers, URLSearchParams } from '@angular/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { LocalStorageService } from 'ng2-webstorage';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Logger } from '@nsalaun/ng2-logger';
import { ErrorService } from '../services/error.service';
import { AjaxObservableConstant } from '../constants/ajax-observable.constant';
import { ErrorConstant } from '../constants/error.constant';
import { GlobalConstant } from '../constants/global.constant';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
export var AuthService = (function () {
    function AuthService(_http, _jsonp, _ls, _route, _router, _logger, _errorService, _ajaxconstant, userAccessService, injector) {
        this._http = _http;
        this._jsonp = _jsonp;
        this._ls = _ls;
        this._route = _route;
        this._router = _router;
        this._logger = _logger;
        this._errorService = _errorService;
        this._ajaxconstant = _ajaxconstant;
        this.userAccessService = userAccessService;
        this.injector = injector;
        this._client_id = process.env.CLIENT_ID;
        this._scope = process.env.SCOPE;
        this._response_type = process.env.RESPONSE_TYPE;
        this._redirect_uri = process.env.REDIRECT_URL;
        this._urlOAuth = process.env.OAUTH_URL + this._scope + '&client_id=' + this._client_id + '&redirect_uri=' + this._redirect_uri + '&response_type=' + this._response_type;
        this._urlProfile = process.env.PROFILE_URL;
        this._urlTokenInfo = process.env.TOKENINFO_URL;
        this._urlLogout = process.env.LOGOUT_URL;
        this._urlRevoke = process.env.REVOKE_URL;
        this._muleLoginAuth = process.env.MULE_LOGIN_API;
        this._muleUserCodeUrl = process.env.USER_CODE_URL;
        this._oauthGlobal = window['gapi'].auth2;
        this._error = {
            title: '',
            message: ''
        };
        this.ajaxSource = new BehaviorSubject(0);
        this.displayName = '';
        this.isGapiInitialized = false;
        this.cbbService = this.injector.get(CBBService);
        this.ajaxSource$ = this.ajaxSource.asObservable();
    }
    AuthService.prototype.signIn = function () {
        if (window['gapi'].auth2 && window['gapi'].auth2.getAuthInstance() && this.isGapiInitialized) {
            window['gapi'].auth2.getAuthInstance().disconnect();
            setTimeout(function () {
                window['gapi'].auth2.getAuthInstance().signIn();
            }, 200);
        }
    };
    AuthService.prototype.signOut = function () {
        if (window['gapi'].auth2) {
            window['gapi'].auth2.getAuthInstance().disconnect();
        }
        else {
            this.googleRevoke();
        }
        this.clearData();
        this._router.navigate(['/application/login']);
    };
    AuthService.prototype.googleSignOut = function () {
        if (window['gapi'].auth2) {
            window['gapi'].auth2.getAuthInstance().signOut();
        }
        this.clearData();
        this._router.navigate(['/application/login']);
    };
    AuthService.prototype.googleRevoke = function () {
        var url = this._urlRevoke + this._token + '&callback=JSON_CALLBACK';
        return this._jsonp.get(url)
            .map(function (res) { return res.json(); }).do(function (data) {
        });
    };
    AuthService.prototype.getProfile = function () {
        var headers = new Headers();
        headers.append('Authorization', this._token);
        return this._http.get(this._urlProfile, { headers: headers }).map(function (res) { return res.json(); }).do(function (data) {
        });
    };
    AuthService.prototype.getError = function () {
        return this._error;
    };
    AuthService.prototype.isSignedIn = function () {
        if (window['gapi'].auth2 && window['gapi'].auth2.getAuthInstance()) {
            return window['gapi'].auth2.getAuthInstance().isSignedIn.get();
        }
        else {
            this._token = this._ls.retrieve('TOKEN');
            if (this._token && this._token.length > 10) {
                return true;
            }
            else {
                return false;
            }
        }
    };
    AuthService.prototype.getToken = function () {
        if (this._token) {
            if (window['gapi'].auth2 && window['gapi'].auth2.getAuthInstance()) {
                var currentUser = window['gapi'].auth2.getAuthInstance().currentUser.get();
                this.oauthResponse = currentUser.getAuthResponse();
                if (!(this.oauthResponse.id_token === this._token)) {
                    this._token = this.oauthResponse.id_token;
                }
                this._ls.store('TOKEN', this.oauthResponse.id_token);
                this._ls.store('ACCESS_TOKEN', this.oauthResponse.access_token);
                this._ls.store('OAUTH', this.oauthResponse);
            }
            return this._token;
        }
        else {
            var token = this._ls.retrieve('TOKEN');
            if (token) {
                return token;
            }
            else {
                return null;
            }
        }
    };
    AuthService.prototype.getAccessToken = function () {
        if (this._accessToken) {
            return this._accessToken;
        }
        else {
            var accessToken = this._ls.retrieve('ACCESS_TOKEN');
            if (accessToken) {
                return accessToken;
            }
            else {
                return null;
            }
        }
    };
    AuthService.prototype.getSavedUserCode = function () {
        if (this.userCode) {
            return this.userCode;
        }
        else {
            var userCode = this._ls.retrieve('USERCODE');
            if (userCode) {
                return userCode;
            }
            else {
                return null;
            }
        }
    };
    AuthService.prototype.getMuleResponse = function () {
        if (this.muleResponse) {
            return this.muleResponse;
        }
        else {
            var muleData = this._ls.retrieve('MULE');
            if (muleData) {
                return muleData;
            }
            else {
                return null;
            }
        }
    };
    AuthService.prototype.getSavedEmail = function () {
        if (this.getGoogleData) {
            return this.getGoogleData().email;
        }
        else {
            return '';
        }
    };
    AuthService.prototype.getGoogleData = function () {
        if (this.googleData) {
            return this.googleData;
        }
        else {
            var googleData = this._ls.retrieve('GOOGLEDATA');
            if (googleData) {
                return googleData;
            }
            else {
                return { locales: [{ value: '' }] };
            }
        }
    };
    AuthService.prototype.validateToken = function () {
        var headers = new Headers();
        if (!process.env.BYPASS_MULE) {
            headers.append('Authorization', this._token);
            headers.append('client_id', process.env.MULE_CLIENT_ID);
            headers.append('client_secret', process.env.MULE_CLIENT_SECRET);
            return this._http.post(this._muleLoginAuth, {}, { headers: headers }).map(function (res) {
                try {
                    res.json();
                }
                catch (e) {
                    throw new Error(JSON.stringify(res));
                }
                return res.json();
            });
        }
        else {
            return this._http.get(this._muleLoginAuth, { headers: headers }).map(function (res) { return res.json(); }).do(function (data) {
            });
        }
    };
    AuthService.prototype.makeApiCall = function () {
        var _this = this;
        if (typeof this._timer !== 'undefined') {
            clearTimeout(this._timer);
        }
        this._timer = setTimeout(function () {
            if (_this.isSignedIn()) {
                _this.ajaxSource.next(_this._ajaxconstant.START);
                _this.validateToken().subscribe(function (data) {
                    var checkError = _this.checkError(data);
                    if (!checkError) {
                        _this.muleResponse = data;
                        _this.googleData = data;
                        _this.displayName = data.name;
                        _this._ls.store('GOOGLEDATA', data);
                        _this._ls.store('MULE', data);
                        _this._ls.store('DISPLAYNAME', data.name);
                        _this._router.navigate(['/application/setup']);
                    }
                }, function (error) {
                    _this._error.title = 'Error';
                    _this._error.message = ErrorConstant.Message.UserNotFound || error;
                    _this._errorService.emitError(_this._error);
                    _this.ajaxSource.next(_this._ajaxconstant.COMPLETE);
                });
            }
        }, 200);
    };
    AuthService.prototype.handleClientLoad = function (initialLoginLoad, triggerAPI) {
        window['gapi'].load('client:auth2', this.initClient.bind(this, initialLoginLoad, triggerAPI));
    };
    AuthService.prototype.filterErrors = function (data) {
        return data.filter(function (el) {
            return (typeof el['errorNumber'] === 'undefined' && typeof el['fullError'] === 'undefined' && typeof el['error'] === 'undefined' && el['AuthorisedBusinesses'].length > 0);
        });
    };
    AuthService.prototype.getUserAccessDetails = function () {
        var _this = this;
        this.ajaxSource.next(this._ajaxconstant.START);
        document.querySelector('icabs-app .lazy-spinner .spinner')['style'].display = 'block';
        this.getUserCode().subscribe(function (data) {
            data = _this.filterErrors(data);
            var userCodeData;
            var checkError = _this.checkError(data);
            if (!checkError) {
                _this._ls.store(CBBConstants.c_s_USERCODE_RESPONSE_STORAGE_KEY_NAME, data);
                userCodeData = StaticUtils.deepCopy(data);
                if (!(data instanceof Array)) {
                    userCodeData = [];
                    userCodeData[0] = StaticUtils.deepCopy(data);
                }
                _this.cbbService.setCBBList(_this.cbbService.formatResponsedata(data));
                _this.userCode = _this.extractUserCode(userCodeData);
                _this._ls.store('USERCODE', _this.userCode);
                _this.setUserObj(_this.userCode);
                _this.userAccessService.getUserAccessResponse(_this._token, _this.getSavedEmail()).subscribe(function (userAccess) {
                    var checkError = _this.checkError(userAccess);
                    if (!checkError) {
                        _this.data = userAccess;
                        _this.userAccessService.setUserAccessData(_this.data);
                        _this._ls.store('MENU', _this.data);
                        _this.ajaxSource.next(_this._ajaxconstant.COMPLETE);
                        document.querySelector('icabs-app .lazy-spinner .spinner')['style'].display = 'none';
                        _this._router.navigate(['/postlogin']);
                    }
                }, function (error) {
                    _this.userAccessService.getUserAccessResponse(_this._token, _this.getSavedEmail()).subscribe(function (userAccess) {
                        var checkError = _this.checkError(userAccess);
                        if (!checkError) {
                            _this.data = userAccess;
                            _this.userAccessService.setUserAccessData(_this.data);
                            _this._ls.store('MENU', _this.data);
                            _this.ajaxSource.next(_this._ajaxconstant.COMPLETE);
                            document.querySelector('icabs-app .lazy-spinner .spinner')['style'].display = 'none';
                            _this._router.navigate(['/postlogin']);
                        }
                    }, function (error) {
                        _this._error.title = 'Error';
                        _this._error.message = ErrorConstant.Message.MenuNotFound || error;
                        _this.ajaxSource.next(_this._ajaxconstant.COMPLETE);
                        document.querySelector('icabs-app .lazy-spinner .spinner')['style'].display = 'none';
                        _this._errorService.emitError(_this._error);
                        _this.clearData();
                        setTimeout(function () {
                            _this.signOut();
                        }, 2000);
                    });
                });
            }
        }, function (error) {
            _this._error.title = 'Error';
            _this._error.message = ErrorConstant.Message.UserNotFound || error;
            _this.ajaxSource.next(_this._ajaxconstant.COMPLETE);
            _this._errorService.emitError(_this._error);
            _this.clearData();
            setTimeout(function () {
                _this.signOut();
            }, 2000);
        });
    };
    AuthService.prototype.getUserCode = function () {
        var headers = new Headers();
        headers.append('Authorization', this._token);
        headers.append('client_id', process.env.MULE_CLIENT_ID);
        headers.append('client_secret', process.env.MULE_CLIENT_SECRET);
        var params = new URLSearchParams();
        if (!this.googleData)
            this.googleData = this._ls.retrieve('GOOGLEDATA');
        params.set('email', this.googleData.email);
        if (process.env.BYPASS_MULE) {
            return this._http.get(this._muleUserCodeUrl).map(function (res) {
                return res.json();
            }).do(function (data) {
            });
        }
        else {
            return this._http.get(this._muleUserCodeUrl, { headers: headers, search: params }).map(function (res) {
                return res.json();
            }).do(function (data) {
            });
        }
    };
    AuthService.prototype.extractUserCode = function (userCode) {
        var extractedData;
        var keysToDelete = [
            CBBConstants.c_s_BUSINESSES,
            CBBConstants.c_s_COUNTRY_NAME
        ];
        if (!userCode) {
            return;
        }
        extractedData = userCode[0];
        for (var idx = 0; idx < keysToDelete.length; idx++) {
            var key = keysToDelete[idx];
            delete extractedData[key];
        }
        return extractedData;
    };
    AuthService.prototype.setUserObj = function (data) {
        this._ls.store('RIUserCode', data.UserCode);
        this._ls.store('RIUserInfo', data.UserInformation);
        this._ls.store('RIUserTypeCode', data.UserTypeCode);
        this._ls.store('RIUserName', data.UserName);
        this._ls.store('RIUserEmail', data.Email);
        this._ls.store('RICountryCode', data.CountryCode);
    };
    AuthService.prototype.checkError = function (data) {
        if ((typeof data.errorNumber !== undefined && data.errorNumber) || data.error) {
            this._error.title = 'Error';
            this._error.message = ErrorConstant.Message.UserNotFound;
            this._errorService.emitError(this._error);
            this.ajaxSource.next(this._ajaxconstant.COMPLETE);
            this.clearData();
            return true;
        }
        else {
            return false;
        }
    };
    AuthService.prototype.initClient = function (initialLoginLoad, triggerAPI) {
        var _this = this;
        setTimeout(function () {
            window['gapi'].client.init({
                discoveryDocs: ['https://people.googleapis.com/$discovery/rest?version=v1'],
                clientId: _this._client_id,
                scope: _this._scope
            }).then(function () {
                _this.isGapiInitialized = true;
                window['gapi'].auth2.getAuthInstance().isSignedIn.listen(_this.updateSigninStatus.bind(_this));
                _this.updateSigninStatus(_this.isSignedIn(), initialLoginLoad, triggerAPI);
            });
        }, 500);
    };
    AuthService.prototype.updateSigninStatus = function (isSignedIn, initialLoginLoad, triggerAPI) {
        if (isSignedIn && !initialLoginLoad) {
            var currentUser = window['gapi'].auth2.getAuthInstance().currentUser.get();
            this.oauthResponse = currentUser.getAuthResponse();
            this._ls.store('TOKEN', this.oauthResponse.id_token);
            this._ls.store('ACCESS_TOKEN', this.oauthResponse.access_token);
            this._ls.store('OAUTH', this.oauthResponse);
            this._token = this.oauthResponse.id_token;
            this._accessToken = this.oauthResponse.access_token;
            if (triggerAPI !== false) {
                this.makeApiCall();
            }
        }
        else {
            this.clearData();
            this.ajaxSource.next(this._ajaxconstant.COMPLETE);
            this._router.navigate(['/application/login']);
        }
    };
    AuthService.prototype.handleError = function (error) {
        return Observable.throw(error.json().error || 'Server error');
    };
    AuthService.prototype.clearData = function () {
        this.oauthResponse = null;
        this._ls.clear();
        this.cbbService.clearStore();
        GlobalConstant.Configuration.DefaultTranslation = null;
        this._token = '';
        this._accessToken = '';
    };
    AuthService.decorators = [
        { type: Injectable },
    ];
    AuthService.ctorParameters = [
        { type: Http, },
        { type: Jsonp, },
        { type: LocalStorageService, },
        { type: ActivatedRoute, },
        { type: Router, },
        { type: Logger, },
        { type: ErrorService, },
        { type: AjaxObservableConstant, },
        { type: UserAccessService, },
        { type: Injector, },
    ];
    return AuthService;
}());
