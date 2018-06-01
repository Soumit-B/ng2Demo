import { URLSearchParams } from '@angular/http';
import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs/Rx';
import { HttpService } from './http-service';
import { ServiceConstants } from './../constants/service.constants';
export var SpeedScript = (function () {
    function SpeedScript(serviceConstants, xhr) {
        this.serviceConstants = serviceConstants;
        this.xhr = xhr;
    }
    SpeedScript.prototype.sysChar = function (params) {
        var retObj = new ReplaySubject(1);
        var search = new URLSearchParams();
        search.set(this.serviceConstants.Action, params.action);
        search.set(this.serviceConstants.BusinessCode, params.businessCode);
        search.set(this.serviceConstants.CountryCode, params.countryCode);
        search.set('systemCharNumber', params.SysCharList);
        var xhrParams = {
            method: 'settings/data',
            module: params.module,
            operation: params.operation,
            search: search
        };
        this.xhr.makeGetRequest(xhrParams.method, xhrParams.module, xhrParams.operation, xhrParams.search).subscribe(function (res) { return retObj.next(res); });
        return retObj;
    };
    SpeedScript.prototype.sysCharPromise = function (params) {
        var search = new URLSearchParams();
        search.set(this.serviceConstants.Action, '0');
        search.set(this.serviceConstants.BusinessCode, params.businessCode);
        search.set(this.serviceConstants.CountryCode, params.countryCode);
        search.set('systemCharNumber', params.SysCharList);
        var xhrParams = {
            method: 'settings/data',
            module: '',
            operation: '',
            search: search
        };
        return this.xhr.xhrGet(xhrParams.method, xhrParams.module, xhrParams.operation, xhrParams.search);
    };
    SpeedScript.decorators = [
        { type: Injectable },
    ];
    SpeedScript.ctorParameters = [
        { type: ServiceConstants, },
        { type: HttpService, },
    ];
    return SpeedScript;
}());
