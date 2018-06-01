import { Injectable } from '@angular/core';
import { TranslateService } from 'ng2-translate';
import { Http } from '@angular/http';
import { LocalStorageService } from 'ng2-webstorage';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { ComponentInteractionService } from './component-interaction.service';
import { GlobalConstant } from '../constants/global.constant';
import { ErrorConstant } from '../constants/error.constant';
export var LocaleTranslationService = (function () {
    function LocaleTranslationService(ls, translate, componentInteractionService, http) {
        this.ls = ls;
        this.translate = translate;
        this.componentInteractionService = componentInteractionService;
        this.http = http;
        this.ajaxSource = new BehaviorSubject(0);
        this.isAjaxRunning = false;
        this.ajaxSource$ = this.ajaxSource.asObservable();
        if (process.env.FETCH_TRANSLATION_FROM_FIREBASE) {
            this.storage = window['firebase'].storage();
        }
    }
    LocaleTranslationService.prototype.setUpTranslation = function () {
        var _this = this;
        this.localeData = this.getUserSetupInfo();
        if (!this.translate.getDefaultLang()) {
            if (this.isAjaxRunning === false) {
                this.isAjaxRunning = true;
                this.getTranslationsFromAjax(GlobalConstant.Configuration.DefaultLocale, true).subscribe(function (res) {
                    _this.isAjaxRunning = false;
                    var processedJSON = _this.processTranslationJSON(res);
                    GlobalConstant.Configuration.DefaultTranslation = processedJSON;
                    _this.translate.setTranslation(GlobalConstant.Configuration.DefaultLocale, processedJSON);
                    _this.translate.setDefaultLang(GlobalConstant.Configuration.DefaultLocale);
                    if (_this.localeData && _this.localeData.localeCultureCode && _this.localeData.localeCultureCode.localeCode.toUpperCase() !== GlobalConstant.Configuration.DefaultLocale.toUpperCase()) {
                        if (_this.isAjaxRunning === false) {
                            _this.isAjaxRunning = true;
                            _this.getTranslationsFromAjax(_this.localeData.localeCultureCode.localeCode, false).subscribe(function (res) {
                                _this.isAjaxRunning = false;
                                if (res) {
                                    var processedLocaleJON = _this.processTranslationJSON(res);
                                    _this.translate.setTranslation(_this.localeData.localeCultureCode.localeCode, processedLocaleJON);
                                    _this.translate.use(_this.localeData.localeCultureCode.localeCode);
                                    _this.ajaxSource.next(true);
                                    if (_this.dataEvent)
                                        _this.dataEvent.unsubscribe();
                                }
                            }, function (error) {
                                _this.translate.use(GlobalConstant.Configuration.DefaultLocale);
                                _this.ajaxSource.next(true);
                            });
                        }
                    }
                    else {
                        _this.translate.use(GlobalConstant.Configuration.DefaultLocale);
                        _this.ajaxSource.next(true);
                    }
                }, function (err) {
                    var _error = { title: 'Error', message: ErrorConstant.Message.TranslationNotFound };
                });
            }
        }
        else {
            this.ajaxSource.next(true);
        }
    };
    LocaleTranslationService.prototype.getTranslationsFromAjax = function (locale, isDefaultLanguage) {
        var _this = this;
        var url = '';
        if (process.env.FETCH_TRANSLATION_FROM_FIREBASE) {
            if (isDefaultLanguage) {
                this.pathReference = this.storage.ref(GlobalConstant.Configuration.DefaultLocaleUrl + locale + '.json');
                url = GlobalConstant.Configuration.DefaultLocaleUrl;
            }
            else {
                this.pathReference = this.storage.ref(GlobalConstant.Configuration.LocaleUrl + locale + '.json');
                url = GlobalConstant.Configuration.LocaleUrl;
            }
            this.pathReference.getDownloadURL().then(function (firebaseUrl) {
                _this.http
                    .get(firebaseUrl)
                    .map(function (request) {
                    return request.json();
                }).subscribe(function (data) {
                    _this.dataEvent.next(data);
                });
            }).catch(function (error) {
            });
            this.dataEvent = new Subject();
            return this.dataEvent.asObservable();
        }
        else {
            if (isDefaultLanguage) {
                url = GlobalConstant.Configuration.DefaultLocaleUrl;
            }
            else {
                url = GlobalConstant.Configuration.LocaleUrl;
            }
            return this.http
                .get(url + locale + '.json' + '?cache=' + new Date().getTime())
                .map(function (request) {
                return request.json();
            });
        }
    };
    LocaleTranslationService.prototype.processTranslationJSON = function (obj) {
        var newObj = {};
        if (obj.translations && obj.translations.length > 0) {
            for (var i = 0; i < obj.translations.length; i++) {
                newObj[obj.translations[i].BaseTranslationValue] = obj.translations[i].TranslationValue;
            }
        }
        return newObj;
    };
    LocaleTranslationService.prototype.getTranslatedValue = function (key, params) {
        if (params) {
            return this.translate.get(key, { value: params });
        }
        else {
            return this.translate.get(key);
        }
    };
    LocaleTranslationService.prototype.getUserSetupInfo = function () {
        return this.ls.retrieve('SETUP_INFO');
    };
    LocaleTranslationService.prototype.getDefaultLocale = function () {
        return this.ls.retrieve('DEFAULT_LANGUAGE');
    };
    LocaleTranslationService.decorators = [
        { type: Injectable },
    ];
    LocaleTranslationService.ctorParameters = [
        { type: LocalStorageService, },
        { type: TranslateService, },
        { type: ComponentInteractionService, },
        { type: Http, },
    ];
    return LocaleTranslationService;
}());
