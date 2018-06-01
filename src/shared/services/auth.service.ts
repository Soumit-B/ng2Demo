import { StaticUtils } from './static.utility';
import { CBBConstants } from '../constants/cbb.constants';
import { CBBService } from './cbb.service';
/*import { GlobalizeService } from './globalize.service';*/
import { UserAccessService } from './user-access.service';
import { Injectable, Injector } from '@angular/core';
import { Http, Response, Jsonp, Headers, URLSearchParams } from '@angular/http';
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

@Injectable()
export class AuthService {
    private _token: any; //TODO - Store in cookie
    private _accessToken: any; //TODO - Store in cookie

    private _client_id = process.env.CLIENT_ID;
    private _scope = process.env.SCOPE;
    private _response_type = process.env.RESPONSE_TYPE;

    private _redirect_uri = process.env.REDIRECT_URL;
    private _urlOAuth = process.env.OAUTH_URL + this._scope + '&client_id=' + this._client_id + '&redirect_uri=' + this._redirect_uri + '&response_type=' + this._response_type;
    private _urlProfile = process.env.PROFILE_URL;
    private _urlTokenInfo = process.env.TOKENINFO_URL;
    private _urlLogout = process.env.LOGOUT_URL;
    private _urlRevoke = process.env.REVOKE_URL;
    private _muleLoginAuth = process.env.MULE_LOGIN_API;
    private _muleUserCodeUrl = process.env.USER_CODE_URL;
    private userCodePostFix = process.env.USER_CODE_POSTFIX;
    private userMenuPostFix = process.env.USER_ACCESS_POSTFIX;
    private setupInfo;
    private baseURL;
    private _oauthGlobal = window['gapi'].auth2;

    private _error: any = {
        title: '',
        message: ''
    };
    private _timer: any;
    public data: string;

    public ajaxSource = new BehaviorSubject<any>(0);
    public displayName = '';
    public oauthResponse;
    public muleResponse;
    public googleData;
    public userCode;
    public ajaxSource$;
    private cbbService: CBBService;
    private isGapiInitialized: boolean = false;

    public UserObject: Object;

    constructor(private _http: Http, private _jsonp: Jsonp,
        private _ls: LocalStorageService, private _route: ActivatedRoute,
        private _router: Router, private _logger: Logger,
        private _errorService: ErrorService, private _ajaxconstant: AjaxObservableConstant,
        private userAccessService: UserAccessService,
        /*private globalize: GlobalizeService,*/
        private injector: Injector) {
        this.cbbService = this.injector.get(CBBService);
        this.ajaxSource$ = this.ajaxSource.asObservable();
    }

    public signIn(): void {
        if (window['gapi'].auth2 && window['gapi'].auth2.getAuthInstance() && this.isGapiInitialized) {
            window['gapi'].auth2.getAuthInstance().disconnect();
            setTimeout(() => {
                window['gapi'].auth2.getAuthInstance().signIn();
            }, 200);
        }
    }

    public signOut(): void {
        //this.oauthGlobal = this.oauthGlobal || window['gapi'].auth2;

        if (window['gapi'].auth2) {
            window['gapi'].auth2.getAuthInstance().disconnect();
        } else {
            this.googleRevoke();
        }
        this.clearData();
        this._router.navigate(['/application/login']);

    }

    public googleSignOut(): void {
        if (window['gapi'].auth2) {
            window['gapi'].auth2.getAuthInstance().signOut();
        }
        this.clearData();
        this._router.navigate(['/application/login']);
    }

    public googleRevoke(): Observable<any> {
        let url = this._urlRevoke + this._token + '&callback=JSON_CALLBACK';
        return this._jsonp.get(url)
            .map((res: Response) => res.json()).do(data => {
                //this._logger.info('Revoke: ' + JSON.stringify(data))
            });
    }

