var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/empty';
import { ErrorConstant } from './../constants/error.constant';
export var ICABSHttpResponseError = (function () {
    function ICABSHttpResponseError() {
        this.errorMessage = '';
        this.hasError = true;
    }
    return ICABSHttpResponseError;
}());
export var HttpInterceptor = (function (_super) {
    __extends(HttpInterceptor, _super);
    function HttpInterceptor(backend, defaultOptions, router) {
        _super.call(this, backend, defaultOptions);
        this.router = router;
    }
    HttpInterceptor.prototype.get = function (url, options) {
        return this.intercept(_super.prototype.get.call(this, url, options));
    };
    HttpInterceptor.prototype.post = function (url, body, options) {
        return this.intercept(_super.prototype.post.call(this, url, body, options));
    };
    HttpInterceptor.prototype.put = function (url, body, options) {
        return this.intercept(_super.prototype.put.call(this, url, body, options));
    };
    HttpInterceptor.prototype.delete = function (url, options) {
        return this.intercept(_super.prototype.delete.call(this, url, options));
    };
    HttpInterceptor.prototype.intercept = function (observable) {
        var _this = this;
        return observable
            .catch(function (err, source) {
            var icabsRes = _this.parseErrorResponse(err);
            if (_this.isRequiredLogout(err)) {
                _this.router.navigate(['/application/login']);
                setTimeout(function () {
                    window['gapi'].auth2.getAuthInstance().disconnect();
                }, 100);
                return Observable.empty();
            }
            else {
                if (err)
                    alert('Server API Error \n' + JSON.stringify(err));
                return Observable.throw(err);
            }
        });
    };
    HttpInterceptor.prototype.parseErrorResponse = function (data) {
        var response = new ICABSHttpResponseError();
        var body, msg = ErrorConstant.Message.ErrorMessageNotFound;
        if (data instanceof Response) {
            body = data.json();
            if (body) {
                if (this.isProgressError(data)) {
                    msg = ErrorConstant.Message.ProgressError;
                }
                else if (this.hasOResponse(data)) {
                    if (body.info && body.info.error) {
                        msg = body.info.error;
                    }
                    else if (body.oResponse.errorMessage) {
                        msg = body.oResponse.errorMessage;
                    }
                    else if (body.oResponse.ErrorMessageDesc) {
                        msg = body.oResponse.ErrorMessageDesc;
                    }
                }
            }
            response.errorMessage = msg;
        }
        else if (data instanceof ICABSHttpResponseError) {
            response = data;
        }
        return response;
    };
    HttpInterceptor.prototype.isRequiredLogout = function (data) {
        var flag = false;
        if (typeof data['_body'] !== 'undefined' && data['_body'].toString().indexOf(ErrorConstant.Message.Invalid) !== -1) {
            flag = true;
        }
        else if (data['error_description'] && typeof data['error_description'] !== 'undefined' && data['error_description'].toUpperCase() === 'INVALID VALUE') {
            flag = true;
        }
        else if (data['_body'] && data['_body']['error_description'] && typeof data['_body']['error_description'] !== 'undefined' && data['_body']['error_description'].toUpperCase() === 'INVALID VALUE') {
            flag = true;
        }
        return flag;
    };
    HttpInterceptor.prototype.isProgressError = function (data) {
        var flag = false;
        if (typeof data['_body'] !== 'undefined' && data['_body'].toString().indexOf(ErrorConstant.Message.ProgressError) !== -1) {
            flag = true;
        }
        if (data['_body'] instanceof ProgressEvent) {
            flag = true;
        }
        return flag;
    };
    HttpInterceptor.prototype.hasOResponse = function (data) {
        var flag = false;
        if (typeof data['_body'] !== 'undefined' && data['_body'].toString().indexOf('oResponse') !== -1) {
            flag = true;
        }
        return flag;
    };
    return HttpInterceptor;
}(Http));
