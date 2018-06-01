import { LocalStorageService } from 'ng2-webstorage';
import { AuthService } from './auth.service';
import { ServiceConstants } from './../constants/service.constants';
import { Injectable, Inject } from '@angular/core';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { ErrorService } from './error.service';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Router } from '@angular/router';
import { ErrorConstant } from './../constants/error.constant';
import { GlobalConstant } from './../constants/global.constant';
import { TranslateService } from 'ng2-translate/src/translate.service';
import { DOCUMENT } from '@angular/platform-browser';

@Injectable()
export class HttpService {
    private header: Headers;
    private url: string = '';
    private lookupCounter = 0;
    private setupInfo: any;
    private baseURL: string;
    private dataEventArray: Array<any> = [];
    private isAjaxRunning: boolean = false;
    private timeout: any;

    constructor(private http: Http,
        private _authService: AuthService,
        private errorService: ErrorService,
        private serviceConstants: ServiceConstants,
        private router: Router,
        private _ls: LocalStorageService,
        private translate: TranslateService,
        @Inject(DOCUMENT) private document: any) {
        this.init();
    }

    private init(): void {
        this.setupInfo = this._ls.retrieve('SETUP_INFO');
        if (this.setupInfo) {
            this.setBaseURL(this.setupInfo.regionCode.code);
        }
    }
    public getBaseURL(): string {
        if (!this.setupInfo) {
            this.setupInfo = this._ls.retrieve('SETUP_INFO');
            if (this.setupInfo) {
                this.setBaseURL(this.setupInfo.regionCode.code);
            }
        }
        return this.baseURL;
    }
    public setBaseURL(data: any): void {
        if (data === 'Europe') {
            this.baseURL = process.env.BASE_URL_EUROPE;
        } else if (data === 'America') {
            this.baseURL = process.env.BASE_URL_AMERICA;
        } else if (data === 'Australia') {
            this.baseURL = process.env.BASE_URL_AUSTRALIA;
        } else if (data === 'Pacific') {
            this.baseURL = process.env.BASE_URL_PACIFIC;
        } else if (data === 'Asia') {
            this.baseURL = process.env.BASE_URL_ASIA;
        }
    }

    public getData(url: string, options: any): any {
        let header = new Headers();
        this.header.append('client_id', process.env.MULE_CLIENT_ID ? process.env.MULE_CLIENT_ID : '');
        this.header.append('client_secret', process.env.MULE_CLIENT_SECRET ? process.env.MULE_CLIENT_SECRET : '');
        options.headers = this.header;
        if (process.env.BYPASS_MULE) {
            return this.http.get(url)
                .map((res): Observable<any> => {
                    return this.extractData(res);
                })
                .catch((error): Observable<any> => {
                    return this.handleError(error);
                });
        } else {
            return this.http.get(url, options)
                .map((res): Observable<any> => {
                    return this.extractData(res);
                })
                .catch((error): Observable<any> => {
                    return this.handleError(error);
                });
        }
    }

    public setUrl(url: string): void {
        if (url) {
            this.url = url;
        }
    }

    public clearUrl(): void {
        this.url = '';
    }

    public xhrGet(method: string, moduleAPI: string, operation: string, search: URLSearchParams): Promise<any> {
        //User Signed In Check
        //this.checkSignIn();
        this.header = new Headers();
        this.header.append(this.serviceConstants.Authorization, this._authService.getToken());
        //this.header.append(this.serviceConstants.Authorization, 'Bearer ' + this._authService.getAccessToken());
        this.header.append(this.serviceConstants.Module, moduleAPI);
        this.header.append(this.serviceConstants.Operation, operation);
        this.header.append('client_id', process.env.MULE_CLIENT_ID ? process.env.MULE_CLIENT_ID : '');
        this.header.append('client_secret', process.env.MULE_CLIENT_SECRET ? process.env.MULE_CLIENT_SECRET : '');
        search.set(this.serviceConstants.email, this._authService.getSavedEmail());
        let options = new RequestOptions();
        options.headers = this.header;
        options.search = search;

        let url: string = this.baseURL + method;
        if (this.url !== '') {
            url = this.url + method;
        }
        this.clearUrl();
        if (process.env.BYPASS_MULE) {
            return this.http.get(url).toPromise()
                .then((res): Observable<any> => {
                    return this.extractData(res);
                })
                .catch((error): Observable<any> => {
                    let obj: any = this.handleError(error);
                    return obj.error;
                });
        } else {
            this.document.querySelector('icabs-app .ajax-overlay')['style'].display = 'block';
            this.isAjaxRunning = true;
            return this.http.get(url, options).toPromise()
                .then((res): Observable<any> => {
                    return this.extractData(res);
                })
                .catch((error): Observable<any> => {
                    let obj: any = this.handleError(error);
                    return obj.error;
                });
        }
    }

