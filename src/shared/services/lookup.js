import { URLSearchParams } from '@angular/http';
import { Injectable } from '@angular/core';
import { Logger } from '@nsalaun/ng2-logger';
import { ReplaySubject } from 'rxjs/Rx';
import { HttpService } from './http-service';
import { ServiceConstants } from '../constants/service.constants';
import { Utils } from './utility';
export var LookUp = (function () {
    function LookUp(logger, xhr, utils, serviceConstants) {
        this.logger = logger;
        this.xhr = xhr;
        this.utils = utils;
        this.serviceConstants = serviceConstants;
    }
    LookUp.prototype.ngOnInit = function () {
        this.logger.log('LookUp Class initialized.');
    };
    LookUp.prototype.lookUpRecord = function (params, maxRecords, code) {
        var retObj = new ReplaySubject(1);
        var maxresults = maxRecords ? maxRecords : 100;
        var data = params;
        var queryLookUp = new URLSearchParams();
        if (!code) {
            code = {
                'business': this.utils.getBusinessCode(),
                'country': this.utils.getCountryCode()
            };
        }
        queryLookUp.set(this.serviceConstants.Action, '0');
        queryLookUp.set(this.serviceConstants.MaxResults, maxresults.toString());
        queryLookUp.set(this.serviceConstants.BusinessCode, code['business'] ? code['business'] : this.utils.getBusinessCode());
        queryLookUp.set(this.serviceConstants.CountryCode, code['country'] ? code['country'] : this.utils.getCountryCode());
        this.xhr.lookUpRequest(queryLookUp, data).subscribe(function (res) {
            var results = res.results;
            retObj.next(results);
        });
        return retObj;
    };
    LookUp.prototype.lookUpPromise = function (params, maxRecords, code) {
        var maxresults = maxRecords ? maxRecords : 100;
        var data = params;
        var queryLookUp = new URLSearchParams();
        if (!code) {
            code = {
                'business': this.utils.getBusinessCode(),
                'country': this.utils.getCountryCode()
            };
        }
        queryLookUp.set(this.serviceConstants.Action, '0');
        queryLookUp.set(this.serviceConstants.MaxResults, maxresults.toString());
        queryLookUp.set(this.serviceConstants.BusinessCode, code['business'] ? code['business'] : this.utils.getBusinessCode());
        queryLookUp.set(this.serviceConstants.CountryCode, code['country'] ? code['country'] : this.utils.getCountryCode());
        return this.xhr.lookUpPromise(queryLookUp, data).then(function (data) {
            return data.results;
        });
    };
    LookUp.prototype.i_GetBusinessRegistryValue = function (ipcBusinessCode, ipcRegSection, ipcRegKey, ipdtEffectiveDate) {
        var lookupIP = [{
                'table': 'BusinessRegistry',
                'query': {
                    'BusinessCode': ipcBusinessCode,
                    'RegSection': ipcRegSection,
                    'RegKey': ipcRegKey
                },
                'fields': ['BusinessCode', 'RegSection', 'RegKey', 'RegValue', 'EffectiveDate']
            }];
        return this.lookUpPromise(lookupIP).then(function (data) {
            var retData = '';
            if (data) {
                if (data.length > 0) {
                    if (data[0]) {
                        retData = data[0][0]['RegValue'];
                    }
                }
            }
            return retData;
        });
    };
    LookUp.prototype.GetRegistrySetting = function (pcRegSection, pcRegKey) {
        var cValue = '';
        var lookupIP = [{
                'table': 'riRegistry',
                'query': { 'RegSection': pcRegSection, 'RegKey': pcRegKey },
                'fields': ['RegValue']
            }];
        return this.lookUpPromise(lookupIP).then(function (data) {
            console.log('GetRegistrySetting --- riRegistry', lookupIP, data);
            return data;
        });
    };
    LookUp.decorators = [
        { type: Injectable },
    ];
    LookUp.ctorParameters = [
        { type: Logger, },
        { type: HttpService, },
        { type: Utils, },
        { type: ServiceConstants, },
    ];
    return LookUp;
}());
