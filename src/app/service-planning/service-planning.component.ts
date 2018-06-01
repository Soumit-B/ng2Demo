import { Component, ViewContainerRef, OnInit, AfterViewInit, OnDestroy, ViewChild, NgZone, trigger, state, style } from '@angular/core';
import { ComponentsHelper } from 'ng2-bootstrap/ng2-bootstrap';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { AuthService } from '../../shared/services/auth.service';
import { ErrorService } from '../../shared/services/error.service';
import { ComponentInteractionService } from '../../shared/services/component-interaction.service';
import { LocalStorageService } from 'ng2-webstorage';
import { RiExchange } from '../../shared/services/riExchange';

@Component({
    template: `<router-outlet></router-outlet>
        <icabs-modal #errorModal="child" [(showHeader)]="showErrorHeader" [config]="{backdrop: 'static'}"></icabs-modal>`
})

export class ServicePlanningRootComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('errorModal') public errorModal;
    public authJson: any;
    public muleJson: any;
    public displayNavBar: boolean;
    public showErrorHeader: boolean = true;
    public componentInteractionSubscription: Subscription;
    public errorSubscription: Subscription;
    public routerSubscription: Subscription;

    constructor(viewContainerRef: ViewContainerRef, componentsHelper: ComponentsHelper, private riExchange: RiExchange, private _authService: AuthService, private _router: Router, private _ls: LocalStorageService, private _componentInteractionService: ComponentInteractionService, private _zone: NgZone, private _errorService: ErrorService) {

        componentsHelper.setRootViewContainerRef(viewContainerRef);
    }

    ngOnInit(): void {
        this.displayNavBar = true;
        this._authService.handleClientLoad(false, false);
        if (!this._authService.isSignedIn()) {

            this._router.navigate(['/application/login']);
            return;
        }

        if (!this._authService.oauthResponse) {
            this.authJson = this._ls.retrieve('OAUTH');
        } else {
            this.authJson = this._authService.oauthResponse;
        }
        this.muleJson = this._authService.getMuleResponse();
    }

    ngAfterViewInit(): void {
            // statement
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
        this.riExchange.releaseReference(this);
    }
}