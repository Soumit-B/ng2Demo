import { Component, Input, NgZone, Renderer } from '@angular/core';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { ComponentInteractionService } from '../../../shared/services/component-interaction.service';
import { EllipsisComponent } from './../../../shared/components/ellipsis/ellipsis';
import { Http } from '@angular/http';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalStorageService } from 'ng2-webstorage';
import { TranslateService } from 'ng2-translate';
import { LocaleTranslationService } from '../../../shared/services/translation.service';
import { Store } from '@ngrx/store';
import { MessageService } from '../../../shared/services/message.service';
import { ErrorService } from '../../../shared/services/error.service';
import { HttpService } from '../../../shared/services/http-service';
import { AuthService } from '../../../shared/services/auth.service';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
export var InvoiceHeaderAddressComponent = (function () {
    function InvoiceHeaderAddressComponent(_router, _activatedRoute, zone, _http, errorService, _httpService, _authService, _ls, _componentInteractionService, serviceConstants, messageService, store, renderer, titleService, translate, localeTranslateService, ellipsis) {
        var _this = this;
        this._router = _router;
        this._activatedRoute = _activatedRoute;
        this.zone = zone;
        this._http = _http;
        this.errorService = errorService;
        this._httpService = _httpService;
        this._authService = _authService;
        this._ls = _ls;
        this._componentInteractionService = _componentInteractionService;
        this.serviceConstants = serviceConstants;
        this.messageService = messageService;
        this.store = store;
        this.renderer = renderer;
        this.titleService = titleService;
        this.translate = translate;
        this.localeTranslateService = localeTranslateService;
        this.ellipsis = ellipsis;
        this.storeSubscription = store.select('contract').subscribe(function (data) {
            if (data !== null && data['data'] && !(Object.keys(data['data']).length === 0 && data['data'].constructor === Object)) {
                _this.contractStoreData = data['data'];
            }
        });
    }
    InvoiceHeaderAddressComponent.prototype.ngOnInit = function () {
        this.localeTranslateService.setUpTranslation();
    };
    InvoiceHeaderAddressComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSAInvoiceHeaderAddressDetails.html'
                },] },
    ];
    InvoiceHeaderAddressComponent.ctorParameters = [
        { type: Router, },
        { type: ActivatedRoute, },
        { type: NgZone, },
        { type: Http, },
        { type: ErrorService, },
        { type: HttpService, },
        { type: AuthService, },
        { type: LocalStorageService, },
        { type: ComponentInteractionService, },
        { type: ServiceConstants, },
        { type: MessageService, },
        { type: Store, },
        { type: Renderer, },
        { type: Title, },
        { type: TranslateService, },
        { type: LocaleTranslationService, },
        { type: EllipsisComponent, },
    ];
    InvoiceHeaderAddressComponent.propDecorators = {
        'inputParams': [{ type: Input },],
    };
    return InvoiceHeaderAddressComponent;
}());
