import { GlobalizeService } from './../../../shared/services/globalize.service';
import { Utils } from './../../../shared/services/utility';
import { Component, OnInit, ViewChild, NgZone, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl, FormArray } from '@angular/forms';
import { URLSearchParams } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { HttpService } from './../../../shared/services/http-service';
import { ErrorService } from '../../../shared/services/error.service';
import { MessageService } from '../../../shared/services/message.service';
import { AuthService } from '../../../shared/services/auth.service';
import { AjaxObservableConstant } from '../../../shared/constants/ajax-observable.constant';
import { Subscription } from 'rxjs/Subscription';

import { TranslateService } from 'ng2-translate';
import { LocaleTranslationService } from '../../../shared/services/translation.service';
import { RouteAwayComponent } from '../../../shared/components/route-away/route-away';
import { RouteAwayGlobals } from '../../../shared/services/route-away-global.service';
import { Observable } from 'rxjs/Rx';


@Component({
    templateUrl: 'iCABSAApplyAPIGeneration.html',
    providers: [ErrorService, MessageService]
})

export class ApiGenerationMaintenanceComponent implements OnInit, OnDestroy {
    @ViewChild('errorModal') public errorModal;
    @ViewChild('messageModal') public messageModal;

    public search: URLSearchParams = new URLSearchParams();
    public ajaxSource = new BehaviorSubject<any>(0);
    public ajaxSource$;
    public ajaxSubscription: Subscription;
    public errorSubscription;
    public messageSubscription;
    public applyAPIFormGroup: FormGroup;
    public errorMessage: string;
    public enableSubmitAPI: boolean = false;
    public enableRefreshAPI: boolean = false;
    public isRequesting: boolean = false;

    public queryPost: URLSearchParams = new URLSearchParams();
    public method: string = 'contract-management/maintenance';
    public module: string = 'api';
    public operation: string = 'Application/iCABSAApplyAPIGeneration';
    public contentType: string = 'application/x-www-form-urlencoded';
    public apiApplyFormGroup: FormGroup;

    public showHeader: boolean = true;
    public showErrorHeader: boolean = true;
    public showMessageHeader: boolean = true;

    public inputParams: any = {
        'parentMode': '',
        'businessCode': '',
        'pageTitle': 'Apply API'
    };

    public queryParams: any = {
        'branchNumber': '',
        'businessCode': '',
        'countryCode': '',
        'methodType': 'maintenance',
        'action': '0',
        'pageTitle': 'Apply API',
        'postDesc': 'APIMonth',
        'calculateAPI': 'CalculateAPI'
    };

    private isFormEnabled: boolean = false;

    constructor(
        private httpService: HttpService,
        private fb: FormBuilder,
        private serviceConstants: ServiceConstants,
        private errorService: ErrorService,
        private messageService: MessageService,
        private zone: NgZone,
        private ajaxconstant: AjaxObservableConstant,
        private router: Router,
        private authService: AuthService,
        private titleService: Title,
        private translate: TranslateService,
        private utils: Utils,
        private localeTranslateService: LocaleTranslationService,
        private routeAwayGlobals: RouteAwayGlobals,
        private globalize: GlobalizeService
    ) { }

    public ngOnInit(): void {
        this.ajaxSource$ = this.ajaxSource.asObservable();
        this.localeTranslateService.setUpTranslation();
        this.errorService.emitError(0);
        this.errorSubscription = this.errorService.getObservableSource().subscribe(data => {
            if (data !== 0) {
                this.zone.run(() => {
                    //
                    if (data.errorMessage) {
                        this.errorModal.show(data, true);
                    }
                });
            }
        });

        this.messageService.emitMessage(0);
        this.messageSubscription = this.messageService.getObservableSource().subscribe(data => {
            if (data !== 0) {
                this.zone.run(() => {
                    //
                    this.messageModal.show({ msg: 'Saved Successfully', title: 'Message' }, false);
                });
            }
        });
        this.ajaxSubscription = this.ajaxSource$.subscribe(event => {
            if (event !== 0) {
                this.zone.run(() => {
                    //
                    switch (event) {
                        case this.ajaxconstant.START:
                            this.isRequesting = true;
                            break;
                        case this.ajaxconstant.COMPLETE:
                            this.isRequesting = false;
                            break;
                    }
                });
            }
        });

        this.applyAPIFormGroup = this.fb.group({
            businessDesc: [{ value: '', disabled: true }],
            lessThan: [{ value: '', disabled: true }],
            apiMonth: [{ value: '', disabled: true }],
            apiYear: [{ value: '', disabled: true }],
            existingPortfolio: [{ value: '', disabled: true }],
            newPortfolio: [{ value: '', disabled: true }]
        });

        this.titleService.setTitle(this.inputParams.pageTitle);
        this.inputParams.businessCode = this.utils.getBusinessCode();
        this.queryParams['branchNumber'] = this.utils.getBranchCode();
        this.getBusinessDesc();
    }