    public makeGetRequest(method: string, moduleAPI: string, operation: string, search: URLSearchParams): Observable<any> {
        //User Signed In Check
        //this.checkSignIn();
        this.header = new Headers();
        this.header.append(this.serviceConstants.Authorization, this._authService.getToken());
        //this.header.append(this.serviceConstants.Authorization, 'Bearer ' + this._authService.getAccessToken());
        this.header.append(this.serviceConstants.Module, moduleAPI);
        this.header.append(this.serviceConstants.Operation, operation);
        this.header.append('client_id', process.env.MULE_CLIENT_ID ? process.env.MULE_CLIENT_ID : '');
        this.header.append('client_secret', process.env.MULE_CLIENT_SECRET ? process.env.MULE_CLIENT_SECRET : '');
        search.set(this.serviceConstants.email, this._authService.getSavedEmail());
        let options = new RequestOptions();
        options.headers = this.header;
        options.search = search;

        let url: string = this.baseURL + method;
        if (this.url !== '') {
            url = this.url + method;
        }
        this.clearUrl();
        if (process.env.BYPASS_MULE) {
            return this.http.get(url)
                .map((res): Observable<any> => {
                    return this.extractData(res);
                })
                .catch((error): Observable<any> => {
                    return this.handleError(error);
                });
        } else {
            this.document.querySelector('icabs-app .ajax-overlay')['style'].display = 'block';
            this.isAjaxRunning = true;
            return this.http.get(url, options)
                .map((res): Observable<any> => {
                    return this.extractData(res);
                })
                .catch((error): Observable<any> => {
                    return this.handleError(error);
                });
        }
    }

    public xhrPost(method: string, moduleAPI: string, operation: string, search: URLSearchParams, form_data: Object): Promise<any> {
        //User Signed In Check
        //this.checkSignIn();
        this.header = new Headers();
        this.header.append(this.serviceConstants.Authorization, this._authService.getToken());
        //this.header.append(this.serviceConstants.Authorization, 'Bearer ' + this._authService.getAccessToken());
        this.header.append(this.serviceConstants.Module, moduleAPI);
        this.header.append(this.serviceConstants.Operation, operation);
        this.header.append(this.serviceConstants.ContentType, 'application/x-www-form-urlencoded');
        this.header.append('client_id', process.env.MULE_CLIENT_ID ? process.env.MULE_CLIENT_ID : '');
        this.header.append('client_secret', process.env.MULE_CLIENT_SECRET ? process.env.MULE_CLIENT_SECRET : '');
        search.set(this.serviceConstants.email, this._authService.getSavedEmail());
        let options = new RequestOptions();
        options.headers = this.header;
        options.search = search;
        // URL Encoded
        let query = '';
        for (let key in form_data) {
            if (key) {
                query += encodeURIComponent(key) + '=' + encodeURIComponent(this.convertNullOrUndefinedToEmpty(form_data[key])) + '&';
            }
        }
        query = query.slice(0, -1);
        let url: string = this.baseURL + method;
        if (process.env.BYPASS_MULE) {
            return this.http.post(url, query, options).toPromise()
                .then((res): Observable<any> => {
                    return this.extractData(res);
                })
                .catch((error): Observable<any> => {
                    let obj: any = this.handleError(error);
                    return obj.error;
                });
        } else {
            this.document.querySelector('icabs-app .ajax-overlay')['style'].display = 'block';
            this.isAjaxRunning = true;
            return this.http.post(url, query, options).toPromise()
                .then((res): Observable<any> => {
                    return this.extractData(res);
                })
                .catch((error): Observable<any> => {
                    let obj: any = this.handleError(error);
                    return obj.error;
                });
        }
    }

