import { Injectable } from '@angular/core';
import { TranslateService } from 'ng2-translate';
import { Http } from '@angular/http';
import { LocalStorageService } from 'ng2-webstorage';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { GlobalConstant } from '../constants/global.constant';
import { ErrorConstant } from '../constants/error.constant';

@Injectable()
export class LocaleTranslationService {
    public localeData: any;
    public ajaxSource = new BehaviorSubject<any>(0);
    public ajaxSource$;
    private isAjaxRunning: boolean = false;
    private storage: any;
    private pathReference: any;
    private dataEvent: any;
    constructor(
        private ls: LocalStorageService,
        private translate: TranslateService,
        private http: Http
        ) {
        this.ajaxSource$ = this.ajaxSource.asObservable();
        /*if (process.env.FETCH_TRANSLATION_FROM_FIREBASE) {
            this.storage = window['firebase'].storage();
        }*/
    }

    public setUpTranslation(): any {
        this.localeData = this.getUserSetupInfo();
        if (!this.translate.getDefaultLang()) {
            if (this.isAjaxRunning === false) {
                this.isAjaxRunning = true;
                this.getTranslationsFromAjax(GlobalConstant.Configuration.DefaultLocale, true).subscribe((res: any) => {
                    let processedJSON = this.processTranslationJSON(res);
                    GlobalConstant.Configuration.DefaultTranslation = processedJSON;
                    this.translate.setTranslation(GlobalConstant.Configuration.DefaultLocale, processedJSON);
                    this.translate.setDefaultLang(GlobalConstant.Configuration.DefaultLocale);
                    if (this.localeData && this.localeData.localeCultureCode && this.localeData.localeCultureCode.localeCode.toUpperCase() !== GlobalConstant.Configuration.DefaultLocale.toUpperCase()) {
                        this.isAjaxRunning = true;
                        this.getTranslationsFromAjax(this.localeData.localeCultureCode.localeCode, false).subscribe((res: any) => {
                            this.isAjaxRunning = false;
                            if (res) {
                                let processedLocaleJON = this.processTranslationJSON(res);
                                this.translate.setTranslation(this.localeData.localeCultureCode.localeCode, processedLocaleJON);
                                this.translate.use(this.localeData.localeCultureCode.localeCode);
                                this.ajaxSource.next(true);
                                this.unSubscribeAjaxSource();
                                /*if (this.dataEvent)
                                this.dataEvent.unsubscribe();*/
                            }
                        },
                        (error) => {
                            this.translate.use(GlobalConstant.Configuration.DefaultLocale);
                            this.ajaxSource.next(true);
                            this.unSubscribeAjaxSource();
                        });
                    } else {
                        this.isAjaxRunning = false;
                        this.translate.use(GlobalConstant.Configuration.DefaultLocale);
                        this.ajaxSource.next(true);
                        this.unSubscribeAjaxSource();
                    }
                },
                (err) => {
                    this.handleError();
                });
            }
        } else {
            if (this.isAjaxRunning === false) {
                this.ajaxSource.next(true);
                this.unSubscribeAjaxSource();
            }
        }
    }

    public getTranslationsFromAjax(locale: any, isDefaultLanguage: boolean): any {
        let url: string = '';
        if (process.env.FETCH_TRANSLATION_FROM_FIREBASE) {
            url = process.env.FIREBASE_TRANSLATION_URL;

            return this.http
            .get(url + locale + '.json' /*+ '?cache=' + new Date().getTime()*/)
            .map(request => {
                return request.json();
            });
        } else {
            if (isDefaultLanguage) {
                url = GlobalConstant.Configuration.DefaultLocaleUrl;
            } else {
                url = GlobalConstant.Configuration.LocaleUrl;
            }

            return this.http
            .get(url + locale + '.json' /*+ '?cache=' + new Date().getTime()*/)
            .map(request => {
                return request.json();
            });
        }
    }

    public handleError(): void {
        let url: string = GlobalConstant.Configuration.DefaultLocaleUrl;
        this.http
            .get(url + GlobalConstant.Configuration.DefaultLocale + '.json' /*+ '?cache=' + new Date().getTime()*/)
            .map(res => {
                return res.json();
            }).subscribe(data => {
                this.isAjaxRunning = false;
                let processedJSON = this.processTranslationJSON(data);
                GlobalConstant.Configuration.DefaultTranslation = processedJSON;
                this.translate.setTranslation(GlobalConstant.Configuration.DefaultLocale, processedJSON);
                this.translate.setDefaultLang(GlobalConstant.Configuration.DefaultLocale);
                this.unSubscribeAjaxSource();
            }, (err) => {
                    let _error = { title: 'Error', message: ErrorConstant.Message.TranslationNotFound };
                });
    }

    public processTranslationJSON(obj: any): any {
        let newObj = {};
        if (obj.translations && obj.translations.length > 0) {
            for (let i = 0; i < obj.translations.length; i++) {
                newObj[obj.translations[i].BaseTranslationValue] = obj.translations[i].TranslationValue;
            }
        }
        return newObj;
    }

    public getTranslatedValue(key: any, params: any): any {
        if (params) {
            return this.translate.get(key, { value: params });
        } else {
            return this.translate.get(key);
        }
    }

    public getUserSetupInfo(): any {
        return this.ls.retrieve('SETUP_INFO');
    }

    public getDefaultLocale(): any {
        return this.ls.retrieve('DEFAULT_LANGUAGE');
    }

    public unSubscribeAjaxSource(): void {
        if (this.ajaxSource$ && this.ajaxSource$.source && this.ajaxSource$.source.observers instanceof Array && this.ajaxSource$.source.observers.length > 0) {
            for (let i = 0; i < this.ajaxSource$.source.observers.length; i++) {
                if (typeof this.ajaxSource$.source.observers[i].unsubscribe === 'function') {
                    this.ajaxSource$.source.observers[i].unsubscribe();
                }
            }
        }
    }
}
