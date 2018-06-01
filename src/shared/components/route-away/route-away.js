import { TranslateService } from 'ng2-translate';
import { LocaleTranslationService } from './../../services/translation.service';
import { RouteAwayGlobals } from './../../services/route-away-global.service';
import { Observable } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';
import { Component, ViewChild, NgZone, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { VariableService } from '../../services/variable.service';
import { RiExchange } from '../../services/riExchange';
import { ActionTypes } from '../../../app/actions/account';
import { ContractActionTypes } from '../../../app/actions/contract';
import { CallCenterActionTypes } from '../../../app/actions/call-centre-search';
import { AccountMaintenanceActionTypes } from '../../../app/actions/account-maintenance';
import { InvoiceActionTypes } from '../../../app/actions/invoice';
import { Router } from '@angular/router';
export var RouteAwayComponent = (function () {
    function RouteAwayComponent(zone, router, store, riExchange, variableService, routeAwayGlobals, localeTranslateService, translate) {
        var _this = this;
        this.zone = zone;
        this.router = router;
        this.store = store;
        this.riExchange = riExchange;
        this.variableService = variableService;
        this.routeAwayGlobals = routeAwayGlobals;
        this.localeTranslateService = localeTranslateService;
        this.translate = translate;
        this.showMessageHeader = true;
        this.promptTitle = '';
        this.showPromptCloseButton = false;
        this.promptModalConfig = {
            ignoreBackdropClick: true
        };
        this.allElementsValuesArr = [];
        this.cancelRouting = new EventEmitter();
        this.translateSubscription = this.localeTranslateService.ajaxSource$.subscribe(function (event) {
            if (event !== 0) {
                _this.fetchTranslationContent();
            }
        });
        this.dataEvent = new Subject();
    }
    RouteAwayComponent.prototype.ngOnInit = function () {
    };
    RouteAwayComponent.prototype.ngOnDestroy = function () {
        if (this.dataEvent)
            this.dataEvent.unsubscribe();
        this.routeAwayGlobals.resetRouteAwayFlags();
    };
    RouteAwayComponent.prototype.canDeactivate = function () {
        var _this = this;
        this.canDeactivateObservable = new Observable(function (observer) {
            if (_this.routeAwayGlobals.getDirtyFlag()) {
                if (!_this.checkFormElementStatusCheck()) {
                    if (!_this.routeAwayGlobals.getEllipseOpenFlag()) {
                        if (_this.variableService.getLogoutClick() === true) {
                            observer.next(true);
                        }
                        _this.canDeactivateOpenModal(observer);
                    }
                    else {
                        _this.checkMenuClick();
                        observer.next(true);
                    }
                }
                else {
                    _this.checkMenuClick();
                    observer.next(true);
                }
            }
            else {
                if (_this.routeAwayGlobals.getSaveEnabledFlag()) {
                    if (!_this.routeAwayGlobals.getEllipseOpenFlag()) {
                        if (_this.variableService.getLogoutClick() === true) {
                            observer.next(true);
                        }
                        _this.canDeactivateOpenModal(observer);
                    }
                    else {
                        _this.checkMenuClick();
                        observer.next(true);
                    }
                }
                else {
                    _this.checkMenuClick();
                    observer.next(true);
                }
            }
        });
        return this.canDeactivateObservable;
    };
    RouteAwayComponent.prototype.canDeactivateOpenModal = function (observer) {
        var _this = this;
        this.promptModal.show();
        this.promptModal.saveEmit.subscribe(function (event) {
            if (event.value === 'save') {
                _this.checkMenuClick();
                _this.dataEvent.next(event);
                observer.next(true);
            }
        });
        this.promptModal.cancelEmit.subscribe(function (event) {
            document.querySelector('icabs-app .lazy-spinner .spinner')['style'].display = 'none';
            if (event.value === 'cancel') {
                observer.next(false);
                setTimeout(function () {
                    _this.router.navigate([], { skipLocationChange: true, preserveQueryParams: true });
                }, 0);
            }
            _this.cancelRouting.emit();
        });
    };
    RouteAwayComponent.prototype.checkFormElementStatusCheck = function () {
        var formElements = document.getElementsByClassName('form-control');
        var dirtyFlag = [];
        for (var i = 0; i < formElements.length; i++) {
            if (formElements[i].className.indexOf('ng-dirty') > -1) {
                if (this.isVisible(formElements[i]))
                    dirtyFlag.push(1);
            }
        }
        if (dirtyFlag.length > 0) {
            return false;
        }
        else {
            return true;
        }
    };
    RouteAwayComponent.prototype.resetDirtyFlagAfterSaveUpdate = function () {
        var formElements = document.getElementsByClassName('form-control');
        for (var i = 0; i < formElements.length; i++) {
            if (formElements[i].className.indexOf('ng-dirty') > -1) {
                formElements[i].className = formElements[i].className.replace('ng-dirty', '');
            }
        }
    };
    RouteAwayComponent.prototype.makeDirty = function (formObject, formFlag) {
        formObject.markAsDirty();
    };
    RouteAwayComponent.prototype.isVisible = function (element) {
        return element.offsetWidth > 0 && element.offsetHeight > 0;
    };
    RouteAwayComponent.prototype.getAllElementsValues = function () {
        var allInputs = document.getElementsByTagName('input');
        for (var i = 0; i < allInputs.length; i++) {
            this.allElementsValuesArr.push(allInputs[i].value);
        }
        ;
    };
    RouteAwayComponent.prototype.setAllElementsValues = function () {
        var allInputs = document.getElementsByTagName('input');
        for (var i = 0; i < this.allElementsValuesArr.length; i++) {
            allInputs[i].value = this.allElementsValuesArr[i];
        }
        ;
    };
    RouteAwayComponent.prototype.fetchTranslationContent = function () {
        var _this = this;
        this.getTranslatedValue('There are unsaved changes. Are you sure you want to move away?', null).subscribe(function (res) {
            _this.zone.run(function () {
                if (res) {
                    _this.promptContent = res;
                }
            });
        });
    };
    RouteAwayComponent.prototype.getTranslatedValue = function (key, params) {
        if (params) {
            return this.translate.get(key, { value: params });
        }
        else {
            return this.translate.get(key);
        }
    };
    RouteAwayComponent.prototype.clearStore = function () {
        this.store.dispatch({ type: ActionTypes.CLEAR_ACCOUNT_DATA });
        this.store.dispatch({ type: ContractActionTypes.CLEAR_ALL });
        this.store.dispatch({ type: CallCenterActionTypes.CLEAR_ALL });
        this.store.dispatch({ type: AccountMaintenanceActionTypes.CLEAR_ALL });
        this.store.dispatch({ type: InvoiceActionTypes.CLEAR });
    };
    RouteAwayComponent.prototype.checkMenuClick = function () {
        if (this.variableService.getMenuClick() === true) {
            this.clearStore();
            this.riExchange.clearNavigationData();
        }
    };
    RouteAwayComponent.decorators = [
        { type: Component, args: [{
                    selector: 'icabs-routeaway',
                    template: "<icabs-prompt-modal class=\"routeAway\" #promptModal=\"child\" [(showHeader)]=\"showMessageHeader\" [(showCloseButton)] = \"showPromptCloseButton\" [title]=\"promptTitle\" [content]=\"promptContent\" [config] = \"promptModalConfig\"></icabs-prompt-modal>"
                },] },
    ];
    RouteAwayComponent.ctorParameters = [
        { type: NgZone, },
        { type: Router, },
        { type: Store, },
        { type: RiExchange, },
        { type: VariableService, },
        { type: RouteAwayGlobals, },
        { type: LocaleTranslationService, },
        { type: TranslateService, },
    ];
    RouteAwayComponent.propDecorators = {
        'promptModal': [{ type: ViewChild, args: ['promptModal',] },],
        'cancelRouting': [{ type: Output },],
    };
    return RouteAwayComponent;
}());