    public makePostRequest(method: string, moduleAPI: string,
        operation: string, search: URLSearchParams, form_data: Object): Observable<any> {
        //User Signed In Check
        //this.checkSignIn();
        this.header = new Headers();
        this.header.append(this.serviceConstants.Authorization, this._authService.getToken());
        //this.header.append(this.serviceConstants.Authorization, 'Bearer ' + this._authService.getAccessToken());
        this.header.append(this.serviceConstants.Module, moduleAPI);
        this.header.append(this.serviceConstants.Operation, operation);
        this.header.append(this.serviceConstants.ContentType, 'application/x-www-form-urlencoded');
        this.header.append('client_id', process.env.MULE_CLIENT_ID ? process.env.MULE_CLIENT_ID : '');
        this.header.append('client_secret', process.env.MULE_CLIENT_SECRET ? process.env.MULE_CLIENT_SECRET : '');
        search.set(this.serviceConstants.email, this._authService.getSavedEmail());
        let options = new RequestOptions();
        options.headers = this.header;
        options.search = search;
        // URL Encoded
        let query = '';
        for (let key in form_data) {
            if (key) {
                query += encodeURIComponent(key) + '=' + encodeURIComponent(this.convertNullOrUndefinedToEmpty(form_data[key])) + '&';
            }
        }
        query = query.slice(0, -1);
        let url: string = this.baseURL + method;
        if (process.env.BYPASS_MULE) {
            return this.http.post(url, query, options)
                .map((res): Observable<any> => {
                    return this.extractData(res);
                })
                .catch((error): Observable<any> => {
                    return this.handleError(error);
                });
        } else {
            this.document.querySelector('icabs-app .ajax-overlay')['style'].display = 'block';
            this.isAjaxRunning = true;
            return this.http.post(url, query, options)
                .map((res): Observable<any> => {
                    return this.extractData(res);
                })
                .catch((error): Observable<any> => {
                    return this.handleError(error);
                });
        }
    }

    public makePostJsonRequest(method: string, moduleAPI: string,
        operation: string, search: URLSearchParams, form_data: Object, contentType?: string): Observable<any> {
        //User Signed In Check
        //this.checkSignIn();
        this.header = new Headers();
        this.header.append(this.serviceConstants.Authorization, this._authService.getToken());
        //this.header.append(this.serviceConstants.Authorization, 'Bearer ' + this._authService.getAccessToken());
        this.header.append(this.serviceConstants.Module, moduleAPI);
        this.header.append(this.serviceConstants.Operation, operation);
        this.header.append(this.serviceConstants.ContentType, contentType ? contentType : 'application/json');
        this.header.append('client_id', process.env.MULE_CLIENT_ID ? process.env.MULE_CLIENT_ID : '');
        this.header.append('client_secret', process.env.MULE_CLIENT_SECRET ? process.env.MULE_CLIENT_SECRET : '');
        search.set(this.serviceConstants.email, this._authService.getSavedEmail());
        let options = new RequestOptions();
        options.headers = this.header;
        options.search = search;
        let url: string = this.baseURL + method;
        if (process.env.BYPASS_MULE) {
            return this.http.post(url, form_data, options)
                .map((res): Observable<any> => {
                    return this.extractData(res);
                })
                .catch((error): Observable<any> => {
                    return this.handleError(error);
                });
        } else {
            this.document.querySelector('icabs-app .ajax-overlay')['style'].display = 'block';
            this.isAjaxRunning = true;
            return this.http.post(url, form_data, options)
                .map((res): Observable<any> => {
                    return this.extractData(res);
                })
                .catch((error): Observable<any> => {
                    return this.handleError(error);
                });
        }
    }