    public getProfile(): Observable<any> {
        let headers = new Headers();
        headers.append('Authorization', this._token);
        return this._http.get(this._urlProfile, { headers: headers }).map((res: Response) => res.json()).do(data => {
            //this._logger.info('Google profile');
            //this._logger.info('All: ' + JSON.stringify(data));
        });
    }

    public getError(): any {
        return this._error;
    }

    public isSignedIn(): boolean {
        if (window['gapi'].auth2 && window['gapi'].auth2.getAuthInstance()) {
            //this._logger.info(window['gapi'].auth2.getAuthInstance().isSignedIn.get());
            return window['gapi'].auth2.getAuthInstance().isSignedIn.get();
        } else {
            this._token = this._ls.retrieve('TOKEN');
            if (this._token && this._token.length > 10) {
                return true;
            } else {
                return false;
            }
        }
    }

    public getToken(): any {
        if (this._token) {
            if (window['gapi'].auth2 && window['gapi'].auth2.getAuthInstance()) {
                let currentUser = window['gapi'].auth2.getAuthInstance().currentUser.get();
                this.oauthResponse = currentUser.getAuthResponse();
                //this._logger.info('OAuth Response', this.oauthResponse);
                if (!(this.oauthResponse.id_token === this._token)) {
                    this._token = this.oauthResponse.id_token;
                }
                this._ls.store('TOKEN', this.oauthResponse.id_token);
                this._ls.store('ACCESS_TOKEN', this.oauthResponse.access_token);
                this._ls.store('OAUTH', this.oauthResponse);
            }
            return this._token;
        } else {
            let token = this._ls.retrieve('TOKEN');
            if (token) {
                return token;
            } else {
                return null;
            }
        }
    }

    public getAccessToken(): any {
        if (this._accessToken) {
            return this._accessToken;
        } else {
            let accessToken = this._ls.retrieve('ACCESS_TOKEN');
            if (accessToken) {
                return accessToken;
            } else {
                return null;
            }
        }
    }

    public getSavedUserCode(): any {
        if (this.userCode) {
            return this.userCode;
        } else {
            let userCode = this._ls.retrieve('USERCODE');
            if (userCode) {
                return userCode;
            } else {
                return null;
            }
        }
    }

    public getMuleResponse(): boolean {
        if (this.muleResponse) {
            return this.muleResponse;
        } else {
            let muleData = this._ls.retrieve('MULE');
            if (muleData) {
                return muleData;
            } else {
                return null;
            }
        }
    }

    public getSavedEmail(): string {
        if (this.getGoogleData) {
            return this.getGoogleData().email;
        } else {
            return '';
        }
    }

    public getGoogleData(): any {
        if (this.googleData) {
            return this.googleData;
        } else {
            let googleData = this._ls.retrieve('GOOGLEDATA');
            if (googleData) {
                return googleData;
            } else {
                return { locales: [{ value: '' }] };
            }
        }
    }

    public validateToken(): Observable<any> {
        let headers = new Headers();
        if (!process.env.BYPASS_MULE) {
            headers.append('Authorization', this._token);
            headers.append('client_id', process.env.MULE_CLIENT_ID);
            headers.append('client_secret', process.env.MULE_CLIENT_SECRET);
            return this._http.post(this._muleLoginAuth, {}, { headers: headers }).map((res: Response) => {
                try {
                    res.json();
                } catch (e) {
                    throw new Error(JSON.stringify(res));
                }
                return res.json();
            });
        } else {
            return this._http.get(this._muleLoginAuth, { headers: headers }).map((res: Response) => res.json()).do(data => {
                //this._logger.info('Google profile');
                //this._logger.info('All: ' + JSON.stringify(data));
            });
        }
    }

