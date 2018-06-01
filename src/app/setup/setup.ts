import { HttpService } from './../../shared/services/http-service';
import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, NgZone } from '@angular/core';
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
import { GlobalizeService } from '../../shared/services/globalize.service';
import { RiExchange } from '../../shared/services/riExchange';
import { Observable } from 'rxjs/Rx';

//let template = require('./setup.html');

@Component({
    selector: 'icabs-setup',
    templateUrl: 'setup.html',
    styles: [`
      input[type='submit'], button.btn, a.btn {
        min-width: 30%;
      }
    `]
})

export class SetupComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('childModal') public childModal;
    @ViewChild('errorModal') public errorModal;

    // TODO
    public selectedRegion: Region = new Region('Select Region', 'Select Region', 'Select Region');

    // TODO
    public selectedLocaleCulture: LocaleCulture = new LocaleCulture(
        'English (United Kingdom)',
        'English (United Kingdom)',
        'English',
        'UK',
        'en',
        'GB',
        'en-GB',
        'ENG');

    public pageTitle: string;
    public name: string;
    public showHeader: boolean = false;
    public showErrorHeader: boolean = true;
    public regions: Region[];
    public localeCultureNameList: LocaleCulture[];
    public regionCode: Region;
    public localeCultureCode: LocaleCulture;
    public googleLocale;
    public errorSubscription;
    public displayUser: boolean = false;
    private triggerLogout: boolean = true;
    private storage: any;
    private pathReference: any;
    private dataEvent: any;

    constructor(
        private _router: Router,
        private _ls: LocalStorageService,
        private _authService: AuthService,
        private _errorService: ErrorService,
        private _zone: NgZone,
        private translate: TranslateService,
        private http: Http,
        private riExchange: RiExchange,
        private httpService: HttpService,
        private globalize: GlobalizeService
    ) {
        this.regions = this.getRegions();
        this.localeCultureNameList = this.getLocaleCultureNameList();
        this.showHeader = false;
        /*if (process.env.FETCH_TRANSLATION_FROM_FIREBASE) {
            this.storage = window['firebase'].storage();
        }*/
    }

    ngOnInit(): void {
        this._errorService.emitError(0);
        this.errorSubscription = this._errorService.getObservableSource().subscribe(error => {
            if (error !== 0) {
                this._zone.run(() => {
                    this.errorModal.show({ error: error });
                });
            }
        });
        if (!this._authService.isSignedIn()) {
            this._router.navigate(['/application/login']);
        }


        let prevSelectedData = this.getUserSetupInfo();
        this.googleLocale = this._authService.getGoogleData().locale;
        if (prevSelectedData) {
            this.regionCode = prevSelectedData.regionCode;
            this.localeCultureCode = prevSelectedData.localeCultureCode;
        } else {
            this.regionCode = this.selectedRegion;
            if (this.googleLocale) {
                let result = this.getLocaleByCode(this.googleLocale);
                if (result) {
                    this.localeCultureCode = result;
                } else {
                    this.localeCultureCode = this.selectedLocaleCulture;
                }
            } else {
                this.localeCultureCode = this.selectedLocaleCulture;
            }
        }



    }

    ngAfterViewInit(): void {
        try {
            if (!GlobalConstant.Configuration.DefaultTranslation) {
                this.getTranslationsFromAjax(GlobalConstant.Configuration.DefaultLocale, true).subscribe((res: any) => {

                    let processedJSON = this.processTranslationJSON(res);
                    GlobalConstant.Configuration.DefaultTranslation = processedJSON;
                    this.translate.setTranslation(GlobalConstant.Configuration.DefaultLocale, processedJSON);
                    this.translate.setDefaultLang(GlobalConstant.Configuration.DefaultLocale);
                    this._ls.store('DEFAULT_LANGUAGE', GlobalConstant.Configuration.DefaultLocale);

                    if (this.localeCultureCode.localeCode.toUpperCase() !== GlobalConstant.Configuration.DefaultLocale.toUpperCase()) {
                        this.getTranslationsFromAjax(this.localeCultureCode.localeCode, false).subscribe((res: any) => {
                            if (res) {
                                let processedLocaleJON = this.processTranslationJSON(res);
                                this.translate.setTranslation(this.localeCultureCode.localeCode, processedLocaleJON);
                                this.translate.use(this.localeCultureCode.localeCode);
                                /*if (this.dataEvent)
                                this.dataEvent.unsubscribe();*/
                            }
                            this.displaySetUpModal();
                        },
                            (error) => {
                                this.translate.use(GlobalConstant.Configuration.DefaultLocale);
                                this.displaySetUpModal();
                            });
                    } else {
                        this.translate.use(GlobalConstant.Configuration.DefaultLocale);
                        this.displaySetUpModal();
                    }
                },
                    (err) => {
                        this.handleError();
                    });
            } else {
                if (this.localeCultureCode.localeCode.toUpperCase() !== GlobalConstant.Configuration.DefaultLocale.toUpperCase()) {
                    this.getTranslationsFromAjax(this.localeCultureCode.localeCode, false).subscribe((res: any) => {
                        if (res) {
                            let processedLocaleJON = this.processTranslationJSON(res);
                            this.translate.setTranslation(this.localeCultureCode.localeCode, processedLocaleJON);
                            this.translate.use(this.localeCultureCode.localeCode);
                        }
                        this.displaySetUpModal();
                    },
                        (error) => {
                            this.translate.use(GlobalConstant.Configuration.DefaultLocale);
                            this.displaySetUpModal();
                        });
                } else {
                    this.translate.setTranslation(this.localeCultureCode.localeCode, GlobalConstant.Configuration.DefaultTranslation);
                    this.translate.use(this.localeCultureCode.localeCode);
                    this.getTranslatedValue('SETUP WELCOME', this.name).subscribe((res: string) => {
                        this.pageTitle = res;
                        this.displaySetUpModal();
                    });
                }
            }
        }
        catch (err) {
            this.displaySetUpModal();
        }

    }

    ngOnDestroy(): void {
        this.errorSubscription.unsubscribe();
        this.riExchange.releaseReference(this);
        //delete this;
    }

    getLocaleByCode(code: string): any {
        let localeList = this.getLocaleCultureNameList();
        for (let i = 0; i < localeList.length; i++) {
            if (localeList[i].localeCode === code) {
                return localeList[i];
            }
        }
    }

    getRegions(): Array<Region> {
        let localeRegionList: Region[] = JSON.parse(LOCALE_REGION_CODE).localeRegionList;
        return localeRegionList;
    }
    getLocaleCultureNameList(): Array<LocaleCulture> {
        let localeCultureNameList: LocaleCulture[] = JSON.parse(LOCALE_CULTURE_CODE).localeCultureList;
        localeCultureNameList.sort(this.arraySort);

        return localeCultureNameList;
    }

    submitSetupData(): void {
        let setupInfo: any = {
            'regionCode': this.regionCode,
            'localeCultureCode': this.localeCultureCode
        };
        if (this.regionCode.code === this.getRegions()[0].code) {
            let _error = { title: 'Error', message: ErrorConstant.Message.SelectRegion };
            this._errorService.emitError(_error);
            this.triggerLogout = false;
            return;
        }

        this.setUserSetupInfo(setupInfo);
        this.childModal.hide();
        if (document.querySelectorAll('[bsmodal].in').length <= 0) {
            let elem = document.getElementsByClassName('modal-backdrop');
            while (elem[0]) {
                elem[0].parentNode.removeChild(elem[0]);
            }
        }
        // added temporarily
        window['locale'] = this.localeCultureCode.localeCode;
        //this._router.navigate(['/postlogin']);
        this.httpService.setBaseURL(this.regionCode.code);
        this._authService.getUserAccessDetails();
        this._ls.clear('CULTURE');
        this.globalize.init(this.localeCultureCode);
    }

    getCultureFromUserProfilePreference(): any {
        //return this._ls.retrieve('LOCALE');
        return this._authService.getGoogleData().locales[0].value;
    }

    getUserSetupInfo(): any {
        return this._ls.retrieve('SETUP_INFO');
    }

    setUserSetupInfo(setupInfo: any): void {
        this._ls.store('SETUP_INFO', setupInfo);
        //
    }

    onLocaleChange(locale: any): void {
        this.localeCultureCode = this.getLocaleByCode(locale);
        this.getTranslationsFromAjax(this.localeCultureCode.localeCode, false).subscribe((res: any) => {
            let processedJSON = this.processTranslationJSON(res);
            this.translate.setTranslation(this.localeCultureCode.localeCode, processedJSON);
            this.translate.use(this.localeCultureCode.localeCode);
            this.getTranslatedValue('SETUP WELCOME', this.name).subscribe((res: string) => {
                this._zone.run(() => {
                    this.pageTitle = res;
                });
                //this.pageTitle = res;
            });

        },
            (error) => {
                this.translate.use(GlobalConstant.Configuration.DefaultLocale);
                this.getTranslatedValue('SETUP WELCOME', this.name).subscribe((res: string) => {
                    this._zone.run(() => {
                        this.pageTitle = res;
                    });
                });
            });

    }

    public getTranslatedValue(key: any, params: any): any {
        if (params) {
            return this.translate.get(key, { value: params });
        } else {
            return this.translate.get(key);
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
                let processedJSON = this.processTranslationJSON(data);
                GlobalConstant.Configuration.DefaultTranslation = processedJSON;
                this.translate.setTranslation(GlobalConstant.Configuration.DefaultLocale, processedJSON);
                this.translate.setDefaultLang(GlobalConstant.Configuration.DefaultLocale);
                this._ls.store('DEFAULT_LANGUAGE', GlobalConstant.Configuration.DefaultLocale);
                this.displaySetUpModal();
            }, (err) => {
                    let _error = { title: 'Error', message: ErrorConstant.Message.TranslationNotFound };
                    this._errorService.emitError(_error);
                    this.triggerLogout = false;
                });
    }

    public getTranslations(lang: string): any {
        return this.translate.getTranslation(lang);
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

    public displaySetUpModal(): void {
        this.name = this._authService.displayName;
        if (!this.name) {
            this.name = this._ls.retrieve('DISPLAYNAME');
        }
        this.getTranslatedValue('SETUP WELCOME', this.name).subscribe((res: string) => {
            this._zone.run(() => {
                this.pageTitle = res;
            });
        });
        this.childModal.show();

    }

    public errorModalClose(): void {
        if (this.triggerLogout === true) {
            this._authService.signOut();
        }
        this.triggerLogout = true;
    }

    public arraySort(a: any, b: any): number {
        if (a.name < b.name)
            return -1;
        if (a.name > b.name)
            return 1;
        return 0;
    }
}
