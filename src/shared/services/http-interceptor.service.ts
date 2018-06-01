import { Http, RequestOptionsArgs, RequestOptions, Response, Request, ConnectionBackend } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/empty';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { ErrorConstant } from './../constants/error.constant';

export class ICABSHttpResponseError {
    errorMessage: string = '';
    fullError: string = '';
    hasError: boolean = true;
}

export class HttpInterceptor extends Http {
    constructor(backend: ConnectionBackend, defaultOptions: RequestOptions, private router: Router) {
        super(backend, defaultOptions);
    }

    /*request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
        return this.intercept(super.request(url, options));
    }*/

    get(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.intercept(super.get(url, options));
    }

    post(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.intercept(super.post(url, body, options));
    }

    put(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.intercept(super.put(url, body, options));
    }

    delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.intercept(super.delete(url, options));
    }

    intercept(observable: Observable<Response>): Observable<any> {
        return observable
            .catch((err, source): any => {
                let icabsRes = this.parseErrorResponse(err);
                this.setDisplayForAjaxAndOverlay(true);
                if (this.isRequiredLogout(err)) {
                    this.router.navigate(['/application/login']);
                    setTimeout(() => {
                        window['gapi'].auth2.getAuthInstance().disconnect();
                    }, 100);
                    return Observable.empty();
                } else {
                    return Observable.throw(icabsRes);
                }
            });
    }

    parseErrorResponse(data: Response): any {
        let response: ICABSHttpResponseError = new ICABSHttpResponseError();
        let body: any, msg = ErrorConstant.Message.ErrorMessageNotFound;
        if (data instanceof Response) {
            body = data.json();
            if (body) {
                if (this.isProgressError(data)) {
                    msg = ErrorConstant.Message.ProgressError;
                } else if (this.hasOResponse(data)) {
                    if (body.info && body.info.error) {
                        msg = body.info.error;
                        if (body.info.errorCode) {
                            msg += ' - ' + body.info.errorCode;
                        }
                    } else if (body.oResponse.errorMessage) {
                        msg = body.oResponse.errorMessage;
                    } else if (body.oResponse.ErrorMessageDesc) {
                        msg = body.oResponse.ErrorMessageDesc;
                    }
                    if (body.oResponse.fullError) {
                        response.fullError = body.oResponse.fullError;
                    }
                }
            }
            response.errorMessage = msg;
        } else if (data instanceof ICABSHttpResponseError) {
            response = data;
        }
        return response;
    }

    private isRequiredLogout(data: any): boolean {
        let flag: boolean = false;
        if (typeof data['_body'] !== 'undefined' && data['_body'].toString().indexOf(ErrorConstant.Message.Invalid) !== -1) {
            flag = true;
        } else if (data['error_description'] && typeof data['error_description'] !== 'undefined' && data['error_description'].toUpperCase() === 'INVALID VALUE') {
            flag = true;
        } else if (data['_body'] && data['_body']['error_description'] && typeof data['_body']['error_description'] !== 'undefined' && data['_body']['error_description'].toUpperCase() === 'INVALID VALUE') {
            flag = true;
        }
        return flag;
    }
    private isProgressError(data: any): boolean {
        let flag: boolean = false;
        if (typeof data['_body'] !== 'undefined' && data['_body'].toString().indexOf(ErrorConstant.Message.ProgressError) !== -1) {
            flag = true;
        } if (data['_body'] instanceof ProgressEvent) {
            flag = true;
        }
        return flag;
    }
    private hasOResponse(data: any): boolean {
        let flag: boolean = false;
        if (typeof data['_body'] !== 'undefined' && data['_body'].toString().indexOf('oResponse') !== -1) {
            flag = true;
        }
        return flag;
    }

    private setDisplayForAjaxAndOverlay(visible: boolean): void {
        if (visible) {
            document.querySelector('icabs-app .lazy-spinner .spinner')['style'].display = 'none';
            document.querySelector('icabs-app .ajax-overlay')['style'].display = 'none';
        }
    }
}
