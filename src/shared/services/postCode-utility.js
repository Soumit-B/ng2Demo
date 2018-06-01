import { AjaxObservableConstant } from './../constants/ajax-observable.constant';
import { Utils } from './utility';
import { SysCharConstants } from './../constants/syscharservice.constant';
import { LocalStorageService } from 'ng2-webstorage';
import { AuthService } from './auth.service';
import { ReplaySubject } from 'rxjs/Rx';
import { ServiceConstants } from './../constants/service.constants';
import { URLSearchParams } from '@angular/http';
import { HttpService } from './http-service';
import { Injectable, NgZone } from '@angular/core';
import { Logger } from '@nsalaun/ng2-logger';
import { Title } from '@angular/platform-browser';
import { ErrorService } from './error.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { SpeedScript } from './speedscript';
import { LookUp } from './lookup';
import { ErrorConstant } from '../../shared/constants/error.constant';
export var PostCodeUtils = (function () {
    function PostCodeUtils(logger, titleService, _ls, authService, serviceConstants, xhr, sysCharConstants, utils, errorService, ajaxconstant, SpeedScript, LookUp, zone) {
        this.logger = logger;
        this.titleService = titleService;
        this._ls = _ls;
        this.authService = authService;
        this.serviceConstants = serviceConstants;
        this.xhr = xhr;
        this.sysCharConstants = sysCharConstants;
        this.utils = utils;
        this.errorService = errorService;
        this.ajaxconstant = ajaxconstant;
        this.SpeedScript = SpeedScript;
        this.LookUp = LookUp;
        this.zone = zone;
        this.querySysChar = new URLSearchParams();
        this.ajaxSource = new BehaviorSubject(0);
        this.vExcludedBranches = '';
    }
    PostCodeUtils.prototype.ngOnInit = function () {
        this.ajaxSource$ = this.ajaxSource.asObservable();
    };
    PostCodeUtils.prototype.emitError = function (error) {
        this.logger.info('Emitting error');
    };
    PostCodeUtils.prototype.PostCodeList = function () {
        var _this = this;
        var retObjpostcode = new ReplaySubject(1);
        var SYSTEMCHAR_EnablePostcodeDefaulting = this.sysCharConstants.SystemCharEnablePostcodeDefaulting.toString();
        this.querySysChar.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.querySysChar.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.querySysChar.set(this.serviceConstants.SystemCharNumber, SYSTEMCHAR_EnablePostcodeDefaulting);
        this.xhr.sysCharRequest(this.querySysChar).subscribe(function (e) {
            if (e.errorMessage) {
                _this.errorService.emitError(e);
            }
            else {
                if (e) {
                    _this.vEnablePostcodeDefaulting = e['records'][0].Required;
                    _this.LookupExcludedBranches(_this.vEnablePostcodeDefaulting).subscribe(function (data) {
                        if (data.errorMessage) {
                            _this.errorService.emitError(data);
                        }
                        else {
                            if (data) {
                                _this.stringlistdata = data;
                                retObjpostcode.next(_this.stringlistdata);
                            }
                            else {
                                retObjpostcode.next('');
                            }
                        }
                        _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
                    }, function (error) {
                        _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
                        error['errorMessage'] = error['errorMessage'] || ErrorConstant.Message.ErrorFetchingRecord;
                        _this.errorService.emitError(error);
                    });
                }
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.logger.log(' In error');
            _this.errorMessage = error;
            _this.errorService.emitError(error);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
        return retObjpostcode;
    };
    PostCodeUtils.prototype.LookupExcludedBranches = function (vEnablePostcodeDefaulting) {
        var _this = this;
        var retObj = new ReplaySubject(1);
        if (this.vEnablePostcodeDefaulting === true) {
            var lookupIP = [{
                    'table': 'Branch',
                    'query': { 'BusinessCode': this.utils.getBusinessCode(), 'EnablePostCodeDefaulting': 'FALSE' },
                    'fields': ['BranchNumber']
                }];
            this.LookUp.lookUpRecord(lookupIP).subscribe(function (data) {
                if (data.errorMessage) {
                    _this.errorService.emitError(data);
                }
                else {
                    if (data && data[0].length > 0) {
                        data.forEach(function (itemObj) {
                            itemObj.forEach(function (itemrow) {
                                _this.vExcludedBranches = _this.vExcludedBranches + ((_this.vExcludedBranches === '') ? '' : ',') + itemrow['BranchNumber'];
                                _this.stringlist = _this.vExcludedBranches;
                                retObj.next(_this.stringlist);
                            });
                        });
                    }
                    else {
                        retObj.next('');
                    }
                }
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            }, function (error) {
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
                error['errorMessage'] = error['errorMessage'] || ErrorConstant.Message.ErrorFetchingRecord;
                _this.errorService.emitError(error);
            });
        }
        else {
            retObj.next('');
        }
        return retObj;
    };
    PostCodeUtils.decorators = [
        { type: Injectable },
    ];
    PostCodeUtils.ctorParameters = [
        { type: Logger, },
        { type: Title, },
        { type: LocalStorageService, },
        { type: AuthService, },
        { type: ServiceConstants, },
        { type: HttpService, },
        { type: SysCharConstants, },
        { type: Utils, },
        { type: ErrorService, },
        { type: AjaxObservableConstant, },
        { type: SpeedScript, },
        { type: LookUp, },
        { type: NgZone, },
    ];
    return PostCodeUtils;
}());
