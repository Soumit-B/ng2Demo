import { ModalAdvService } from './shared/components/modal-adv/modal-adv.service';
import { Component, ViewContainerRef, OnInit, AfterViewInit, ViewChild, NgZone, Injector } from '@angular/core';
import { ComponentsHelper } from 'ng2-bootstrap/ng2-bootstrap';
import { Logger } from '@nsalaun/ng2-logger';
import { Store } from '@ngrx/store';
import { Location } from '@angular/common';
import { Router, NavigationStart, NavigationEnd, NavigationCancel } from '@angular/router';
import { GlobalConstant } from './shared/constants/global.constant';
import { DatepickerComponent } from './shared/components/datepicker/datepicker';
import { Utils } from './shared/services/utility';
import { AuthService } from './shared/services/auth.service';
import { SubjectService } from './shared/services/subject.service';
import { VariableService } from './shared/services/variable.service';
import { GlobalizeService } from './shared/services/globalize.service';
import { RiExchange } from './shared/services/riExchange';
import { ActionTypes } from './app/actions/account';
import { ContractActionTypes } from './app/actions/contract';
import { CallCenterActionTypes } from './app/actions/call-centre-search';
import { AccountMaintenanceActionTypes } from './app/actions/account-maintenance';
import { InvoiceActionTypes } from './app/actions/invoice';
import { ErrorConstant } from './shared/constants/error.constant';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';

// Declare ga function as ambient
declare const ga: Function;
@Component({
    selector: 'icabs-app',
    template: `
        <icabs-header [displayUser]=true *ngIf="showHeader"></icabs-header>
        <router-outlet></router-outlet>
        <icabs-footer></icabs-footer>
        <icabs-spinner class='lazy-spinner' #spinner></icabs-spinner>
        <icabs-modal #errorModal="child" [(showHeader)]="showErrorHeader" [config]="{backdrop: 'static'}"></icabs-modal>
        <icabs-modal-adv #modalAdv="child"></icabs-modal-adv>
        <div class="ajax-overlay" #overlay style="display: none;"></div>
    `
})

export class AppComponent implements OnInit, AfterViewInit {
    @ViewChild('errorModal') public errorModal;
    @ViewChild('modalAdv') public modalAdv;
    @ViewChild('overlay') public overlay;
    @ViewChild('spinner') public spinner;
    private viewContainerRef: ViewContainerRef;
    private pagesWithHeaderHidden: Array<any> = [
        '/application/login',
        '/application/setup'
    ];
    private showHeader: boolean = false;
    private routeArray = [];
    public showErrorHeader: boolean = true;
    public url = '';

    //Inject classes
    public modalAdvService: ModalAdvService;

