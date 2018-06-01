import { ModalAdvService } from './shared/components/modal-adv/modal-adv.service';
import { Component, ViewContainerRef, ViewChild, NgZone, Injector } from '@angular/core';
import { ComponentsHelper } from 'ng2-bootstrap/ng2-bootstrap';
import { Logger } from '@nsalaun/ng2-logger';
import { Store } from '@ngrx/store';
import { Location } from '@angular/common';
import { Router, NavigationStart, NavigationEnd, NavigationCancel } from '@angular/router';
import { GlobalConstant } from './shared/constants/global.constant';
import { DatepickerComponent } from './shared/components/datepicker/datepicker';
import { Utils } from './shared/services/utility';
import { SubjectService } from './shared/services/subject.service';
import { VariableService } from './shared/services/variable.service';
import { RiExchange } from './shared/services/riExchange';
import { ActionTypes } from './app/actions/account';
import { ContractActionTypes } from './app/actions/contract';
import { CallCenterActionTypes } from './app/actions/call-centre-search';
import { AccountMaintenanceActionTypes } from './app/actions/account-maintenance';
import { InvoiceActionTypes } from './app/actions/invoice';
export var AppComponent = (function () {
    function AppComponent(injector, viewContainerRef, store, riExchange, componentsHelper, _logger, router, util, subjectService, zone, variableService, location) {
        var _this = this;
        this.store = store;
        this.riExchange = riExchange;
        this._logger = _logger;
        this.router = router;
        this.util = util;
        this.subjectService = subjectService;
        this.zone = zone;
        this.variableService = variableService;
        this.location = location;
        this.pagesWithHeaderHidden = [
            '/application/login',
            '/application/setup'
        ];
        this.showHeader = false;
        this.routeArray = [];
        this.showErrorHeader = true;
        this.url = '';
        this.injectServices(injector);
        router.events.distinctUntilChanged(function (previous, current) {
            if (current instanceof NavigationEnd) {
                return previous.url === current.url;
            }
            return true;
        }).subscribe(function (x) {
            ga('set', 'userId', _this.util.getUserCode());
            ga('set', 'page', x.url);
            ga('send', 'pageview');
        });
        this.subjectService.getObservable().subscribe(function (error) {
            if (error !== 0) {
                document.querySelector('icabs-app .lazy-spinner .spinner')['style'].display = 'none';
                document.querySelector('icabs-app .ajax-overlay')['style'].display = 'none';
                alert(error.stack);
            }
        });
        this.viewContainerRef = viewContainerRef;
        componentsHelper.setRootViewContainerRef(this.viewContainerRef);
        router.events.subscribe(function (event) {
            if (event instanceof NavigationStart) {
                _this.url = _this.router.url;
                document.querySelector('icabs-app .lazy-spinner .spinner')['style'].display = 'block';
                document.querySelector('icabs-app .ajax-overlay')['style'].display = 'block';
                _this.showHeader = false;
                if (_this.pagesWithHeaderHidden.indexOf(event.url) < 0) {
                    _this.showHeader = true;
                }
                DatepickerComponent.dateInstance = [];
                DatepickerComponent.dateInstanceCounter = 0;
            }
            if (event instanceof NavigationEnd) {
                document.querySelector('icabs-app .lazy-spinner .spinner')['style'].display = 'none';
                document.querySelector('icabs-app .ajax-overlay')['style'].display = 'none';
                setTimeout(function () {
                    window.scrollTo(0, 0);
                }, 0);
                if (_this.url !== event.url) {
                    if (event.url.indexOf('/postlogin') !== -1 || event.url === '/') {
                        _this.clearStore();
                        _this.riExchange.clearNavigationData();
                    }
                }
                _this.variableService.setMenuClick(false);
                _this.variableService.setLogoutClick(false);
                var n = _this.location.path().indexOf('?');
                _this.routeArray.push(_this.location.path().substring(0, n !== -1 ? n : _this.location.path().length));
                _this.routeArray = _this.routeArray.filter(function (item, i, ar) { return ar.indexOf(item) === i; });
                if (_this.routeArray.length > Number(process.env.SCREEN_MEMORY_THRESOLD) && _this.location.path().indexOf(GlobalConstant.Configuration.Home) !== -1) {
                    window.location.reload();
                }
            }
            if (event instanceof NavigationCancel) {
                _this.url = _this.router.url;
                _this.variableService.setMenuClick(false);
            }
        });
        if (process.env.FETCH_TRANSLATION_FROM_FIREBASE) {
            GlobalConstant.Configuration.DefaultLocaleUrl = 'i18n/';
        }
        this.modalAdvService.getObservableSource().subscribe(function (data) {
            if (data) {
                _this.modalAdv.show(data);
            }
        });
    }
    AppComponent.prototype.ngOnInit = function () {
    };
    AppComponent.prototype.injectServices = function (injector) {
        this.modalAdvService = injector.get(ModalAdvService);
    };
    AppComponent.prototype.clearStore = function () {
        this.store.dispatch({ type: ActionTypes.CLEAR_ACCOUNT_DATA });
        this.store.dispatch({ type: ContractActionTypes.CLEAR_ALL });
        this.store.dispatch({ type: CallCenterActionTypes.CLEAR_ALL });
        this.store.dispatch({ type: AccountMaintenanceActionTypes.CLEAR_ALL });
        this.store.dispatch({ type: InvoiceActionTypes.CLEAR });
    };
    AppComponent.decorators = [
        { type: Component, args: [{
                    selector: 'icabs-app',
                    template: "\n        <icabs-header [displayUser]=true *ngIf=\"showHeader\"></icabs-header>\n        <router-outlet></router-outlet>\n        <icabs-footer></icabs-footer>\n        <icabs-spinner class='lazy-spinner'></icabs-spinner>\n        <icabs-modal #errorModal=\"child\" [(showHeader)]=\"showErrorHeader\" [config]=\"{backdrop: 'static'}\"></icabs-modal>\n        <icabs-modal-adv #modalAdv=\"child\"></icabs-modal-adv>\n        <div class=\"ajax-overlay\" style=\"display: none;\"></div>\n    "
                },] },
    ];
    AppComponent.ctorParameters = [
        { type: Injector, },
        { type: ViewContainerRef, },
        { type: Store, },
        { type: RiExchange, },
        { type: ComponentsHelper, },
        { type: Logger, },
        { type: Router, },
        { type: Utils, },
        { type: SubjectService, },
        { type: NgZone, },
        { type: VariableService, },
        { type: Location, },
    ];
    AppComponent.propDecorators = {
        'errorModal': [{ type: ViewChild, args: ['errorModal',] },],
        'modalAdv': [{ type: ViewChild, args: ['modalAdv',] },],
    };
    return AppComponent;
}());