    public lookUpRequest(search: URLSearchParams, form_data: Object): Observable<any> {
        //User Signed In Check
        //this.checkSignIn();
        let header = new Headers();
        header.append(this.serviceConstants.Authorization, this._authService.getToken());
        //header.append(this.serviceConstants.Authorization, 'Bearer ' + this._authService.getAccessToken());
        header.append(this.serviceConstants.ContentType, 'application/json');
        header.append('client_id', process.env.MULE_CLIENT_ID ? process.env.MULE_CLIENT_ID : '');
        header.append('client_secret', process.env.MULE_CLIENT_SECRET ? process.env.MULE_CLIENT_SECRET : '');
        search.set(this.serviceConstants.email, this._authService.getSavedEmail());

        let options = new RequestOptions();
        options.headers = header;
        options.search = search;

        let url: string = this.baseURL + process.env.LOOK_UP;
        if (process.env.BYPASS_MULE) {
            return this.http.post(url, form_data, options)
                .map((res): Observable<any> => {
                    return this.extractData(res);
                })
                .catch((error): Observable<any> => {
                    return this.handleError(error);
                });
        } else {
            this.document.querySelector('icabs-app .ajax-overlay')['style'].display = 'block';
            this.isAjaxRunning = true;
            return this.http.post(url, form_data, options)
                .map((res): Observable<any> => {
                    return this.extractData(res);
                })
                .catch((error): Observable<any> => {
                    return this.handleError(error);
                });
        }

    }

    public lookUpPromise(search: URLSearchParams, form_data: Object): Promise<any> {
        //User Signed In Check
        //this.checkSignIn();
        let header = new Headers();
        header.append(this.serviceConstants.Authorization, this._authService.getToken());
        //header.append(this.serviceConstants.Authorization, 'Bearer ' + this._authService.getAccessToken());
        header.append(this.serviceConstants.ContentType, 'application/json');
        header.append('client_id', process.env.MULE_CLIENT_ID ? process.env.MULE_CLIENT_ID : '');
        header.append('client_secret', process.env.MULE_CLIENT_SECRET ? process.env.MULE_CLIENT_SECRET : '');
        search.set(this.serviceConstants.email, this._authService.getSavedEmail());

        let options = new RequestOptions();
        options.headers = header;
        options.search = search;

        let url: string = this.baseURL + process.env.LOOK_UP;
        if (process.env.BYPASS_MULE) {
            return this.http.post(url, form_data, options)
                .toPromise()
                .then((res): Observable<any> => {
                    return this.extractData(res);
                })
                .catch((error): Observable<any> => {
                    let obj: any = this.handleError(error);
                    return obj.error;
                });
        } else {
            this.document.querySelector('icabs-app .ajax-overlay')['style'].display = 'block';
            this.isAjaxRunning = true;
            return this.http.post(url, form_data, options)
                .toPromise()
                .then((res): Observable<any> => {
                    return this.extractData(res);
                })
                .catch((error): Observable<any> => {
                    let obj: any = this.handleError(error);
                    return obj.error;
                });
        }

    }

    public sysCharRequest(search: URLSearchParams): Observable<any> {
        //User Signed In Check
        //this.checkSignIn();
        let header = new Headers();
        header.append(this.serviceConstants.Authorization, this._authService.getToken());
        //header.append(this.serviceConstants.Authorization, 'Bearer ' + this._authService.getAccessToken());
        header.append('client_id', process.env.MULE_CLIENT_ID ? process.env.MULE_CLIENT_ID : '');
        header.append('client_secret', process.env.MULE_CLIENT_SECRET ? process.env.MULE_CLIENT_SECRET : '');
        search.set(this.serviceConstants.email, this._authService.getSavedEmail());
        search.set(this.serviceConstants.Action, '0');
        let options = new RequestOptions();
        options.headers = header;
        options.search = search;
        let url: string = this.baseURL + process.env.SYS_CHAR;
        if (process.env.BYPASS_MULE) {
            return this.http.get(url, options)
                .map((res): Observable<any> => {
                    return this.extractData(res);
                })
                .catch((error): Observable<any> => {
                    return this.handleError(error);
                });
        } else {
            this.document.querySelector('icabs-app .ajax-overlay')['style'].display = 'block';
            this.isAjaxRunning = true;
            return this.http.get(url, options)
                .map((res): Observable<any> => {
                    return this.extractData(res);
                })
                .catch((error): Observable<any> => {
                    return this.handleError(error);
                });
        }
    }

