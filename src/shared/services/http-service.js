import { LocalStorageService } from 'ng2-webstorage';
import { AuthService } from './auth.service';
import { ServiceConstants } from './../constants/service.constants';
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { ErrorService } from './error.service';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Router } from '@angular/router';
import { ErrorConstant } from './../constants/error.constant';
import { GlobalConstant } from './../constants/global.constant';
import { TranslateService } from 'ng2-translate/src/translate.service';
export var HttpService = (function () {
    function HttpService(http, _authService, errorService, serviceConstants, router, _ls, translate) {
        this.http = http;
        this._authService = _authService;
        this.errorService = errorService;
        this.serviceConstants = serviceConstants;
        this.router = router;
        this._ls = _ls;
        this.translate = translate;
        this.url = '';
        this.lookupCounter = 0;
        this.init();
    }
    HttpService.prototype.init = function () {
        this.setupInfo = this._ls.retrieve('SETUP_INFO');
        if (this.setupInfo) {
            this.setBaseURL(this.setupInfo.regionCode.code);
        }
    };
    HttpService.prototype.getBaseURL = function () {
        if (!this.setupInfo) {
            this.setupInfo = this._ls.retrieve('SETUP_INFO');
            if (this.setupInfo) {
                this.setBaseURL(this.setupInfo.regionCode.code);
            }
        }
        return this.baseURL;
    };
    HttpService.prototype.setBaseURL = function (data) {
        if (data === 'Europe') {
            this.baseURL = process.env.BASE_URL_EUROPE;
        }
        else if (data === 'America') {
            this.baseURL = process.env.BASE_URL_AMERICA;
        }
        else if (data === 'Australia') {
            this.baseURL = process.env.BASE_URL_AUSTRALIA;
        }
        else if (data === 'Asia') {
            this.baseURL = process.env.BASE_URL_ASIA;
        }
    };
    HttpService.prototype.getData = function (url, options) {
        var _this = this;
        var header = new Headers();
        this.header.append('client_id', process.env.MULE_CLIENT_ID ? process.env.MULE_CLIENT_ID : '');
        this.header.append('client_secret', process.env.MULE_CLIENT_SECRET ? process.env.MULE_CLIENT_SECRET : '');
        options.headers = this.header;
        if (process.env.BYPASS_MULE) {
            return this.http.get(url)
                .map(function (res) {
                return _this.extractData(res);
            })
                .catch(function (error) {
                return _this.handleError(error);
            });
        }
        else {
            return this.http.get(url, options)
                .map(function (res) {
                return _this.extractData(res);
            })
                .catch(function (error) {
                return _this.handleError(error);
            });
        }
    };
    HttpService.prototype.setUrl = function (url) {
        if (url) {
            this.url = url;
        }
    };
    HttpService.prototype.clearUrl = function () {
        this.url = '';
    };
    HttpService.prototype.xhrGet = function (method, moduleAPI, operation, search) {
        var _this = this;
        this.checkSignIn();
        this.header = new Headers();
        this.header.append(this.serviceConstants.Authorization, this._authService.getToken());
        this.header.append(this.serviceConstants.Module, moduleAPI);
        this.header.append(this.serviceConstants.Operation, operation);
        this.header.append('client_id', process.env.MULE_CLIENT_ID ? process.env.MULE_CLIENT_ID : '');
        this.header.append('client_secret', process.env.MULE_CLIENT_SECRET ? process.env.MULE_CLIENT_SECRET : '');
        search.set(this.serviceConstants.email, this._authService.getSavedEmail());
        var options = new RequestOptions();
        options.headers = this.header;
        options.search = search;
        var url = this.baseURL + method;
        if (this.url !== '') {
            url = this.url + method;
        }
        this.clearUrl();
        if (process.env.BYPASS_MULE) {
            return this.http.get(url).toPromise()
                .then(function (res) {
                return _this.extractData(res);
            })
                .catch(function (error) {
                return _this.handleError(error);
            });
        }
        else {
            document.querySelector('icabs-app .ajax-overlay')['style'].display = 'block';
            return this.http.get(url, options).toPromise()
                .then(function (res) {
                return _this.extractData(res);
            })
                .catch(function (error) {
                return _this.handleError(error);
            });
        }
    };
    HttpService.prototype.makeGetRequest = function (method, moduleAPI, operation, search) {
        var _this = this;
        this.checkSignIn();
        this.header = new Headers();
        this.header.append(this.serviceConstants.Authorization, this._authService.getToken());
        this.header.append(this.serviceConstants.Module, moduleAPI);
        this.header.append(this.serviceConstants.Operation, operation);
        this.header.append('client_id', process.env.MULE_CLIENT_ID ? process.env.MULE_CLIENT_ID : '');
        this.header.append('client_secret', process.env.MULE_CLIENT_SECRET ? process.env.MULE_CLIENT_SECRET : '');
        search.set(this.serviceConstants.email, this._authService.getSavedEmail());
        var options = new RequestOptions();
        options.headers = this.header;
        options.search = search;
        var url = this.baseURL + method;
        if (this.url !== '') {
            url = this.url + method;
        }
        this.clearUrl();
        if (process.env.BYPASS_MULE) {
            return this.http.get(url)
                .map(function (res) {
                return _this.extractData(res);
            })
                .catch(function (error) {
                return _this.handleError(error);
            });
        }
        else {
            document.querySelector('icabs-app .ajax-overlay')['style'].display = 'block';
            return this.http.get(url, options)
                .map(function (res) {
                return _this.extractData(res);
            })
                .catch(function (error) {
                return _this.handleError(error);
            });
        }
    };
    HttpService.prototype.xhrPost = function (method, moduleAPI, operation, search, form_data) {
        var _this = this;
        this.checkSignIn();
        this.header = new Headers();
        this.header.append(this.serviceConstants.Authorization, this._authService.getToken());
        this.header.append(this.serviceConstants.Module, moduleAPI);
        this.header.append(this.serviceConstants.Operation, operation);
        this.header.append(this.serviceConstants.ContentType, 'application/x-www-form-urlencoded');
        this.header.append('client_id', process.env.MULE_CLIENT_ID ? process.env.MULE_CLIENT_ID : '');
        this.header.append('client_secret', process.env.MULE_CLIENT_SECRET ? process.env.MULE_CLIENT_SECRET : '');
        search.set(this.serviceConstants.email, this._authService.getSavedEmail());
        var options = new RequestOptions();
        options.headers = this.header;
        options.search = search;
        var query = '';
        for (var key in form_data) {
            if (key) {
                query += encodeURIComponent(key) + '=' + encodeURIComponent(form_data[key]) + '&';
            }
        }
        query = query.slice(0, -1);
        var url = this.baseURL + method;
        if (process.env.BYPASS_MULE) {
            return this.http.post(url, query, options).toPromise()
                .then(function (res) {
                return _this.extractData(res);
            })
                .catch(function (error) {
                return _this.handleError(error);
            });
        }
        else {
            document.querySelector('icabs-app .ajax-overlay')['style'].display = 'block';
            return this.http.post(url, query, options).toPromise()
                .then(function (res) {
                return _this.extractData(res);
            })
                .catch(function (error) {
                return _this.handleError(error);
            });
        }
    };
    HttpService.prototype.makePostRequest = function (method, moduleAPI, operation, search, form_data) {
        var _this = this;
        this.checkSignIn();
        this.header = new Headers();
        this.header.append(this.serviceConstants.Authorization, this._authService.getToken());
        this.header.append(this.serviceConstants.Module, moduleAPI);
        this.header.append(this.serviceConstants.Operation, operation);
        this.header.append(this.serviceConstants.ContentType, 'application/x-www-form-urlencoded');
        this.header.append('client_id', process.env.MULE_CLIENT_ID ? process.env.MULE_CLIENT_ID : '');
        this.header.append('client_secret', process.env.MULE_CLIENT_SECRET ? process.env.MULE_CLIENT_SECRET : '');
        search.set(this.serviceConstants.email, this._authService.getSavedEmail());
        var options = new RequestOptions();
        options.headers = this.header;
        options.search = search;
        var query = '';
        for (var key in form_data) {
            if (key) {
                query += encodeURIComponent(key) + '=' + encodeURIComponent(form_data[key]) + '&';
            }
        }
        query = query.slice(0, -1);
        var url = this.baseURL + method;
        if (process.env.BYPASS_MULE) {
            return this.http.post(url, query, options)
                .map(function (res) {
                return _this.extractData(res);
            })
                .catch(function (error) {
                return _this.handleError(error);
            });
        }
        else {
            document.querySelector('icabs-app .ajax-overlay')['style'].display = 'block';
            return this.http.post(url, query, options)
                .map(function (res) {
                return _this.extractData(res);
            })
                .catch(function (error) {
                return _this.handleError(error);
            });
        }
    };
    HttpService.prototype.makePostJsonRequest = function (method, moduleAPI, operation, search, form_data, contentType) {
        var _this = this;
        this.checkSignIn();
        this.header = new Headers();
        this.header.append(this.serviceConstants.Authorization, this._authService.getToken());
        this.header.append(this.serviceConstants.Module, moduleAPI);
        this.header.append(this.serviceConstants.Operation, operation);
        this.header.append(this.serviceConstants.ContentType, contentType ? contentType : 'application/json');
        this.header.append('client_id', process.env.MULE_CLIENT_ID ? process.env.MULE_CLIENT_ID : '');
        this.header.append('client_secret', process.env.MULE_CLIENT_SECRET ? process.env.MULE_CLIENT_SECRET : '');
        search.set(this.serviceConstants.email, this._authService.getSavedEmail());
        var options = new RequestOptions();
        options.headers = this.header;
        options.search = search;
        var url = this.baseURL + method;
        if (process.env.BYPASS_MULE) {
            return this.http.post(url, form_data, options)
                .map(function (res) {
                return _this.extractData(res);
            })
                .catch(function (error) {
                return _this.handleError(error);
            });
        }
        else {
            document.querySelector('icabs-app .ajax-overlay')['style'].display = 'block';
            return this.http.post(url, form_data, options)
                .map(function (res) {
                return _this.extractData(res);
            })
                .catch(function (error) {
                return _this.handleError(error);
            });
        }
    };
    HttpService.prototype.lookUpRequest = function (search, form_data) {
        var _this = this;
        this.checkSignIn();
        var header = new Headers();
        header.append(this.serviceConstants.Authorization, this._authService.getToken());
        header.append(this.serviceConstants.ContentType, 'application/json');
        header.append('client_id', process.env.MULE_CLIENT_ID ? process.env.MULE_CLIENT_ID : '');
        header.append('client_secret', process.env.MULE_CLIENT_SECRET ? process.env.MULE_CLIENT_SECRET : '');
        search.set(this.serviceConstants.email, this._authService.getSavedEmail());
        var options = new RequestOptions();
        options.headers = header;
        options.search = search;
        var url = this.baseURL + process.env.LOOK_UP;
        if (process.env.BYPASS_MULE) {
            return this.http.post(url, form_data, options)
                .map(function (res) {
                return _this.extractData(res);
            })
                .catch(function (error) {
                return _this.handleError(error);
            });
        }
        else {
            document.querySelector('icabs-app .ajax-overlay')['style'].display = 'block';
            return this.http.post(url, form_data, options)
                .map(function (res) {
                return _this.extractData(res);
            })
                .catch(function (error) {
                return _this.handleError(error);
            });
        }
    };
    HttpService.prototype.lookUpPromise = function (search, form_data) {
        var _this = this;
        this.checkSignIn();
        var header = new Headers();
        header.append(this.serviceConstants.Authorization, this._authService.getToken());
        header.append(this.serviceConstants.ContentType, 'application/json');
        header.append('client_id', process.env.MULE_CLIENT_ID ? process.env.MULE_CLIENT_ID : '');
        header.append('client_secret', process.env.MULE_CLIENT_SECRET ? process.env.MULE_CLIENT_SECRET : '');
        search.set(this.serviceConstants.email, this._authService.getSavedEmail());
        var options = new RequestOptions();
        options.headers = header;
        options.search = search;
        var url = this.baseURL + process.env.LOOK_UP;
        if (process.env.BYPASS_MULE) {
            return this.http.post(url, form_data, options)
                .toPromise()
                .then(function (res) {
                return _this.extractData(res);
            })
                .catch(function (error) {
                return _this.handleError(error);
            });
        }
        else {
            document.querySelector('icabs-app .ajax-overlay')['style'].display = 'block';
            return this.http.post(url, form_data, options)
                .toPromise()
                .then(function (res) {
                return _this.extractData(res);
            })
                .catch(function (error) {
                return _this.handleError(error);
            });
        }
    };
    HttpService.prototype.sysCharRequest = function (search) {
        var _this = this;
        this.checkSignIn();
        var header = new Headers();
        header.append(this.serviceConstants.Authorization, this._authService.getToken());
        header.append('client_id', process.env.MULE_CLIENT_ID ? process.env.MULE_CLIENT_ID : '');
        header.append('client_secret', process.env.MULE_CLIENT_SECRET ? process.env.MULE_CLIENT_SECRET : '');
        search.set(this.serviceConstants.email, this._authService.getSavedEmail());
        search.set(this.serviceConstants.Action, '0');
        var options = new RequestOptions();
        options.headers = header;
        options.search = search;
        var url = this.baseURL + process.env.SYS_CHAR;
        if (process.env.BYPASS_MULE) {
            return this.http.get(url, options)
                .map(function (res) {
                return _this.extractData(res);
            })
                .catch(function (error) {
                return _this.handleError(error);
            });
        }
        else {
            document.querySelector('icabs-app .ajax-overlay')['style'].display = 'block';
            return this.http.get(url, options)
                .map(function (res) {
                return _this.extractData(res);
            })
                .catch(function (error) {
                return _this.handleError(error);
            });
        }
    };
    HttpService.prototype.riGetErrorMessage = function (errorCode, countryCode, businessCode) {
        var _this = this;
        var queryLookUp = new URLSearchParams();
        var userCode = this._authService.getSavedUserCode();
        var gLanguageCode = '';
        var errorMsg = '';
        var data = [{
                'table': 'UserInformation',
                'query': { 'UserCode': userCode.UserCode },
                'fields': ['LanguageCode', 'UserCode']
            }];
        queryLookUp.set(this.serviceConstants.Action, '0');
        queryLookUp.set(this.serviceConstants.BusinessCode, businessCode);
        queryLookUp.set(this.serviceConstants.CountryCode, countryCode);
        queryLookUp.set(this.serviceConstants.MaxResults, '100');
        this.lookUpRequest(queryLookUp, data).subscribe(function (e) {
            if (e.status === GlobalConstant.Configuration.Failure) {
            }
            else {
                if (!e.errorMessage) {
                    var found = false;
                    if (e['results'] && e['results'].length > 0) {
                        for (var i = 0; i < e['results'][0].length; i++) {
                            if (e['results'][0][i].LanguageCode !== '') {
                                gLanguageCode = e['results'][0][i].LanguageCode;
                                found = true;
                                break;
                            }
                        }
                        if (!found) {
                            gLanguageCode = GlobalConstant.Configuration.ENG;
                        }
                        var errorData = [{
                                'table': 'ErrorMessageLanguage',
                                'query': { 'LanguageCode': gLanguageCode, 'ErrorMessageCode': errorCode.toString() },
                                'fields': ['ErrorMessageCode', 'ErrorMessageDisplayDescription']
                            }];
                        _this.lookUpRequest(queryLookUp, errorData).subscribe(function (f) {
                            if (f.status === GlobalConstant.Configuration.Failure) {
                            }
                            else {
                                if (!f.errorMessage) {
                                    if (f['results'] && f['results'].length > 0) {
                                        errorMsg = f['results'][0][0].ErrorMessageDisplayDescription;
                                        _this.dataEvent.next(errorMsg);
                                    }
                                    else {
                                        var errorData2 = [{
                                                'table': 'ErrorMessage',
                                                'query': { 'ErrorMessageCode': errorCode.toString() },
                                                'fields': ['ErrorMessageCode', 'ErrorMessageDescription']
                                            }];
                                        _this.lookUpRequest(queryLookUp, errorData2).subscribe(function (k) {
                                            if (k.status === GlobalConstant.Configuration.Failure) {
                                            }
                                            else {
                                                if (!k.errorMessage) {
                                                    if (k['results'] && k['results'].length > 0) {
                                                        errorMsg = k['results'][0][0].ErrorMessageDescription;
                                                    }
                                                    else {
                                                        errorMsg = ErrorConstant.Message.ErrorMessageNotFound;
                                                    }
                                                    _this.dataEvent.next(errorMsg);
                                                }
                                            }
                                        }, function (error) {
                                        });
                                    }
                                }
                            }
                        }, function (error) {
                        });
                    }
                }
            }
        }, function (error) {
        });
        this.dataEvent = new Subject();
        return this.dataEvent.asObservable();
    };
    HttpService.prototype.convertJSONtoFormData = function (data) {
        var str = [];
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                str.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
            }
        }
        return str.join('&');
    };
    HttpService.prototype.extractData = function (res) {
        document.querySelector('icabs-app .ajax-overlay')['style'].display = 'none';
        var body = res.json();
        if (typeof body['error_description'] !== 'undefined' && body['error_description'].toString().indexOf(ErrorConstant.Message.Invalid) !== -1) {
            return Observable.throw(res);
        }
        if (body && body.hasOwnProperty('oResponse')) {
            if (body.info && body.info.error) {
                body.oResponse = {};
                body.oResponse.errorMessage = body.info.error;
                body.oResponse.hasError = true;
            }
            else if (body.oResponse && body.oResponse.errorMessage) {
                body.oResponse.hasError = true;
            }
            else if (body.oResponse && body.oResponse.ErrorMessageDesc) {
                body.oResponse.hasError = true;
                body.oResponse.errorMessage = body.oResponse.ErrorMessageDesc;
            }
            return body.oResponse;
        }
        return body || {};
    };
    HttpService.prototype.handleError = function (error) {
        document.querySelector('icabs-app .ajax-overlay')['style'].display = 'none';
        return Observable.throw(error);
    };
    HttpService.prototype.setErrorMessage = function (msg, response) {
        this.getTranslatedValue(msg, null).subscribe(function (res) {
            if (res) {
                response.errorMessage = res;
            }
        });
    };
    HttpService.prototype.getTranslatedValue = function (key, params) {
        if (params) {
            return this.translate.get(key, { value: params });
        }
        else {
            return this.translate.get(key);
        }
    };
    HttpService.prototype.checkSignIn = function () {
    };
    HttpService.decorators = [
        { type: Injectable },
    ];
    HttpService.ctorParameters = [
        { type: Http, },
        { type: AuthService, },
        { type: ErrorService, },
        { type: ServiceConstants, },
        { type: Router, },
        { type: LocalStorageService, },
        { type: TranslateService, },
    ];
    return HttpService;
}());