    public ngOnDestroy(): void {
        this.errorSubscription.unsubscribe();
        this.messageSubscription.unsubscribe();
        this.ajaxSubscription.unsubscribe();
        //this.routeAwayGlobals.resetRouteAwayFlags();
    }

    public getFormData(): void {
        this.search.set(this.serviceConstants.Action, this.queryParams.action);
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.search.set('PostDesc', this.queryParams.postDesc);

        this.applyAPIFormGroup.controls['existingPortfolio'].setValue('');
        this.applyAPIFormGroup.controls['newPortfolio'].setValue('');

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.method, this.module, this.operation, this.search)
            .subscribe(
            (e) => {
                if (e.errorMessage) {
                    this.errorService.emitError(e);
                } else {
                    this.applyAPIFormGroup.controls['lessThan'].setValue(e.LessThanValue);
                    this.applyAPIFormGroup.controls['apiMonth'].setValue(e.APIMonth);
                    this.applyAPIFormGroup.controls['apiYear'].setValue(e.APIYear);
                    this.enableRefreshAPI = true;
                    if (e.Update === 'No') {
                        this.enableSubmitAPI = false;
                        //this.routeAwayGlobals.setSaveEnabledFlag(false);
                    } else {
                        this.enableSubmitAPI = true;
                        //this.routeAwayGlobals.setSaveEnabledFlag(true);
                    }
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.errorMessage = error as any;
                this.errorService.emitError(error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    public getRefreshData(): void {
        this.search.set(this.serviceConstants.Action, this.queryParams.action);
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.search.set('PostDesc', this.queryParams.calculateAPI);

        let formdata: Object = {};
        formdata['LessThan'] = this.globalize.parseCurrencyToFixedFormat(this.applyAPIFormGroup.controls['lessThan'].value);
        formdata['Update'] = 'No';
        this.queryParams['branchNumber'] = this.utils.getBranchCode();
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.method, this.module, this.operation, this.search, formdata)
            .subscribe(
            (e) => {
                if (e.errorMessage) {
                    this.errorService.emitError(e);
                } else {
                    this.applyAPIFormGroup.controls['existingPortfolio'].setValue(e.ExistingPortfolio.trim());
                    this.applyAPIFormGroup.controls['newPortfolio'].setValue(e.NewPortfolio.trim());
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.errorMessage = error as any;
                this.errorService.emitError(error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });

        this.utils.getBusinessDesc(this.utils.getBusinessCode()).subscribe((data) => {
            this.applyAPIFormGroup.controls['businessDesc'].setValue(data.BusinessDesc);
        });
    }

    public getBusinessDesc(): void {
        this.utils.getBusinessDesc(this.utils.getBusinessCode()).subscribe((data) => {
            this.applyAPIFormGroup.controls['businessDesc'].setValue(data.BusinessDesc);
            this.getFormData();
        });
    }

    public enableForm(): void {
        this.isFormEnabled = true;
        this.enableSubmitAPI = true;
        //this.routeAwayGlobals.setSaveEnabledFlag(true);
    }

    public disableForm(): void {
        this.isFormEnabled = false;
        this.enableSubmitAPI = false;
        //this.routeAwayGlobals.setSaveEnabledFlag(false);
        this.applyAPIFormGroup.reset();
    }

    public onSubmit(data: FormGroup, event: any): void {
        event.preventDefault();

        this.search.set(this.serviceConstants.Action, '1');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.search.set('PostDesc', this.queryParams.calculateAPI);

        let formdata: Object = {};
        formdata['LessThan'] = this.globalize.parseCurrencyToFixedFormat(this.applyAPIFormGroup.controls['lessThan'].value);
        formdata['Update'] = 'Yes';

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.method, this.module, this.operation, this.search, formdata)
            .subscribe(
            (e) => {
                if (e.errorMessage) {
                    this.errorService.emitError(e);
                } else {
                    if (e.errorMessage && e.errorMessage !== '') {
                        setTimeout(() => {
                            this.errorService.emitError(e);
                        }, 200);
                    } else {
                        this.messageService.emitMessage(e);
                        this.enableSubmitAPI = false;
                        this.enableRefreshAPI = false;
                    }
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.errorMessage = error as any;
                this.errorService.emitError(error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    //CR implementation
    /*@ViewChild('routeAwayComponent') public routeAwayComponent;
    public canDeactivate(): Observable<boolean> {
        return this.routeAwayComponent.canDeactivate();
    }*/

}