    public riGetErrorMessage(errorCode: number, countryCode: string, businessCode: string): Observable<any> {
        let queryLookUp: URLSearchParams = new URLSearchParams();
        let userCode = this._authService.getSavedUserCode();
        let gLanguageCode = '';
        let errorMsg = '';
        let data = [{
            'table': 'UserInformation',
            'query': { 'UserCode': userCode.UserCode },
            'fields': ['LanguageCode']
        }];
        let dataEvent;
        queryLookUp.set(this.serviceConstants.Action, '0');
        queryLookUp.set(this.serviceConstants.BusinessCode, businessCode);
        queryLookUp.set(this.serviceConstants.CountryCode, countryCode);
        queryLookUp.set(this.serviceConstants.MaxResults, '100');

        this.lookUpRequest(queryLookUp, data).subscribe((e) => {
            if (e.status === GlobalConstant.Configuration.Failure) {
                dataEvent.next(ErrorConstant.Message.ErrorMessageNotFound);
                dataEvent.complete();
            } else {
                if (!(e.errorMessage || e.fullError)) {
                    let found = false;
                    if (e['results'] && e['results'].length > 0) {
                        for (let i = 0; i < e['results'][0].length; i++) {
                            if (e['results'][0][i].LanguageCode !== '') {
                                gLanguageCode = e['results'][0][i].LanguageCode;
                                found = true;
                                break;
                            }
                        }
                        if (!found) {
                            gLanguageCode = GlobalConstant.Configuration.ENG;
                        }

                        let errorData = [{
                            'table': 'ErrorMessageLanguage',
                            'query': { 'LanguageCode': gLanguageCode, 'ErrorMessageCode': errorCode.toString() },
                            'fields': ['ErrorMessageCode', 'ErrorMessageDisplayDescription']
                        }];

                        this.lookUpRequest(queryLookUp, errorData).subscribe((f) => {
                            if (f.status === GlobalConstant.Configuration.Failure) {
                                dataEvent.next(ErrorConstant.Message.ErrorMessageNotFound);
                                dataEvent.complete();
                            } else {
                                if (!f.errorMessage) {
                                    if (f['results'] && f['results'].length > 0) {
                                        errorMsg = f['results'][0][0].ErrorMessageDisplayDescription;
                                        dataEvent.next(errorMsg);
                                        dataEvent.complete();
                                    } else {
                                        let errorData2 = [{
                                            'table': 'ErrorMessage',
                                            'query': { 'ErrorMessageCode': errorCode.toString() },
                                            'fields': ['ErrorMessageCode', 'ErrorMessageDescription']
                                        }];
                                        this.lookUpRequest(queryLookUp, errorData2).subscribe((k) => {
                                            if (k.status === GlobalConstant.Configuration.Failure) {
                                                dataEvent.next(ErrorConstant.Message.ErrorMessageNotFound);
                                            } else {
                                                if (!k.errorMessage) {
                                                    if (k['results'] && k['results'].length > 0) {
                                                        errorMsg = k['results'][0][0].ErrorMessageDescription;
                                                    } else {
                                                        errorMsg = ErrorConstant.Message.ErrorMessageNotFound;
                                                    }
                                                    dataEvent.next(errorMsg);
                                                    dataEvent.complete();
                                                }
                                            }
                                        },
                                            (error) => {
                                                dataEvent.next(ErrorConstant.Message.ErrorMessageNotFound);
                                                dataEvent.complete();
                                            });
                                    }
                                }
                            }
                        },
                            (error) => {
                                dataEvent.next(ErrorConstant.Message.ErrorMessageNotFound);
                                dataEvent.complete();
                            });
                    } else {
                        dataEvent.next(ErrorConstant.Message.ErrorMessageNotFound);
                        dataEvent.complete();
                    }

                } else {
                    dataEvent.next(ErrorConstant.Message.ErrorMessageNotFound);
                    dataEvent.complete();
                }
            }
        },
            (error) => {
                dataEvent.next(ErrorConstant.Message.ErrorMessageNotFound);
                dataEvent.complete();
            });

        dataEvent = new Subject<any>();
        this.dataEventArray.push(dataEvent);
        return dataEvent.asObservable();
    }

