import { TranslateService } from 'ng2-translate';
import { LocaleTranslationService } from './../../services/translation.service';
import { Subscription } from 'rxjs/Subscription';
import { RouteAwayGlobals } from './../../services/route-away-global.service';
import { Location } from '@angular/common';
import { Observable } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';
import { Component, OnInit, OnDestroy, ViewChild, NgZone, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { VariableService } from '../../services/variable.service';
import { Utils } from '../../services/utility';
import { RiExchange } from '../../services/riExchange';
import { ActionTypes } from '../../../app/actions/account';
import { ContractActionTypes } from '../../../app/actions/contract';
import { CallCenterActionTypes } from '../../../app/actions/call-centre-search';
import { AccountMaintenanceActionTypes } from '../../../app/actions/account-maintenance';
import { InvoiceActionTypes } from '../../../app/actions/invoice';
import {
    ActivatedRouteSnapshot,
    CanActivate,
    CanDeactivate,
    Router,
    RouterStateSnapshot
} from '@angular/router';

@Component({
    selector: 'icabs-routeaway',
    template: `<icabs-prompt-modal class="routeAway" #promptModal="child" [(showHeader)]="showMessageHeader" [(showCloseButton)] = "showPromptCloseButton" [title]="promptTitle" [content]="promptContent" [config] = "promptModalConfig"></icabs-prompt-modal>`
})
export class RouteAwayComponent implements OnInit, OnDestroy {
    @ViewChild('promptModal') public promptModal;
    public showMessageHeader: boolean = true;
    public promptTitle: string = '';
    public promptContent: string;
    public canDeactivateObservable: Observable<boolean>;
    public showPromptCloseButton: boolean = false;
    public translateSubscription: Subscription;
    public promptModalConfig = {
        ignoreBackdropClick: true,
        keyboard: false
    };
    public allElementsValuesArr = [];
    public dataEvent: any;
    @Output() cancelRouting = new EventEmitter();

    constructor(private zone: NgZone, private router: Router, private store: Store<any>, private riExchange: RiExchange, private variableService: VariableService, private routeAwayGlobals: RouteAwayGlobals, private localeTranslateService: LocaleTranslationService, private translate: TranslateService, private location: Location, private util: Utils) {
        this.translateSubscription = this.localeTranslateService.ajaxSource$.subscribe(event => {
            if (event !== 0) {
                this.fetchTranslationContent();
            }
        });
        this.dataEvent = new Subject<any>();
    }

    ngOnInit(): void {
        // statement

    }

    ngOnDestroy(): void {
        if (this.dataEvent)
            this.dataEvent.unsubscribe();
        this.routeAwayGlobals.resetRouteAwayFlags();
    }

    public canDeactivate(): Observable<boolean> {
        this.canDeactivateObservable = new Observable((observer) => {
            if (this.routeAwayGlobals.getDirtyFlag()) {
                if (!this.checkFormElementStatusCheck()) {
                    if (!this.routeAwayGlobals.getEllipseOpenFlag()) {
                        if (this.variableService.getLogoutClick() === true) {
                            observer.next(true);
                        }
                        this.canDeactivateOpenModal(observer);
                    } else {
                        this.checkMenuClick();
                        observer.next(true);
                    }
                } else {
                    this.checkMenuClick();
                    observer.next(true);
                }
            } else {
                if (this.routeAwayGlobals.getSaveEnabledFlag()) {
                    if (!this.routeAwayGlobals.getEllipseOpenFlag()) {
                        if (this.variableService.getLogoutClick() === true) {
                            observer.next(true);
                        }
                        this.canDeactivateOpenModal(observer);
                    } else {
                        this.checkMenuClick();
                        observer.next(true);
                    }
                } else {
                    this.checkMenuClick();
                    observer.next(true);
                }
            }
        });
        return this.canDeactivateObservable;
    }

    public canDeactivateOpenModal(observer: any): void {
        this.promptModal.show();
        this.promptModal.saveEmit.subscribe((event) => {
            if (event.value === 'save') {
                this.checkMenuClick();
                this.dataEvent.next(event);
                observer.next(true);
            }
        });
        this.promptModal.cancelEmit.subscribe((event) => {
            //this.getAllElementsValues();
            //this.router.navigate([this.router.url]);
            //this.setAllElementsValues();
            document.querySelector('icabs-app .lazy-spinner .spinner')['style'].display = 'none';
            document.querySelector('icabs-app .ajax-overlay')['style'].display = 'none';
            if (event.value === 'cancel') {
                if (this.variableService.getBackClick() === true) {
                    this.variableService.setBackClick(false);
                    this.location.go(this.util.getCurrentUrl());
                }
                observer.next(false);
                setTimeout(() => {
                    this.router.navigate([], { skipLocationChange: true, preserveQueryParams: true });
                }, 0);
            }
            this.cancelRouting.emit();
        });
    }

    public checkFormElementStatusCheck(): boolean {
        let formElements = document.getElementsByClassName('form-control');
        let dirtyFlag = [];
        for (let i = 0; i < formElements.length; i++) {
            if (formElements[i].className.indexOf('ng-dirty') > -1) {
                if (this.isVisible(formElements[i]))
                    dirtyFlag.push(1);
            }
        }
        if (dirtyFlag.length > 0) {
            return false;
        } else {
            return true;
        }
    }

    public resetDirtyFlagAfterSaveUpdate(): void {
        let formElements = document.getElementsByClassName('form-control');
        for (let i = 0; i < formElements.length; i++) {
            if (formElements[i].className.indexOf('ng-dirty') > -1) {
                formElements[i].className = formElements[i].className.replace('ng-dirty', '');
            }
        }
    }
    public makeDirty(formObject: any, formFlag: any): any {
        formObject.markAsDirty();
    }
    public isVisible(element: any): boolean {
        return element.offsetWidth > 0 && element.offsetHeight > 0;
    }
    public getAllElementsValues(): void {
        let allInputs = document.getElementsByTagName('input');
        for (let i = 0; i < allInputs.length; i++) {
            this.allElementsValuesArr.push(allInputs[i].value);
        };
    }
    public setAllElementsValues(): void {
        let allInputs = document.getElementsByTagName('input');
        for (let i = 0; i < this.allElementsValuesArr.length; i++) {
            allInputs[i].value = this.allElementsValuesArr[i];
        };
    }

    public fetchTranslationContent(): void {
        this.getTranslatedValue('There are unsaved changes. Are you sure you want to move away?', null).subscribe((res: string) => {
            this.zone.run(() => {
                if (res) {
                    this.promptContent = res;
                }
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
    public clearStore(): void {
        this.store.dispatch({ type: ActionTypes.CLEAR_ACCOUNT_DATA });
        this.store.dispatch({ type: ContractActionTypes.CLEAR_ALL });
        this.store.dispatch({ type: CallCenterActionTypes.CLEAR_ALL });
        this.store.dispatch({ type: AccountMaintenanceActionTypes.CLEAR_ALL });
        this.store.dispatch({ type: InvoiceActionTypes.CLEAR });
    }

    public checkMenuClick(): void {
        if (this.variableService.getMenuClick() === true || this.variableService.getAutoCompleteSelection() === true) {
            this.clearStore();
            this.variableService.setContractStoreData({});
            this.riExchange.clearNavigationData();
            this.riExchange.clearRouterParams();
        }
    }
}