    public makeApiCall(): void {
        if (typeof this._timer !== 'undefined') {
            clearTimeout(this._timer);
        }
        this._timer = setTimeout(() => {
            try {
                if (this.isSignedIn()) {
                    this.ajaxSource.next(this._ajaxconstant.START);
                    this.validateToken().subscribe(
                        data => {
                            let checkError = this.checkError(data, 'Login');
                            if (!checkError) {
                                this.muleResponse = data;
                                this.googleData = data;
                                this.displayName = data.name;
                                this._ls.store('GOOGLEDATA', data);
                                this._ls.store('MULE', data);
                                this._ls.store('DISPLAYNAME', data.name);
                                //this.ajaxSource.next(this._ajaxconstant.COMPLETE);
                                //this.getUserAccessDetails();
                                //this.globalize.fetchSupplemental();
                                this._router.navigate(['/application/setup']);
                            }
                        },
                        error => {
                            this._error.title = 'Error';
                            this._error.message = ErrorConstant.Message.LoginFail;
                            this._errorService.emitError(this._error);
                            this.ajaxSource.next(this._ajaxconstant.COMPLETE);
                        });
                }
            } catch (err) {
                this._error.title = 'Error';
                this._error.message = ErrorConstant.Message.LoginFail;
                this._errorService.emitError(this._error);
                this.ajaxSource.next(this._ajaxconstant.COMPLETE);
            }
        }, 200);
    }


    public handleClientLoad(initialLoginLoad: any, triggerAPI: any): void {
        // Load the API client and auth2 library
        window['gapi'].load('client:auth2', this.initClient.bind(this, initialLoginLoad, triggerAPI));
    }

    public filterErrors(data: any): any {
        if (data.filter) {
            return data.filter((el: any): any => {
                return (typeof el['errorNumber'] === 'undefined' && typeof el['fullError'] === 'undefined' && typeof el['error'] === 'undefined' && (el['AuthorisedBusinesses'] instanceof Array && el['AuthorisedBusinesses'].length > 0));
            });
        } else {
            return data;
        }
    }

    public getUserAccessDetails(): void {
        this.ajaxSource.next(this._ajaxconstant.START);
        document.querySelector('icabs-app .lazy-spinner .spinner')['style'].display = 'block';
        this.getUserCode().subscribe(data => {
            try {
                data = this.filterErrors(data);
                let userCodeData: any;
                let checkError = this.checkError(data, 'UserESB');
                if (!checkError) {
                    // Save Response Data In Store
                    this._ls.store(CBBConstants.c_s_USERCODE_RESPONSE_STORAGE_KEY_NAME, data);
                    /**
                     * Set 0th index of data in userCodeData
                     * If data is not an array, i.e. User has access to only one country
                     * _ create array from data
                     */
                    userCodeData = StaticUtils.deepCopy(data);
                    if (!(data instanceof Array)) {// Create array from data
                        userCodeData = [];
                        userCodeData[0] = StaticUtils.deepCopy(data);
                        data = [data];
                    }

                    // Set Response In CBB Service Object Instance
                    this.cbbService.setCBBList(this.cbbService.formatResponsedata(data));
                    // Get User Code Only From Response
                    this.userCode = this.extractUserCode(userCodeData);
                    this._ls.store('USERCODE', this.userCode);
                    this.setUserObj(this.userCode);
                    this.userAccessService.setBaseURL(this.baseURL);
                    this.userAccessService.getUserAccessResponse(this._token, this.getSavedEmail()).subscribe(
                        userAccess => {
                            try {
                                let checkError = this.checkError(userAccess, 'Menu');
                                if (!checkError) {
                                    this.data = userAccess;
                                    this.userAccessService.setUserAccessData(this.data);
                                    this._ls.store('MENU', this.data);
                                    this.ajaxSource.next(this._ajaxconstant.COMPLETE);
                                    document.querySelector('icabs-app .lazy-spinner .spinner')['style'].display = 'none';
                                    //this._router.navigate(['/application/setup']);
                                    this._router.navigate(['/postlogin']);
                                }
                            } catch (err) {
                                this.menuApiCall();
                            }

                        },
                        error => {
                            this.menuApiCall();
                        }
                    );
                }
            } catch (err) {
                this.checkError({
                    error: true
                }, 'User');
            }
        },
            error => {
                this._error.title = 'Error';
                this._error.message = ErrorConstant.Message.UserFailNetwork;
                this.ajaxSource.next(this._ajaxconstant.COMPLETE);
                this._errorService.emitError(this._error);
                this.clearData();
                /*setTimeout(() => {
                    this.signOut();
                }, 2000);*/
            });
    }