    public removeSubjectSubscription(): void {
        let dataEventArrayLength = this.dataEventArray.length;
        for (let i = 0; i < dataEventArrayLength; i++) {
            if (this.dataEventArray[i]) {
                this.dataEventArray[i].unsubscribe();
            }
        }
    }

    private convertJSONtoFormData(data: Object): string {
        let str = [];
        for (let key in data) {
            if (data.hasOwnProperty(key)) {
                str.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
            }
        }
        return str.join('&');
    }

    private detectAjaxAndPreventEvent(): void {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            if (!this.isAjaxRunning) {
                this.document.querySelector('icabs-app .ajax-overlay')['style'].display = 'none';
            } else {
                clearTimeout(this.timeout);
                this.detectAjaxAndPreventEvent();
            }
        }, 700);
    }

    private extractData(res: Response): Observable<any> {
        this.isAjaxRunning = false;
        this.detectAjaxAndPreventEvent();
        let body = res.json();
        if (typeof body['error_description'] !== 'undefined' && body['error_description'].toString().indexOf(ErrorConstant.Message.Invalid) !== -1) {
            return Observable.throw(res);
        }
        //Check for business error
        if (body && body.hasOwnProperty('oResponse')) {
            if (body.info && body.info.error) {
                body.oResponse = {};
                body.oResponse.errorMessage = body.info.error;
                body.oResponse.hasError = true;
                //this.setErrorMessage(body.oResponse.errorMessage, body.oResponse);
            } else if (body.oResponse && body.oResponse.errorMessage) {
                body.oResponse.hasError = true;
                //this.setErrorMessage(body.oResponse.errorMessage, body.oResponse);
            } else if (body.oResponse && body.oResponse.ErrorMessageDesc) {
                body.oResponse.hasError = true;
                body.oResponse.errorMessage = body.oResponse.ErrorMessageDesc;
                //this.setErrorMessage(body.oResponse.errorMessage, body.oResponse);
            } else if (body.oResponse && body.oResponse.fullError) {
                body.oResponse.hasError = true;
                //body.oResponse.errorMessage = body.oResponse.fullError;
                //this.setErrorMessage(body.oResponse.errorMessage, body.oResponse);
            }
            return body.oResponse;
        }
        return body || {};
    }

    private handleError(error: Response | any): Observable<any> {
        /*let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        if (typeof error['error_description'] !== 'undefined' && error['error_description'].toUpperCase() === 'INVALID VALUE') {
            this.router.navigate(['/application/login']);
            return;
        }
        if (typeof error['_body']['error_description'] !== 'undefined' && error['_body']['error_description'].toUpperCase() === 'INVALID VALUE') {
            this.router.navigate(['/application/login']);
            return;
        }
        return Observable.throw(errMsg);*/
        //this.setErrorMessage(error.errorMessage, error);
        this.isAjaxRunning = false;
        this.detectAjaxAndPreventEvent();
        return Observable.throw(error);
    }

    private setErrorMessage(msg: string, response: any): void {
        this.getTranslatedValue(msg, null).subscribe((res: string) => {
            if (res) {
                response.errorMessage = res;
            }
        });
    }

    private getTranslatedValue(key: any, params: any): any {
        if (params) {
            return this.translate.get(key, { value: params });
        } else {
            return this.translate.get(key);
        }

    }

    private convertNullOrUndefinedToEmpty(value: string): string {
        return (value = !(value === null || value === undefined) ? value : '');
    }

    /*### Check If The User Is Signed In Else Sign Out User ###*/
    private checkSignIn(): void {
        //Bug Not Fixed properly
        // if (this._authService && !this._authService.isSignedIn()) {
        //     this._authService.signOut();
        //     return;
        // }
    }
}