    public constructor(
        injector: Injector,
        viewContainerRef: ViewContainerRef,
        private store: Store<any>,
        private riExchange: RiExchange,
        private componentsHelper: ComponentsHelper,
        private _logger: Logger,
        private router: Router,
        private util: Utils,
        private subjectService: SubjectService,
        private zone: NgZone,
        private variableService: VariableService,
        private location: Location,
        private http: Http,
        private authService: AuthService,
        private globalize: GlobalizeService
    ) {
        this.injectServices(injector);
        //Code Below tracks page route for Google Analytic-->starts
        router.events.distinctUntilChanged((previous: any, current: any) => {
            if (current instanceof NavigationEnd) {
                return previous.url === current.url;
            }
            return true;
        }).subscribe((x: any) => {
            ga('set', 'userId', this.util.getUserCode());
            ga('set', 'page', x.url);
            ga('send', 'pageview');
        });
        this.subjectService.getObservable().subscribe((error) => {
            if (error !== 0) {
                /*this.zone.run(() => {
                    this.errorModal.show(error, true);
                });*/
                this.setDisplay(false);
                this.router.navigate([], { skipLocationChange: true, preserveQueryParams: true });
                alert(error.stack);
            }
        });

        //Code Below tracks page route for Google Analytic-->ends
        this.viewContainerRef = viewContainerRef;
        componentsHelper.setRootViewContainerRef(this.viewContainerRef);
        router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                if (navigator && typeof navigator['onLine'] !== 'undefined' && navigator.onLine === false && process.env.NODE_ENV !== 'DEV') {
                    this.triggerNetworkMessage();
                }
                this.url = this.router.url;
                this.setDisplay(true);
                this.showHeader = false;
                if (this.pagesWithHeaderHidden.indexOf(event.url) < 0) {
                    this.showHeader = true;
                }
                DatepickerComponent.dateInstance = [];
                DatepickerComponent.dateInstanceCounter = 0;
                if (this.variableService.getMenuClick() === true || this.variableService.getAutoCompleteSelection() === true) {
                    this.clearStore();
                    this.variableService.setContractStoreData({});
                    this.riExchange.clearNavigationData();
                    this.riExchange.clearRouterParams();
                }
            }
            if (event instanceof NavigationEnd) {
                this.util.setCurrentUrl(event.url);
                this.setDisplay(false);
                setTimeout(() => {
                    window.scrollTo(0, 0);
                }, 0);
                if (this.url !== event.url) {
                    if (/*(event.url.indexOf('fromMenu=true') !== -1 && this.variableService.getMenuClick() === true) || (event.url.indexOf('fromMenu=true') !== -1 && this.variableService.getAutoCompleteSelection() === true) ||*/ event.url.indexOf('/postlogin') !== -1 || event.url === '/') {
                        this.clearStore();
                        this.variableService.setContractStoreData({});
                        this.riExchange.clearNavigationData();
                        this.riExchange.clearRouterParams();
                    }
                }
                this.showHeader = false;
                if (this.pagesWithHeaderHidden.indexOf(event.url) < 0 || this.pagesWithHeaderHidden.indexOf(event.urlAfterRedirects) < 0) {
                    this.showHeader = true;
                }
                /*if (this.variableService.getMenuClick() === true) {
                    this.clearStore();
                    this.variableService.setContractStoreData({});
                }*/
                this.variableService.setMenuClick(false);
                this.variableService.setLogoutClick(false);
                this.variableService.setBackClick(false);
                this.variableService.setAutoCompleteSelection(false);

                let n = this.location.path().indexOf('?');
                this.routeArray.push(this.location.path().substring(0, n !== -1 ? n : this.location.path().length));
                this.routeArray = this.routeArray.filter((item, i, ar) => { return ar.indexOf(item) === i; });
                if (this.routeArray.length > Number(process.env.SCREEN_MEMORY_THRESOLD) && this.location.path().indexOf(GlobalConstant.Configuration.Home) !== -1) {
                    window.location.reload();
                }
            }

            if (event instanceof NavigationCancel) {
                this.url = this.router.url;
                this.variableService.setMenuClick(false);
                this.variableService.setAutoCompleteSelection(false);
                this.variableService.setBackClick(false);
                this.util.resetOptions();
            }
        });
        /*if (process.env.FETCH_TRANSLATION_FROM_FIREBASE) {
            GlobalConstant.Configuration.DefaultLocaleUrl = 'i18n/';
        }*/
        this.modalAdvService.getObservableSource().subscribe((data) => {
            if (data) {
                this.modalAdv.show(data);
            }
        });
    }

    ngOnInit(): void {
        if (navigator && typeof navigator['onLine'] !== 'undefined') {
            window.addEventListener('offline', (e) => {
                this.triggerNetworkMessage();
            });
            window.addEventListener('online', (e) => {
                this.errorModal.hide();
            });
        }
        if (this.authService.isSignedIn()) {
            this.globalize.init();
        }
    }

    ngAfterViewInit(): void {
        // statement
    }

    private triggerNetworkMessage(): void {
        this.zone.run(() => {
            this.errorModal.show({
                error: {
                    title: 'Error',
                    message: ErrorConstant.Message.InternetFail
                }
            }, true);
        });
    }

    private setDisplay(visible: boolean): void {
        if (visible) {
            this.overlay.nativeElement['style'].display = 'block';
            this.spinner.isRunning = visible;
        } else {
            this.overlay.nativeElement['style'].display = 'none';
            this.spinner.isRunning = visible;
        }
    }

    private injectServices(injector: Injector): void {
        this.modalAdvService = injector.get(ModalAdvService);
    }

    public clearStore(): void {
        this.store.dispatch({ type: ActionTypes.CLEAR_ACCOUNT_DATA });
        this.store.dispatch({ type: ContractActionTypes.CLEAR_ALL });
        this.store.dispatch({ type: CallCenterActionTypes.CLEAR_ALL });
        this.store.dispatch({ type: AccountMaintenanceActionTypes.CLEAR_ALL });
        this.store.dispatch({ type: InvoiceActionTypes.CLEAR });
    }
}