    public menuApiCall(): void {
        this.userAccessService.setBaseURL(this.baseURL);
        this.userAccessService.getUserAccessResponse(this._token, this.getSavedEmail()).subscribe(
            userAccess => {
                let checkError = this.checkError(userAccess, 'Menu');
                if (!checkError) {
                    this.data = userAccess;
                    this.userAccessService.setUserAccessData(this.data);
                    this._ls.store('MENU', this.data);
                    this.ajaxSource.next(this._ajaxconstant.COMPLETE);
                    document.querySelector('icabs-app .lazy-spinner .spinner')['style'].display = 'none';
                    //this._router.navigate(['/application/setup']);
                    this._router.navigate(['/postlogin']);
                }

            },
            error => {
                this._error.title = 'Error';
                this._error.message = ErrorConstant.Message.MenuNotFound || error;
                this.ajaxSource.next(this._ajaxconstant.COMPLETE);
                document.querySelector('icabs-app .lazy-spinner .spinner')['style'].display = 'none';
                this._errorService.emitError(this._error);
                this.clearData();
                /*setTimeout(() => {
                    this.signOut();
                }, 2000);*/
            }
        );
    }

    public getBaseURL(): string {
        this.setupInfo = this._ls.retrieve('SETUP_INFO');
        if (this.setupInfo) {
            let region  = this.setupInfo.regionCode.code;
            if (region === 'Europe') {
                this.baseURL = process.env.BASE_URL_EUROPE;
            } else if (region === 'America') {
                this.baseURL = process.env.BASE_URL_AMERICA;
            } else if (region === 'Australia') {
                this.baseURL = process.env.BASE_URL_AUSTRALIA;
            } else if (region === 'Pacific') {
                this.baseURL = process.env.BASE_URL_PACIFIC;
            } else if (region === 'Asia') {
                this.baseURL = process.env.BASE_URL_ASIA;
            }
        }
        return this.baseURL;
    }

    public getUserCode(): Observable<any> {
        let headers = new Headers();
        headers.append('Authorization', this._token);
        headers.append('client_id', process.env.MULE_CLIENT_ID);
        headers.append('client_secret', process.env.MULE_CLIENT_SECRET);

        let params = new URLSearchParams();
        if (!this.googleData)
            this.googleData = this._ls.retrieve('GOOGLEDATA');
        params.set('email', this.googleData.email);

        if (process.env.BYPASS_MULE) {
            return this._http.get(this._muleUserCodeUrl).map((res: Response) => {
                //this.setUserObj(res.json());
                return res.json();
            }).do(data => {
                //this.displayName = data.result.names[0].disp    layName;
                //this._router.navigate(['/application/postlogin']);
            });
        } else {
            let url = this.getBaseURL();
            if (url) {
                url = url + this.userCodePostFix;
            } else {
                url = this._muleUserCodeUrl;
            }
            return this._http.get(url,
                { headers: headers, search: params }).map((res: Response) => {
                    //this.setUserObj(res.json());
                    return res.json();
                }).do(data => {
                    //this.displayName = data.result.names[0].disp    layName;
                    //this._router.navigate(['/application/postlogin']);
                });
        }
    }

