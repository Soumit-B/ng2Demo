import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, NgZone, trigger, state, style, animate, transition } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Title } from '@angular/platform-browser';
import { AuthService } from '../../shared/services/auth.service';
import { ErrorService } from '../../shared/services/error.service';
import { AjaxObservableConstant } from '../../shared/constants/ajax-observable.constant';
import { RiExchange } from '../../shared/services/riExchange';
import { ErrorConstant } from './../../shared/constants/error.constant';

@Component({
    selector: 'icabs-login',
    templateUrl: 'login.html'
})

export class LoginComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('childModal') public childModal;
    public errorTitle: string;
    public errorMessage: string;
    public isRequesting: boolean = false;
    public showHeader: boolean = true;
    public pageTitle: string = 'iCabs';
    public loginEnable: boolean = true;

    public errorSubscription: Subscription;
    public ajaxSubscription: Subscription;

    constructor(private riExchange: RiExchange, private _authService: AuthService, private _errorService: ErrorService, private _router: Router, private _ajaxconstant: AjaxObservableConstant, private _zone: NgZone, private titleService: Title) {
        this.isRequesting = false;
        this._errorService.emitError(0);
        this._authService.ajaxSource.next(0);
        this.errorSubscription = this._errorService.getObservableSource().subscribe(error => {
            if (error !== 0) {
                this._zone.run(() => {
                    this.errorTitle = error.title;
                    this.errorMessage = error.message;
                    this.childModal.show({ error: error }, true);
                });
            }

        });

        this.ajaxSubscription = this._authService.ajaxSource$.subscribe(event => {
            if (event !== 0) {
                this._zone.run(() => {

                    switch (event) {
                        case this._ajaxconstant.START:

                            this.isRequesting = true;
                            break;
                        case this._ajaxconstant.COMPLETE:

                            this.isRequesting = false;
                            this._zone.run(() => {
                                this.isRequesting = false;
                            });

                            break;
                    }
                });
            }
        });
        this._authService.handleClientLoad(true, true);
    }

    ngOnInit(): void {
        this.titleService.setTitle(this.pageTitle);
    }

    ngAfterViewInit(): void {
        // statement
    }

    ngOnDestroy(): void {
        // prevent memory leak when component is destroyed
        this.errorSubscription.unsubscribe();
        this.ajaxSubscription.unsubscribe();
        //this.riExchange.releaseReference(this);
    }

    public signIn(event: any): void {
        event.preventDefault();
        if (navigator && typeof navigator['onLine'] !== 'undefined' && navigator.onLine === false) {
            let _error: any = {};
            _error.title = 'Error';
            _error.message = ErrorConstant.Message.InternetFail;
            this._errorService.emitError(_error);
        }
        this._authService.signIn();
    };
}
