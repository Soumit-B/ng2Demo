import { BoundCallbackObservable } from '@angular-cli/ast-tools/node_modules/rxjs/observable/BoundCallbackObservable';
import { Component, OnInit, AfterViewInit, OnDestroy, Input, ViewChild } from '@angular/core';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { LocalStorageService } from 'ng2-webstorage';
import { Store } from '@ngrx/store';
import { ActionTypes } from '../../../app/actions/account';
import { VariableService } from '../../services/variable.service';
import { ContractActionTypes } from '../../../app/actions/contract';
import { CallCenterActionTypes } from '../../../app/actions/call-centre-search';
import { AccountMaintenanceActionTypes } from '../../../app/actions/account-maintenance';
import { InvoiceActionTypes } from '../../../app/actions/invoice';
import { MessageConstant } from '../../constants/message.constant';

@Component({
    selector: 'icabs-header',
    templateUrl: 'header.html'
})

export class HeaderComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('promptModal') public promptModal;
    @ViewChild('mainnavref') public mainnavref;

    @Input() displayUser: boolean;
    public name: string;
    public errorMessage: string;
    public displayUserMenu: boolean = false;
    public displayNav: boolean = false;
    public displayBackLink: boolean = true;
    private routerSubscription: any;
    public promptConfirmTitle: string = 'Confirm';
    public promptConfirmContent: any = [];

    constructor(private _authService: AuthService, private _ls: LocalStorageService, private store: Store<any>, private location: Location, private router: Router, private variableService: VariableService) {
        this.routerSubscription = router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                if (event.url.indexOf('/postlogin') !== -1 || event.url === '/') {
                    this.displayBackLink = false;
                } else {
                    this.displayBackLink = true;
                }
            }
            if (event.url.indexOf('/postlogin') !== -1 || event.url === '/') {
                this.promptConfirmContent = [MessageConstant.Message.SignOutMessage];
            } else {
                this.promptConfirmContent = [MessageConstant.Message.SignOutMessage, MessageConstant.Message.SignOutUnsavedMessage];
            }
        });

    }


    ngOnInit(): void {
        // For page reload scenario
        if (window.location.hash.indexOf('/postlogin') !== -1 || window.location.hash === '/') {
            this.displayBackLink = false;
            this.promptConfirmContent = [MessageConstant.Message.SignOutMessage];
        } else {
            this.promptConfirmContent = [MessageConstant.Message.SignOutMessage, MessageConstant.Message.SignOutUnsavedMessage];
        }
        if (typeof this.displayUser === 'undefined') {
            this.displayUser = true;
        }
        this.name = this._authService.displayName;
        if (!this.name) {
            this.name = this._ls.retrieve('DISPLAYNAME');
        }
        this.mainnavref.closeNavEmit.subscribe((data) => {
            this.closeNav(data);
        });
    }

    ngAfterViewInit(): void {
        // statement
    }

    ngOnDestroy(): void {
        if (this.routerSubscription) {
            this.routerSubscription.unsubscribe();
        }
    }

    public signOut(e: any): void {
        e.preventDefault();
        this.promptModal.show();
    }
    public UserMenu(e: any): void {
        e.preventDefault();
        this.displayUserMenu = true;
    }
    public closeUserMenu(e: any): void {
        e.preventDefault();
        this.displayUserMenu = false;
    }
    public hamburger(e: any): void {
        e.preventDefault();
        this.displayNav = true;
    }
    public closeNav(e: any): void {
        e.preventDefault();
        this.displayNav = false;
    }
    public promptConfirm(event: any): void {
        this.variableService.setLogoutClick(true);
        this._authService.signOut();
        setTimeout(() => {
            window.location.reload();
        }, 500);
    }

    public settings(e: any): void {
        e.preventDefault();
    }

    public clearStore(): void {
        /*this.store.dispatch({ type: ActionTypes.CLEAR_ACCOUNT_DATA });
        this.store.dispatch({ type: ContractActionTypes.CLEAR_ALL });
        this.store.dispatch({ type: CallCenterActionTypes.CLEAR_ALL });
        this.store.dispatch({ type: AccountMaintenanceActionTypes.CLEAR_ALL });
        this.store.dispatch({ type: InvoiceActionTypes.CLEAR });*/
    }

    public backLinkOnClick(event: any): void {
        event.preventDefault();
        this.variableService.setBackClick(true);
        this.location.back();
    }
}