    /**
     * Method: extractUserCode
     * Extracts user code from user api response
     * Country, Business and Branch information will be discarded
     */
    private extractUserCode(userCode: any): Object {
        let extractedData: any;
        let keysToDelete = [
            CBBConstants.c_s_BUSINESSES,
            CBBConstants.c_s_COUNTRY_NAME
        ];

        if (!userCode) {
            return;
        }

        // If User Code Is Not An Array; Convert It To Array
        extractedData = userCode[0];

        // Delete Key/Value From Object
        for (let idx = 0; idx < keysToDelete.length; idx++) {
            let key = keysToDelete[idx];
            delete extractedData[key];
        }

        return extractedData;
    }

    public setUserObj(data: any): void {
        this._ls.store('RIUserCode', data.UserCode);
        this._ls.store('RIUserInfo', data.UserInformation);
        this._ls.store('RIUserTypeCode', data.UserTypeCode);
        this._ls.store('RIUserName', data.UserName);
        this._ls.store('RIUserEmail', data.Email);
        this._ls.store('RICountryCode', data.CountryCode);
    }

    public checkError(data: any, type?: string): boolean {
        if ((typeof data.errorNumber !== undefined && data.errorNumber) || data.error) {
            this._error.title = 'Error';
            if (type) {
                if (type === 'Login') {
                    this._error.message = ErrorConstant.Message.LoginFail;
                } else  if (type === 'User') {
                    this._error.message = ErrorConstant.Message.UserFailNetwork;
                } else if (type === 'UserESB') {
                    this._error.message = ErrorConstant.Message.UserFailESB;
                } else if (type === 'Menu') {
                    this._error.message = ErrorConstant.Message.MenuFail;
                } else {
                    this._error.message = ErrorConstant.Message.UserNotFound;
                }
            } else {
                this._error.message = ErrorConstant.Message.UserNotFound;
            }
            //this._error.message = ErrorConstant.Message.UserNotFound;
            this._errorService.emitError(this._error);
            this.ajaxSource.next(this._ajaxconstant.COMPLETE);
            this.clearData();
            return true;
        } else {
            return false;
        }
    }

    private initClient(initialLoginLoad: any, triggerAPI: any): void {
        setTimeout(() => {
            window['gapi'].client.init({
                discoveryDocs: ['https://people.googleapis.com/$discovery/rest?version=v1'],
                clientId: this._client_id,
                scope: this._scope
            }).then(() => {
                try {
                    this.isGapiInitialized = true;
                    window['gapi'].auth2.getAuthInstance().isSignedIn.listen(this.updateSigninStatus.bind(this));
                    this.updateSigninStatus(this.isSignedIn(), initialLoginLoad, triggerAPI);
                } catch (err) {
                    this._error.title = 'Error';
                    this._error.message = ErrorConstant.Message.OtherLoginTimeFail;
                    this._errorService.emitError(this._error);
                }
            });
        }, 500);
    }

    private updateSigninStatus(isSignedIn: boolean, initialLoginLoad: boolean, triggerAPI: boolean): void {
        if (isSignedIn && !initialLoginLoad) {
            let currentUser = window['gapi'].auth2.getAuthInstance().currentUser.get();
            this.oauthResponse = currentUser.getAuthResponse();
            //this._logger.info('OAuth Response', this.oauthResponse);
            this._ls.store('TOKEN', this.oauthResponse.id_token);
            this._ls.store('ACCESS_TOKEN', this.oauthResponse.access_token);
            this._ls.store('OAUTH', this.oauthResponse);
            this._token = this.oauthResponse.id_token;
            this._accessToken = this.oauthResponse.access_token;
            if (triggerAPI !== false) {
                this.makeApiCall();
            }
        } else {
            this.clearData();
            this.ajaxSource.next(this._ajaxconstant.COMPLETE);
            this._router.navigate(['/application/login']);
        }
    }

    private handleError(error: Response): any {
        return Observable.throw(error.json().error || 'Server error');
    }

    public clearData(): void {
        this.oauthResponse = null;
        this._ls.clear();
        this.cbbService.clearStore();
        GlobalConstant.Configuration.DefaultTranslation = null;
        this._token = '';
        this._accessToken = '';
    }
}
