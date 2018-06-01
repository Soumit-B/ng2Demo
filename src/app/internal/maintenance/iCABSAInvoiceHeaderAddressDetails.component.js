import { Component, NgZone, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { HttpService } from './../../../shared/services/http-service';
import { URLSearchParams } from '@angular/http';
import { AuthService } from '../../../shared/services/auth.service';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from 'ng2-translate';
import { LocaleTranslationService } from '../../../shared/services/translation.service';
import { ErrorService } from '../../../shared/services/error.service';
import { Utils } from '../../../shared/services/utility';
import { ServiceConstants } from './../../../shared/constants/service.constants';
export var InvoiceHeaderAddressDetailsComponent = (function () {
    function InvoiceHeaderAddressDetailsComponent(zone, fb, serviceConstants, httpService, authService, errorService, translate, localeTranslateService, titleService, router, route, utils) {
        var _this = this;
        this.zone = zone;
        this.fb = fb;
        this.serviceConstants = serviceConstants;
        this.httpService = httpService;
        this.authService = authService;
        this.errorService = errorService;
        this.translate = translate;
        this.localeTranslateService = localeTranslateService;
        this.titleService = titleService;
        this.router = router;
        this.route = route;
        this.utils = utils;
        this.queryInvoice = new URLSearchParams();
        this.queryParamsInvoiceHeaderAddress = {
            action: '0',
            operation: 'Application/iCABSAInvoiceHeaderAddressDetails',
            module: 'contract-admin',
            method: 'contract-management/maintenance',
            contentType: 'application/x-www-form-urlencoded'
        };
        this.invoiceHeaderAddressFormGroup = this.fb.group({
            InvoiceName: [{ value: '', disabled: true }],
            InvoiceAddressLine1: [{ value: '', disabled: true }],
            InvoiceAddressLine2: [{ value: '', disabled: true }],
            InvoiceAddressLine3: [{ value: '', disabled: true }],
            InvoiceAddressLine4: [{ value: '', disabled: true }],
            InvoiceAddressLine5: [{ value: '', disabled: true }],
            InvoicePostcode: [{ value: '', disabled: true }]
        });
        this.querySubscription = this.route.queryParams.subscribe(function (params) {
            _this.parentQueryParams = params;
        });
    }
    InvoiceHeaderAddressDetailsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.localeTranslateService.setUpTranslation();
        this.translateSubscription = this.localeTranslateService.ajaxSource$.subscribe(function (event) {
            if (event !== 0) {
                _this.fetchTranslationContent();
            }
        });
        this.errorService.emitError(0);
        this.errorSubscription = this.errorService.getObservableSource().subscribe(function (data) {
            if (data !== 0) {
                _this.zone.run(function () {
                    if (data.errorMessage) {
                        _this.errorModal.show(data, true);
                    }
                });
            }
        });
        if (this.parentQueryParams && this.parentQueryParams['InvoiceNumber']) {
            this.fetchInvoiceData('', { action: '0', CompanyInvoiceNumber: this.parentQueryParams['InvoiceNumber'], ROWID: this.parentQueryParams['InvoiceHeaderRowID'] }).subscribe(function (e) {
                if (e.status === 'failure') {
                    _this.errorService.emitError(e.oResponse);
                }
                else {
                    if (e['errorMessage']) {
                        _this.errorService.emitError(e);
                        return;
                    }
                    _this.invoiceHeaderAddressFormGroup.controls['InvoiceName'].setValue(e.InvoiceName);
                    _this.invoiceHeaderAddressFormGroup.controls['InvoiceAddressLine1'].setValue(e.InvoiceAddressLine1);
                    _this.invoiceHeaderAddressFormGroup.controls['InvoiceAddressLine2'].setValue(e.InvoiceAddressLine2);
                    _this.invoiceHeaderAddressFormGroup.controls['InvoiceAddressLine3'].setValue(e.InvoiceAddressLine3);
                    _this.invoiceHeaderAddressFormGroup.controls['InvoiceAddressLine4'].setValue(e.InvoiceAddressLine4);
                    _this.invoiceHeaderAddressFormGroup.controls['InvoiceAddressLine5'].setValue(e.InvoiceAddressLine5);
                    _this.invoiceHeaderAddressFormGroup.controls['InvoicePostcode'].setValue(e.InvoicePostcode);
                }
            }, function (error) {
                _this.errorService.emitError(error);
            });
        }
    };
    InvoiceHeaderAddressDetailsComponent.prototype.ngOnDestroy = function () {
        if (this.querySubscription)
            this.querySubscription.unsubscribe();
        if (this.translateSubscription)
            this.translateSubscription.unsubscribe();
    };
    InvoiceHeaderAddressDetailsComponent.prototype.fetchTranslationContent = function () {
        var _this = this;
        this.getTranslatedValue('Invoice Header Address Details', null).subscribe(function (res) {
            _this.zone.run(function () {
                if (res) {
                    _this.titleService.setTitle(res);
                }
            });
        });
    };
    InvoiceHeaderAddressDetailsComponent.prototype.getTranslatedValue = function (key, params) {
        if (params) {
            return this.translate.get(key, { value: params });
        }
        else {
            return this.translate.get(key);
        }
    };
    InvoiceHeaderAddressDetailsComponent.prototype.fetchInvoiceData = function (functionName, params) {
        this.queryInvoice = new URLSearchParams();
        this.queryInvoice.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.queryInvoice.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        if (functionName !== '') {
            this.queryInvoice.set(this.serviceConstants.Action, '6');
            this.queryInvoice.set('Function', functionName);
        }
        for (var key in params) {
            if (key) {
                this.queryInvoice.set(key, params[key]);
            }
        }
        return this.httpService.makeGetRequest(this.queryParamsInvoiceHeaderAddress.method, this.queryParamsInvoiceHeaderAddress.module, this.queryParamsInvoiceHeaderAddress.operation, this.queryInvoice);
    };
    InvoiceHeaderAddressDetailsComponent.prototype.onSubmit = function (data, valid, event) {
        event.preventDefault();
    };
    InvoiceHeaderAddressDetailsComponent.decorators = [
        { type: Component, args: [{
                    selector: 'icabs-invoice-header-address-details',
                    templateUrl: 'iCABSAInvoiceHeaderAddressDetails.html',
                    providers: [ErrorService]
                },] },
    ];
    InvoiceHeaderAddressDetailsComponent.ctorParameters = [
        { type: NgZone, },
        { type: FormBuilder, },
        { type: ServiceConstants, },
        { type: HttpService, },
        { type: AuthService, },
        { type: ErrorService, },
        { type: TranslateService, },
        { type: LocaleTranslationService, },
        { type: Title, },
        { type: Router, },
        { type: ActivatedRoute, },
        { type: Utils, },
    ];
    InvoiceHeaderAddressDetailsComponent.propDecorators = {
        'errorModal': [{ type: ViewChild, args: ['errorModal',] },],
    };
    return InvoiceHeaderAddressDetailsComponent;
}());
