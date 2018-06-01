import { Observable } from 'rxjs/Observable';
import { URLSearchParams } from '@angular/http';
import { Subscription } from 'rxjs/Subscription';
import { Component, OnInit, OnDestroy, ViewChild, NgZone } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Store } from '@ngrx/store';
import { Http } from '@angular/http';
import { ErrorConstant } from '../../../shared/constants/error.constant';
import { TranslateService } from 'ng2-translate';
import { LocalStorageService } from 'ng2-webstorage';
import { LocaleTranslationService } from '../../../shared/services/translation.service';
import { ComponentInteractionService } from '../../../shared/services/component-interaction.service';
import { AccountSearchComponent } from '../../internal/search/iCABSASAccountSearch';
import { HttpService } from './../../../shared/services/http-service';
import { ErrorService } from '../../../shared/services/error.service';
import { PageDataService } from '../../../shared/services/page-data.service';
import { AuthService } from '../../../shared/services/auth.service';
import { MessageService } from '../../../shared/services/message.service';
import { CBBService } from '../../../shared/services/cbb.service';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { AjaxObservableConstant } from '../../../shared/constants/ajax-observable.constant';
import { ActionTypes } from '../../actions/account';
import { Utils } from '../../../shared/services/utility';
import { RouteAwayComponent } from '../../../shared/components/route-away/route-away';
import { RouteAwayGlobals } from '../../../shared/services/route-away-global.service';
import { ContractManagementModuleRoutes } from '../../base/PageRoutes';

@Component({
    selector: 'icabs-account-assign',
    templateUrl: 'iCABSAAccountAssign.html',
    providers: [ErrorService, MessageService, ComponentInteractionService]
})

export class AccountAssignComponent implements OnInit, OnDestroy {
    @ViewChild('fromAccountNumber') fromAccountInput;
    @ViewChild('toAccountNumber') toAccountInput;
    @ViewChild('errorModal') public errorModal;
    @ViewChild('messageModal') public messageModal;
    @ViewChild('promptModal') public promptModal;

    public ajaxSource = new BehaviorSubject<any>(0);
    public ajaxSource$;
    public ajaxSubscription: Subscription;
    public routerSubscription: Subscription;
    public componentInteractionSubscription: Subscription;
    public translateSubscription: Subscription;
    public errorSubscription;
    public messageSubscription;
    public accountFormGroup: FormGroup;

    public errorMessage: string;
    public isRequesting: boolean = false;
    public hideEllipsis: boolean = false;
    public autoOpen: boolean = false;
    public modalConfig: any = {
        backdrop: 'static',
        keyboard: true
    };

    public method: string = 'contract-management/maintenance';
    public module: string = 'account';
    public operation: string = 'Application/iCABSAAccountAssign';
    public functionName: string = 'Assign';
    public function: string = 'GetMergeFromAddress';
    public contentType: string = 'application/x-www-form-urlencoded';
    public addNew: boolean = false;

    public search: URLSearchParams = new URLSearchParams();
    public queryLookUp: URLSearchParams = new URLSearchParams();
    public searchModalRoute: string = '/contractmanagement/account/assign/search';
    public searchPageRoute: string = '/contractmanagement/account/assign';
    public showHeader: boolean = true;
    public showCloseButton: boolean = true;
    public showErrorHeader: boolean = true;
    public showMessageHeader: boolean = true;
    public inputParams: any = {
        'parentMode': 'LookUp-MergeFrom',
        'methodType': 'maintenance',
        'action': '1',
        'pageTitle': 'Account Assign',
        'showAddNewDisplay': false
    };

    public buttonTranslatedText: any = {
        'save': 'Save',
        'cancel': 'Cancel'
    };

    public formData: any;
    public promptTitle: string = 'Confirm Record?';
    public promptContent: string = '';
    public lookupComponent: Component;
    private isFormEnabled: boolean = false;
    private localeData: any;


    constructor(
        private httpService: HttpService,
        private fb: FormBuilder,
        private serviceConstants: ServiceConstants,
        private errorService: ErrorService,
        private messageService: MessageService,
        private authService: AuthService,
        private ajaxconstant: AjaxObservableConstant,
        private router: Router,
        private pageData: PageDataService,
        private titleService: Title,
        private zone: NgZone,
        private translate: TranslateService,
        private ls: LocalStorageService,
        private http: Http,
        private localeTranslateService: LocaleTranslationService,
        private componentInteractionService: ComponentInteractionService,
        private utils: Utils,
        private routeAwayGlobals: RouteAwayGlobals,
        private cbb: CBBService
    ) { }

