import { HttpService } from './../../shared/services/http-service';
import { Component, ViewChild, NgZone } from '@angular/core';
import { Region } from './region';
import { LocaleCulture } from './localeculture';
import { LOCALE_CULTURE_CODE } from './locale-culture-list';
import { LOCALE_REGION_CODE } from './region-list';
import { Router } from '@angular/router';
import { Http } from '@angular/http';
import { Subject } from 'rxjs/Subject';
import { LocalStorageService } from 'ng2-webstorage';
import { TranslateService } from 'ng2-translate';
import { GlobalConstant } from './../../shared/constants/global.constant';
import { ErrorConstant } from './../../shared/constants/error.constant';
import { AuthService } from '../../shared/services/auth.service';
import { ErrorService } from '../../shared/services/error.service';
import { RiExchange } from '../../shared/services/riExchange';
export var SetupComponent = (function () {
    function SetupComponent(_router, _ls, _authService, _errorService, _zone, translate, http, riExchange, httpService) {
        this._router = _router;
        this._ls = _ls;
        this._authService = _authService;
        this._errorService = _errorService;
        this._zone = _zone;
        this.translate = translate;
        this.http = http;
        this.riExchange = riExchange;
        this.httpService = httpService;
        this.selectedRegion = new Region('Select Region', 'Select Region', 'Select Region');
        this.selectedLocaleCulture = new LocaleCulture('English (United Kingdom)', 'English (United Kingdom)', 'English', 'UK', 'en', 'GB', 'en-GB', 'ENG');
        this.showHeader = false;
        this.showErrorHeader = true;
        this.displayUser = false;
        this.regions = this.getRegions();
        this.localeCultureNameList = this.getLocaleCultureNameList();
        this.showHeader = false;
        if (process.env.FETCH_TRANSLATION_FROM_FIREBASE) {
            this.storage = window['firebase'].storage();
        }
    }
    SetupComponent.prototype.ngOnInit = function () {
        var _this = this;
        this._errorService.emitError(0);
        this.errorSubscription = this._errorService.getObservableSource().subscribe(function (error) {
            if (error !== 0) {
                _this._zone.run(function () {
                    _this.errorModal.show({ error: error });
                });
            }
        });
        if (!this._authService.isSignedIn()) {
            this._router.navigate(['/application/login']);
        }
        var prevSelectedData = this.getUserSetupInfo();
        this.googleLocale = this._authService.getGoogleData().locale;
        if (prevSelectedData) {
            this.regionCode = prevSelectedData.regionCode;
            this.localeCultureCode = prevSelectedData.localeCultureCode;
        }
        else {
            this.regionCode = this.selectedRegion;
            if (this.googleLocale) {
                var result = this.getLocaleByCode(this.googleLocale);
                if (result) {
                    this.localeCultureCode = result;
                }
                else {
                    this.localeCultureCode = this.selectedLocaleCulture;
                }
            }
            else {
                this.localeCultureCode = this.selectedLocaleCulture;
            }
        }
    };
    SetupComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        if (!GlobalConstant.Configuration.DefaultTranslation) {
            this.getTranslationsFromAjax(GlobalConstant.Configuration.DefaultLocale, true).subscribe(function (res) {
                var processedJSON = _this.processTranslationJSON(res);
                GlobalConstant.Configuration.DefaultTranslation = processedJSON;
                _this.translate.setTranslation(GlobalConstant.Configuration.DefaultLocale, processedJSON);
                _this.translate.setDefaultLang(GlobalConstant.Configuration.DefaultLocale);
                _this._ls.store('DEFAULT_LANGUAGE', GlobalConstant.Configuration.DefaultLocale);
                if (_this.localeCultureCode.localeCode.toUpperCase() !== GlobalConstant.Configuration.DefaultLocale.toUpperCase()) {
                    _this.getTranslationsFromAjax(_this.localeCultureCode.localeCode, false).subscribe(function (res) {
                        if (res) {
                            var processedLocaleJON = _this.processTranslationJSON(res);
                            _this.translate.setTranslation(_this.localeCultureCode.localeCode, processedLocaleJON);
                            _this.translate.use(_this.localeCultureCode.localeCode);
                            if (_this.dataEvent)
                                _this.dataEvent.unsubscribe();
                        }
                        _this.displaySetUpModal();
                    }, function (error) {
                        _this.translate.use(GlobalConstant.Configuration.DefaultLocale);
                        _this.displaySetUpModal();
                    });
                }
                else {
                    _this.translate.use(GlobalConstant.Configuration.DefaultLocale);
                    _this.displaySetUpModal();
                }
            }, function (err) {
                var _error = { title: 'Error', message: ErrorConstant.Message.TranslationNotFound };
                _this._errorService.emitError(_error);
            });
        }
        else {
            if (this.localeCultureCode.localeCode.toUpperCase() !== GlobalConstant.Configuration.DefaultLocale.toUpperCase()) {
                this.getTranslationsFromAjax(this.localeCultureCode.localeCode, false).subscribe(function (res) {
                    if (res) {
                        var processedLocaleJON = _this.processTranslationJSON(res);
                        _this.translate.setTranslation(_this.localeCultureCode.localeCode, processedLocaleJON);
                        _this.translate.use(_this.localeCultureCode.localeCode);
                    }
                    _this.displaySetUpModal();
                }, function (error) {
                    _this.translate.use(GlobalConstant.Configuration.DefaultLocale);
                    _this.displaySetUpModal();
                });
            }
            else {
                this.translate.setTranslation(this.localeCultureCode.localeCode, GlobalConstant.Configuration.DefaultTranslation);
                this.translate.use(this.localeCultureCode.localeCode);
                this.getTranslatedValue('SETUP WELCOME', this.name).subscribe(function (res) {
                    _this.pageTitle = res;
                    _this.displaySetUpModal();
                });
            }
        }
    };
    SetupComponent.prototype.ngOnDestroy = function () {
        this.errorSubscription.unsubscribe();
        this.riExchange.releaseReference(this);
    };
    SetupComponent.prototype.getLocaleByCode = function (code) {
        var localeList = this.getLocaleCultureNameList();
        for (var i = 0; i < localeList.length; i++) {
            if (localeList[i].localeCode === code) {
                return localeList[i];
            }
        }
    };
    SetupComponent.prototype.getRegions = function () {
        var localeRegionList = JSON.parse(LOCALE_REGION_CODE).localeRegionList;
        return localeRegionList;
    };
    SetupComponent.prototype.getLocaleCultureNameList = function () {
        var localeCultureNameList = JSON.parse(LOCALE_CULTURE_CODE).localeCultureList;
        localeCultureNameList.sort(this.arraySort);
        return localeCultureNameList;
    };
    SetupComponent.prototype.submitSetupData = function () {
        var setupInfo = {
            'regionCode': this.regionCode,
            'localeCultureCode': this.localeCultureCode
        };
        if (this.regionCode.code === this.getRegions()[0].code) {
            var _error = { title: 'Error', message: 'Please select region' };
            this._errorService.emitError(_error);
            return;
        }
        this.setUserSetupInfo(setupInfo);
        this.childModal.hide();
        if (document.querySelectorAll('[bsmodal].in').length <= 0) {
            var elem = document.getElementsByClassName('modal-backdrop');
            while (elem[0]) {
                elem[0].parentNode.removeChild(elem[0]);
            }
        }
        this.httpService.setBaseURL(this.regionCode.code);
        this._authService.getUserAccessDetails();
    };
    SetupComponent.prototype.getCultureFromUserProfilePreference = function () {
        return this._authService.getGoogleData().locales[0].value;
    };
    SetupComponent.prototype.getUserSetupInfo = function () {
        return this._ls.retrieve('SETUP_INFO');
    };
    SetupComponent.prototype.setUserSetupInfo = function (setupInfo) {
        this._ls.store('SETUP_INFO', setupInfo);
    };
    SetupComponent.prototype.onLocaleChange = function (locale) {
        var _this = this;
        this.localeCultureCode.localeCode = locale;
        this.getTranslationsFromAjax(this.localeCultureCode.localeCode, false).subscribe(function (res) {
            var processedJSON = _this.processTranslationJSON(res);
            _this.translate.setTranslation(_this.localeCultureCode.localeCode, processedJSON);
            _this.translate.use(_this.localeCultureCode.localeCode);
            _this.getTranslatedValue('SETUP WELCOME', _this.name).subscribe(function (res) {
                _this._zone.run(function () {
                    _this.pageTitle = res;
                });
            });
        }, function (error) {
            _this.translate.use(GlobalConstant.Configuration.DefaultLocale);
            _this.getTranslatedValue('SETUP WELCOME', _this.name).subscribe(function (res) {
                _this._zone.run(function () {
                    _this.pageTitle = res;
                });
            });
        });
    };
    SetupComponent.prototype.getTranslatedValue = function (key, params) {
        if (params) {
            return this.translate.get(key, { value: params });
        }
        else {
            return this.translate.get(key);
        }
    };
    SetupComponent.prototype.getTranslationsFromAjax = function (locale, isDefaultLanguage) {
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
    SetupComponent.prototype.getTranslations = function (lang) {
        return this.translate.getTranslation(lang);
    };
    SetupComponent.prototype.processTranslationJSON = function (obj) {
        var newObj = {};
        if (obj.translations && obj.translations.length > 0) {
            for (var i = 0; i < obj.translations.length; i++) {
                newObj[obj.translations[i].BaseTranslationValue] = obj.translations[i].TranslationValue;
            }
        }
        return newObj;
    };
    SetupComponent.prototype.displaySetUpModal = function () {
        var _this = this;
        this.name = this._authService.displayName;
        if (!this.name) {
            this.name = this._ls.retrieve('DISPLAYNAME');
        }
        this.getTranslatedValue('SETUP WELCOME', this.name).subscribe(function (res) {
            _this._zone.run(function () {
                _this.childModal.show();
                _this.pageTitle = res;
            });
        });
    };
    SetupComponent.prototype.arraySort = function (a, b) {
        if (a.name < b.name)
            return -1;
        if (a.name > b.name)
            return 1;
        return 0;
    };
    SetupComponent.decorators = [
        { type: Component, args: [{
                    selector: 'icabs-setup',
                    templateUrl: 'setup.html',
                    styles: ["\n      input[type='submit'], button.btn, a.btn {\n        min-width: 30%;\n      }\n    "]
                },] },
    ];
    SetupComponent.ctorParameters = [
        { type: Router, },
        { type: LocalStorageService, },
        { type: AuthService, },
        { type: ErrorService, },
        { type: NgZone, },
        { type: TranslateService, },
        { type: Http, },
        { type: RiExchange, },
        { type: HttpService, },
    ];
    SetupComponent.propDecorators = {
        'childModal': [{ type: ViewChild, args: ['childModal',] },],
        'errorModal': [{ type: ViewChild, args: ['errorModal',] },],
    };
    return SetupComponent;
}());
