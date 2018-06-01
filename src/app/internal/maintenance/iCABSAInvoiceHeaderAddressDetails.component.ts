import { Component, NgZone, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { HttpService } from './../../../shared/services/http-service';
import { URLSearchParams } from '@angular/http';
import { AuthService } from '../../../shared/services/auth.service';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { TranslateService } from 'ng2-translate';
import { LocaleTranslationService } from '../../../shared/services/translation.service';
import { ErrorService } from '../../../shared/services/error.service';
import { Utils } from '../../../shared/services/utility';
import { MessageConstant } from '../../../shared/constants/message.constant';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { GlobalConstant } from './../../../shared/constants/global.constant';

@Component({
    selector: 'icabs-invoice-header-address-details',
    templateUrl: 'iCABSAInvoiceHeaderAddressDetails.html',
    providers: [ErrorService]
})

export class InvoiceHeaderAddressDetailsComponent implements OnInit, OnDestroy {
    @ViewChild('errorModal') public errorModal;
    public storeSubscription: Subscription;
    public querySubscription: Subscription;
    public translateSubscription: Subscription;
    public errorSubscription: Subscription;
    public invoiceHeaderAddressFormGroup: FormGroup;
    public parentQueryParams: any;
    public queryInvoice: URLSearchParams = new URLSearchParams();
    public isRequesting: boolean = false;

    public queryParamsInvoiceHeaderAddress: any = {
        action: '0',
        operation: 'Application/iCABSAInvoiceHeaderAddressDetails',
        module: 'contract-admin',
        method: 'contract-management/maintenance',
        contentType: 'application/x-www-form-urlencoded'
    };


    constructor(
        private zone: NgZone,
        private fb: FormBuilder,
        private serviceConstants: ServiceConstants,
        private httpService: HttpService,
        private authService: AuthService,
        private errorService: ErrorService,
        private translate: TranslateService,
        private localeTranslateService: LocaleTranslationService,
        private titleService: Title,
        private router: Router,
        private route: ActivatedRoute,
        private utils: Utils
    ) {
        this.invoiceHeaderAddressFormGroup = this.fb.group({
            InvoiceName: [{ value: '', disabled: true }],
            InvoiceAddressLine1: [{ value: '', disabled: true }],
            InvoiceAddressLine2: [{ value: '', disabled: true }],
            InvoiceAddressLine3: [{ value: '', disabled: true }],
            InvoiceAddressLine4: [{ value: '', disabled: true }],
            InvoiceAddressLine5: [{ value: '', disabled: true }],
            InvoicePostcode: [{ value: '', disabled: true }]

        });
        this.querySubscription = this.route.queryParams.subscribe(params => {
            this.parentQueryParams = params;
            if (this.parentQueryParams && this.parentQueryParams['InvoiceNumber']) {
            this.isRequesting = true;
            this.fetchInvoiceData('', { action: '0', CompanyInvoiceNumber: this.parentQueryParams['InvoiceNumber'], ROWID: this.parentQueryParams['InvoiceHeaderRowID'] || this.parentQueryParams['ROWID'] }).subscribe(
                (e) => {
                      if (e.status === 'failure') {
                        this.errorService.emitError(e.oResponse);
                    } else {
                        if (e['errorMessage']) {
                            this.errorService.emitError(e);
                            return;
                        }
                        this.invoiceHeaderAddressFormGroup.controls['InvoiceName'].setValue(e.InvoiceName);
                        this.invoiceHeaderAddressFormGroup.controls['InvoiceAddressLine1'].setValue(e.InvoiceAddressLine1);
                        this.invoiceHeaderAddressFormGroup.controls['InvoiceAddressLine2'].setValue(e.InvoiceAddressLine2);
                        this.invoiceHeaderAddressFormGroup.controls['InvoiceAddressLine3'].setValue(e.InvoiceAddressLine3);
                        this.invoiceHeaderAddressFormGroup.controls['InvoiceAddressLine4'].setValue(e.InvoiceAddressLine4);
                        this.invoiceHeaderAddressFormGroup.controls['InvoiceAddressLine5'].setValue(e.InvoiceAddressLine5);
                        this.invoiceHeaderAddressFormGroup.controls['InvoicePostcode'].setValue(e.InvoicePostcode);

                    }
                    this.isRequesting = false;
                },
                (error) => {
                    this.errorService.emitError(error);
                }
            );
        }
        });
    }

    ngOnInit(): void {
        this.localeTranslateService.setUpTranslation();
        this.translateSubscription = this.localeTranslateService.ajaxSource$.subscribe(event => {
            if (event !== 0) {
                this.fetchTranslationContent();
            }
        });

        this.errorService.emitError(0);
        this.errorSubscription = this.errorService.getObservableSource().subscribe(data => {
            if (data !== 0) {
                this.zone.run(() => {
                    if (data.errorMessage) {
                        this.errorModal.show(data, true);
                    }
                });
            }
        });

    }

    ngOnDestroy(): void {
        if (this.querySubscription)
            this.querySubscription.unsubscribe();
        if (this.translateSubscription)
            this.translateSubscription.unsubscribe();
    }

    public fetchTranslationContent(): void {
        this.getTranslatedValue('Invoice Header Address Details', null).subscribe((res: string) => {
            this.zone.run(() => {
                if (res) {
                    this.titleService.setTitle(res);
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


    public fetchInvoiceData(functionName: string, params: Object): any {
        this.queryInvoice = new URLSearchParams();
        this.queryInvoice.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.queryInvoice.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());

        if (functionName !== '') {
            this.queryInvoice.set(this.serviceConstants.Action, '6');
            this.queryInvoice.set('Function', functionName);
        }
        for (let key in params) {
            if (key) {
                this.queryInvoice.set(key, params[key]);
            }
        }
        return this.httpService.makeGetRequest(this.queryParamsInvoiceHeaderAddress.method, this.queryParamsInvoiceHeaderAddress.module, this.queryParamsInvoiceHeaderAddress.operation, this.queryInvoice);
    }



    public onSubmit(data: FormGroup, valid: boolean, event: any): void {
        event.preventDefault();

    }



}

