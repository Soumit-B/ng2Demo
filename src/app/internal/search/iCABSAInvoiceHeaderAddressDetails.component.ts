
import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, Input, NgZone, forwardRef, Inject, Renderer } from '@angular/core';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { ComponentInteractionService } from '../../../shared/services/component-interaction.service';
import { EllipsisComponent } from './../../../shared/components/ellipsis/ellipsis';
import { Http, URLSearchParams } from '@angular/http';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalStorageService } from 'ng2-webstorage';
import { TranslateService } from 'ng2-translate';
import { LocaleTranslationService } from '../../../shared/services/translation.service';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { MessageService } from '../../../shared/services/message.service';
import { ErrorService } from '../../../shared/services/error.service';
import { HttpService } from '../../../shared/services/http-service';
import { AuthService } from '../../../shared/services/auth.service';
import { ContractActionTypes } from '../../../app/actions/contract';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';

@Component({

    templateUrl: 'iCABSAInvoiceHeaderAddressDetails.html'
})
export class InvoiceHeaderAddressComponent implements OnInit {

    @Input() inputParams: any;
    public storeSubscription: Subscription;
    public translateSubscription: Subscription;
    private contractStoreData: Object;

    constructor(
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private zone: NgZone,
        private _http: Http,
        private errorService: ErrorService,
        private _httpService: HttpService,
        private _authService: AuthService,
        private _ls: LocalStorageService,
        private _componentInteractionService: ComponentInteractionService,
        private serviceConstants: ServiceConstants,
        private messageService: MessageService,
        private store: Store<any>,
        private renderer: Renderer,
        private titleService: Title,
        private translate: TranslateService,
        private localeTranslateService: LocaleTranslationService,
        private ellipsis: EllipsisComponent
        ) {
        this.storeSubscription = store.select('contract').subscribe(data => {
            if (data !== null && data['data'] && !(Object.keys(data['data']).length === 0 && data['data'].constructor === Object)) {
                this.contractStoreData = data['data'];
            }

        });

    }

    ngOnInit(): void {
        this.localeTranslateService.setUpTranslation();

    }

}
