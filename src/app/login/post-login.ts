import { Component, OnInit, OnDestroy, ViewChild, NgZone, trigger, state, style } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs/Subscription';
import { AuthService } from '../../shared/services/auth.service';
import { ErrorService } from '../../shared/services/error.service';
import { GlobalConstant } from '../../shared/constants/global.constant';
import { ComponentInteractionService } from '../../shared/services/component-interaction.service';
import { LocalStorageService, SessionStorageService } from 'ng2-webstorage';
import { RiExchange } from '../../shared/services/riExchange';

@Component({
    selector: 'icabs-post-login',
    template: ` <div class="container-fluid custom-container"><router-outlet></router-outlet></div>
                <icabs-modal #errorModal="child" [(showHeader)]="showErrorHeader" [config]="{backdrop: 'static'}"></icabs-modal>`
})


export class PostLoginComponent implements OnInit, OnDestroy {
    @ViewChild('errorModal') public errorModal;
    public authJson: any;
    public muleJson: any;
    public displayNavBar: boolean;
    public showErrorHeader: boolean = true;
    public componentInteractionSubscription: Subscription;
    public errorSubscription: Subscription;
    public routerSubscription: Subscription;

    constructor(private riExchange: RiExchange, private _authService: AuthService, private _router: Router, private _ls: LocalStorageService, private _componentInteractionService: ComponentInteractionService, private _zone: NgZone, private _errorService: ErrorService, private sessionStorage: SessionStorageService, private titleService: Title) {

        this.componentInteractionSubscription = this._componentInteractionService.getObservableSource().subscribe(msg => {
            if (msg !== 0) {

                this._zone.run(() => {
                    this.displayNavBar = msg;
                });
            }
        });

        this.routerSubscription = this._router.events.subscribe(event => {
            if (event.url === '/postlogin') {
                this._componentInteractionService.emitMessage(true);
            }
        });
    }

    ngOnInit(): void {
        this.displayNavBar = true;
        this.titleService.setTitle(GlobalConstant.Configuration.AppName);
        this._authService.handleClientLoad(false, false);
        if (!this._authService.isSignedIn()) {
            this._componentInteractionService.emitMessage(false);
            this._authService.signOut();
            this._router.navigate(['/application/login']);
            return;
        }

        //this._authService.getUserAccessDetails();

        if (!this._authService.oauthResponse) {
            this.authJson = this._ls.retrieve('OAUTH');
        } else {
            this.authJson = this._authService.oauthResponse;
        }

        this._errorService.emitError(0);
        this.errorSubscription = this._errorService.getObservableSource().subscribe(error => {
            if (error !== 0) {
                this._zone.run(() => {
                    if (error.redirect) {
                        setTimeout(() => {
                            //this.errorModal.show({ error: error });
                            this._authService.clearData();
                            this._authService.signOut();
                            this._router.navigate(['/application/login']);
                        }, 1000);
                    } else {
                        this.errorModal.show({ error: error });
                    }
                });
            }
        });



        this.muleJson = this._authService.getMuleResponse();

        // Remove Nav Stack
        this.sessionStorage.clear('NAVIGATION_STACK');
    }

    ngOnDestroy(): void {
        if (this.componentInteractionSubscription) {
            this.componentInteractionSubscription.unsubscribe();
        }

        if (this.errorSubscription) {
            this.errorSubscription.unsubscribe();
        }
        if (this.routerSubscription) {
            this.routerSubscription.unsubscribe();
        }
        //this.riExchange.releaseReference(this);
    }
}