    public ngOnInit(): void {
        this.ajaxSource$ = this.ajaxSource.asObservable();
        this.errorService.emitError(0);
        this.errorSubscription = this.errorService.getObservableSource().subscribe(data => {
            if (data !== 0) {
                this.zone.run(() => {
                    if (data['errorMessage']) {
                        this.errorModal.show(data, true);
                    }
                });
            }
        });

        this.messageService.emitMessage(0);
        this.messageSubscription = this.messageService.getObservableSource().subscribe(data => {
            if (data !== 0) {
                this.zone.run(() => {
                    //this.messageModal.show({ msg: 'Saved Successfully', title: 'Message' }, false);
                });
            }
        });

        this.ajaxSubscription = this.ajaxSource$.subscribe(event => {
            if (event !== 0) {
                this.zone.run(() => {
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

        this.lookupComponent = AccountSearchComponent;
        this.localeTranslateService.setUpTranslation();

        this.translateSubscription = this.localeTranslateService.ajaxSource$.subscribe(event => {
            if (event !== 0) {
                this.fetchTranslationContent();
            }
        });

        this.routerSubscription = this.router.events.subscribe(event => {
            if (event.url.indexOf('/account/assign/search') !== -1) {
                this.searchModalRoute = '';
                this.autoOpen = true;
            }
        });


        this.accountFormGroup = this.fb.group({
            fromAccountNumber: [{ value: '', disabled: false }, Validators.required],
            accountName: [{ value: '', disabled: true }],
            address1: [{ value: '', disabled: true }],
            address2: [{ value: '', disabled: true }],
            address3: [{ value: '', disabled: true }],
            address4: [{ value: '', disabled: true }],
            address5: [{ value: '', disabled: true }],
            postcode: [{ value: '', disabled: true }],
            toAccountNumber: [{ value: '', disabled: false }, Validators.required]
        });
        this.routeAwayUpdateSaveFlag(); //CR implementation
        this.routeAwayGlobals.setEllipseOpenFlag(false); //CR implementation

    }

    ngOnDestroy(): void {
        this.errorSubscription.unsubscribe();
        this.messageSubscription.unsubscribe();
        this.ajaxSubscription.unsubscribe();
        this.routerSubscription.unsubscribe();
        this.translateSubscription.unsubscribe();
        this.routeAwayGlobals.resetRouteAwayFlags(); //CR implementation
    }

    public fetchTranslationContent(): void {
        this.getTranslatedValue('Assign Account', null).subscribe((res: string) => {
            this.zone.run(() => {
                if (res) {
                    this.titleService.setTitle(res);
                } else {
                    this.titleService.setTitle(this.inputParams.pageTitle);
                }
            });

        });
    }

    public onSubmit(data: FormGroup, valid: boolean, event: any): void {
        event.preventDefault();
        this.formData = data;
        this.promptModal.show();
    }

    public onDataReceived(data: any, route: any): void {
        this.accountFormGroup.controls['fromAccountNumber'].setValue(data.AccountNumber);
        this.accountFormGroup.controls['accountName'].setValue(data.AccountName);
        this.accountFormGroup.controls['address1'].setValue(data.AccountAddressLine1);
        this.accountFormGroup.controls['address2'].setValue(data.AccountAddressLine2);
        this.accountFormGroup.controls['address3'].setValue(data.AccountAddressLine3);
        this.accountFormGroup.controls['address4'].setValue(data.AccountAddressLine4);
        this.accountFormGroup.controls['address5'].setValue(data.AccountAddressLine5);
        this.accountFormGroup.controls['postcode'].setValue(data.AccountPostcode);
        this.accountFormGroup.controls['fromAccountNumber'].enable();
        this.accountFormGroup.controls['toAccountNumber'].enable();
        this.inputParams.businessCode = data.BusinessCode;
        this.inputParams.countryCode = data.CountryCode;
        this.cbb.disableComponent(true);
        if (route === true) {
            this.preRoute(data);
        }
    }

    public preRoute(data: any): void {
        this.routeAwayGlobals.setEllipseOpenFlag(true);
        this.pageData.saveData(data);
        this.router.navigate([ContractManagementModuleRoutes.ICABSAACCOUNTASSIGN]);
    }

    public onBlur(event: any): void {
        let elementValue = event.target.value;
        if (elementValue.length > 0 && elementValue.length < 9) {
            let _paddedValue = this.numberPadding(elementValue, 9);
            if (event.target.id === 'fromAccountNumber') {
                this.accountFormGroup.controls['fromAccountNumber'].setValue(_paddedValue);
            }
            else if (event.target.id === 'toAccountNumber') {
                this.accountFormGroup.controls['toAccountNumber'].setValue(_paddedValue);
            }
        }
    };

    public onFromAccountBlur(event: any): void {
        if (this.accountFormGroup.controls['fromAccountNumber'] && this.accountFormGroup.controls['fromAccountNumber'].value !== '') {
            let data = [{
                'table': 'Account',
                'query': { 'AccountNumber': this.accountFormGroup.controls['fromAccountNumber'].value },
                'fields': ['AccountNumber', 'AccountName', 'AccountAddressLine1', 'AccountAddressLine2',
                    'AccountAddressLine3', 'AccountAddressLine4', 'AccountAddressLine5', 'AccountPostcode']
            }];
            this.ajaxSource.next(this.ajaxconstant.START);
            this.lookUpRecord(JSON.parse(JSON.stringify(data)), 100).subscribe(
                (e) => {
                    if (e['results'] && e['results'].length > 0 && e['results'][0].length > 0) {
                        this.accountFormGroup.controls['accountName'].setValue(e['results'][0][0].AccountName);
                        this.accountFormGroup.controls['address1'].setValue(e['results'][0][0].AccountAddressLine1);
                        this.accountFormGroup.controls['address2'].setValue(e['results'][0][0].AccountAddressLine2);
                        this.accountFormGroup.controls['address3'].setValue(e['results'][0][0].AccountAddressLine3);
                        this.accountFormGroup.controls['address4'].setValue(e['results'][0][0].AccountAddressLine4);
                        this.accountFormGroup.controls['address5'].setValue(e['results'][0][0].AccountAddressLine5);
                        this.accountFormGroup.controls['postcode'].setValue(e['results'][0][0].AccountPostcode);
                        this.inputParams.businessCode = e['results'][0][0].BusinessCode;
                        this.inputParams.countryCode = e['results'][0][0].CountryCode;
                        this.cbb.disableComponent(true);
                    } else {
                        this.accountFormGroup.controls['accountName'].setValue('');
                        this.accountFormGroup.controls['address1'].setValue('');
                        this.accountFormGroup.controls['address2'].setValue('');
                        this.accountFormGroup.controls['address3'].setValue('');
                        this.accountFormGroup.controls['address4'].setValue('');
                        this.accountFormGroup.controls['address5'].setValue('');
                        this.accountFormGroup.controls['postcode'].setValue('');
                        e['errorMessage'] = ErrorConstant.Message.RecordNotFound;
                        this.errorService.emitError(e);
                    }
                    this.autoOpen = false;
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                },
                (error) => {
                    this.accountFormGroup.controls['accountName'].setValue('');
                    error['errorMessage'] = error['errorMessage'] || ErrorConstant.Message.ErrorFetchingRecord;
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                }
            );
        }
    };

    public lookUpRecord(data: any, maxresults: any): Observable<any> {
        this.queryLookUp.set(this.serviceConstants.Action, '0');
        this.queryLookUp.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.queryLookUp.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        if (maxresults) {
            this.queryLookUp.set(this.serviceConstants.MaxResults, maxresults.toString());
        }
        return this.httpService.lookUpRequest(this.queryLookUp, data);
    }

    public enableForm(): void {
        this.isFormEnabled = true;
        this.accountFormGroup.controls['fromAccountNumber'].enable();
        this.accountFormGroup.controls['toAccountNumber'].enable();
        this.fromAccountInput.nativeElement.focus();
    }

    public disableForm(): void {
        this.isFormEnabled = false;
        this.accountFormGroup.reset();
        this.hideEllipsis = false;
        this.cbb.disableComponent(false);
    }

    public promptSave(event: any): void {
        this.routeAwayGlobals.setSaveEnabledFlag(false);  //CR implementation
        let formdata: Object = this.formData,
            fromAccountNumber = formdata['fromAccountNumber'],
            toAccountNumber = formdata['toAccountNumber'],
            userCode = this.authService.getSavedUserCode();

        this.search.set(this.serviceConstants.Action, this.inputParams.action);
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());

        this.search.set('functionName', this.functionName);
        this.search.set('function', this.function);

        this.inputParams.search = this.search;


        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.method, this.module, this.operation, this.search, formdata)
            .subscribe(
            (e) => {
                if (e['status'] === 'failure') {
                    this.errorService.emitError(e['oResponse']);
                } else {
                    if ((typeof e['oResponse'] !== 'undefined' && e.oResponse['errorMessage'])) {
                        this.errorService.emitError(e['oResponse']);
                    } else if (e['errorMessage']) {
                        this.errorService.emitError(e);
                    } else {
                        this.messageService.emitMessage(e);
                        this.disableForm();
                    }
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.errorService.emitError(error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            }
            );
    }

    public numberPadding(num: any, size: any): string {
        let s = num + '';
        while (s.length < size) s = '0' + s;
        return s;
    }

    public getTranslatedValue(key: any, params: any): any {
        if (params) {
            return this.translate.get(key, { value: params });
        } else {
            return this.translate.get(key);
        }

    }

    /*
    *   Alerts user when user is moving away without saving the changes. //CR implementation
    */
    @ViewChild('routeAwayComponent') public routeAwayComponent;
    public canDeactivate(): Observable<boolean> {
        return this.routeAwayComponent.canDeactivate();
    }
    public routeAwayUpdateSaveFlag(): void {
        this.accountFormGroup.statusChanges.subscribe((value: any) => {
            if (this.accountFormGroup.valid === true) {
                this.routeAwayGlobals.setEllipseOpenFlag(false);
                this.routeAwayGlobals.setSaveEnabledFlag(true);
            } else {
                this.routeAwayGlobals.setSaveEnabledFlag(false);
            }
        });
    }
}
