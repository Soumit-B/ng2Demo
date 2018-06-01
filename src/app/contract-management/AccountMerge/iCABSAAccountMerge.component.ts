import { URLSearchParams } from '@angular/http';
import { Subscription } from 'rxjs/Subscription';
import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, NgZone } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { LocalStorageService } from 'ng2-webstorage';
import { TranslateService } from 'ng2-translate';
import { Store } from '@ngrx/store';
import { Http } from '@angular/http';
import { AccountSearchComponent } from '../../internal/search/iCABSASAccountSearch';
import { LocaleTranslationService } from '../../../shared/services/translation.service';
import { ComponentInteractionService } from '../../../shared/services/component-interaction.service';
import { HttpService } from './../../../shared/services/http-service';
import { AuthService } from '../../../shared/services/auth.service';
import { ErrorService } from '../../../shared/services/error.service';
import { MessageService } from '../../../shared/services/message.service';
import { PageDataService } from '../../../shared/services/page-data.service';
import { CBBService } from '../../../shared/services/cbb.service';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { AjaxObservableConstant } from '../../../shared/constants/ajax-observable.constant';
import { ActionTypes } from '../../actions/account';
import { GlobalConstant } from '../../../shared/constants/global.constant';
import { ErrorConstant } from '../../../shared/constants/error.constant';
import { MessageConstant } from '../../../shared/constants/message.constant';
import { Utils } from '../../../shared/services/utility';
import { Observable } from 'rxjs/Rx';
import { RouteAwayGlobals } from '../../../shared/services/route-away-global.service';
import { ContractManagementModuleRoutes } from '../../base/PageRoutes';

@Component({
    selector: 'icabs-account-merge',
    templateUrl: 'iCABSAAccountMerge.html',
    providers: [ErrorService, MessageService, ComponentInteractionService]
})

export class AccountMergeComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('fromAccountNumber') fromAccountNumber;
    @ViewChild('toAccountNumber') toAccountInput;
    @ViewChild('errorModal') public errorModal;
    @ViewChild('messageModal') public messageModal;
    @ViewChild('promptModal') public promptModal;

    public ajaxSource = new BehaviorSubject<any>(0);
    public ajaxSource$;
    public ajaxSubscription: Subscription;
    public routerSubscription: Subscription;
    public storeSubscription: Subscription;
    public componentInteractionSubscription: Subscription;
    public translateSubscription: Subscription;
    public errorSubscription;
    public messageSubscription;

    public errorMessage: any;
    public isRequesting: boolean = false;
    public showCloseButton: boolean = true;

    public functionName: string = 'Merge';
    public function: string = 'GetMergeToAddress';

    public hideEllipsis: boolean = false;
    public autoOpenFrom: boolean = false;
    public autoOpenTo: boolean = false;
    public modalConfig: any = {
        backdrop: 'static',
        keyboard: true
    };

    public method: string = 'contract-management/maintenance';
    public module: string = 'account';
    public operation: string = 'Application/iCABSAAccountMerge';
    public contentType: string = 'application/x-www-form-urlencoded';

    public promptTitle: string = 'Confirm Record?';
    public promptContent: string = '';

    public search: URLSearchParams = new URLSearchParams();
    public queryLookUp: URLSearchParams = new URLSearchParams();
    public searchModalRoute: string = '';
    public searchPageRoute: string = '';
    public showHeader: boolean = true;
    public showErrorHeader: boolean = true;
    public showMessageHeader: boolean = true;
    public inputParams: any = {
        'parentMode': 'LookUp-MergeFrom',
        'businessCode': '',
        'countryCode': '',
        'methodType': 'maintenance',
        'action': '1',
        'pageTitle': 'Merge Account',
        'showAddNew': false,
        'showAddNewDisplay': false
    };

    public form_group: FormGroup;
    _submitted: Boolean;
    _isFormEnabled: Boolean;
    public formData: any;
    public storeData: any;
    public fromComponent: any = AccountSearchComponent;
    public toComponent: any = AccountSearchComponent;
    public fromIdentifier: string = 'from';
    public toIdentifier: string = 'to';
    public localeData: any;

    public buttonTranslatedText: any = {
        'save': 'Save',
        'cancel': 'Cancel'
    };

    constructor(private httpService: HttpService,
        private _fb: FormBuilder,
        private serviceConstants: ServiceConstants,
        private errorService: ErrorService,
        private messageService: MessageService,
        private authService: AuthService,
        private ajaxconstant: AjaxObservableConstant,
        private router: Router,
        private pageData: PageDataService,
        private titleService: Title,
        private zone: NgZone,
        private store: Store<any>,
        private translate: TranslateService,
        private ls: LocalStorageService,
        private http: Http,
        private localeTranslateService: LocaleTranslationService,
        private componentInteractionService: ComponentInteractionService,
        private utils: Utils,
        private routeAwayGlobals: RouteAwayGlobals,
        private cbb: CBBService
        ) {
        this.storeSubscription = store.select('account').subscribe(data => {
            this.storeData = data;
        });
    }

    public ngOnInit(): void {
        this.ajaxSource$ = this.ajaxSource.asObservable();
        this.routeAwayGlobals.setEllipseOpenFlag(false); // CR implementation
        this._isFormEnabled = false;
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
                    this.messageModal.show({ msg: MessageConstant.Message.RecordSavedSuccessfully, title: 'Message' }, false);
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


        let pageTitle: string = '';
        this.localeTranslateService.setUpTranslation();
        this.translateSubscription = this.localeTranslateService.ajaxSource$.subscribe(event => {
            if (event !== 0) {
                this.fetchTranslationContent();
            }
        });

        this.routerSubscription = this.router.events.subscribe(event => {
            if (event.url.indexOf('/contractmanagement/account/merge/search') !== -1) {
                this.searchModalRoute = '';
                if (this.storeData && this.storeData.from) {
                    this.onDataReceived(this.storeData.from, false);
                }
                if (this.storeData && this.storeData.to) {
                    this.onDataReceivedTo(this.storeData.to, false);
                }
                let identifier = this.pageData.getEllipsisIdentifier();
                if (identifier) {
                    if (identifier === 'from') {
                        this.autoOpenFrom = true;
                        this.autoOpenTo = false;
                    } else if (identifier === 'to') {
                        this.autoOpenFrom = false;
                        this.autoOpenTo = true;
                    }
                } else {
                    this.autoOpenFrom = true;
                    this.autoOpenTo = false;
                }
                setTimeout(() => {
                    this.autoOpenFrom = false;
                    this.autoOpenTo = false;
                }, 100);
            }
        });

        this.form_group = this._fb.group({
            fromAccountNumber: [{ value: '', disabled: false }, Validators.required],
            toAccountNumber: [{ value: '', disabled: false }, Validators.required],
            FromAccountName: [{ value: '', disabled: true }],
            FromAccountAddressLine1: [{ value: '', disabled: true }],
            FromAccountAddressLine2: [{ value: '', disabled: true }],
            FromAccountAddressLine3: [{ value: '', disabled: true }],
            FromAccountAddressLine4: [{ value: '', disabled: true }],
            FromAccountAddressLine5: [{ value: '', disabled: true }],
            FromPostcode: [{ value: '', disabled: true }],
            ToAccountName: [{ value: '', disabled: true }],
            ToAccountAddressLine1: [{ value: '', disabled: true }],
            ToAccountAddressLine2: [{ value: '', disabled: true }],
            ToAccountAddressLine3: [{ value: '', disabled: true }],
            ToAccountAddressLine4: [{ value: '', disabled: true }],
            ToAccountAddressLine5: [{ value: '', disabled: true }],
            ToPostcode: [{ value: '', disabled: true }]
        });
        this.routeAwayUpdateSaveFlag(); // CR implementation
    }

    ngAfterViewInit(): void {
        this.autoOpenFrom = true;
    }

    ngOnDestroy(): void {
        this.errorSubscription.unsubscribe();
        this.messageSubscription.unsubscribe();
        this.ajaxSubscription.unsubscribe();
        this.routerSubscription.unsubscribe();
        this.storeSubscription.unsubscribe();
        this.translateSubscription.unsubscribe();
        this.store.dispatch({ type: ActionTypes.CLEAR_ACCOUNT_DATA });
        this.routeAwayGlobals.resetRouteAwayFlags(); // CR implementation
    }

    public fetchTranslationContent(): void {
        this.getTranslatedValue('Merge Account', null).subscribe((res: string) => {
            if (res) {
                this.titleService.setTitle(res);
            } else {
                this.titleService.setTitle(this.inputParams.pageTitle);
            }
        });
    }
    public onSubmit(data: FormGroup, valid: boolean, event: any): void {
        this.routeAwayGlobals.setSaveEnabledFlag(false); // CR implementation
        event.preventDefault();
        this.formData = data;
        this.promptModal.show();
    }

    public promptSave(): void {
        let formdata: Object = this.formData,
            fromAccountNumber = formdata['fromAccountNumber'],
            toAccountNumber = formdata['toAccountNumber'];

        let userCode = this.authService.getSavedUserCode();
        if (this.storeData && this.storeData.from.CountryCode) {
            this.inputParams.countryCode = this.storeData.from.CountryCode;
        } else {
            this.inputParams.countryCode = this.utils.getCountryCode();

        }
        if (this.storeData && this.storeData.from.BusinessCode) {
            this.inputParams.businessCode = this.storeData.from.BusinessCode;
        } else {
            this.inputParams.businessCode = this.utils.getBusinessCode();

        }
        this.search.set(this.serviceConstants.BusinessCode, this.inputParams.businessCode);
        this.search.set(this.serviceConstants.CountryCode, this.inputParams.countryCode);
        this.search.set(this.serviceConstants.Action, this.inputParams.action);
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
                        this.store.dispatch({ type: ActionTypes.CLEAR_DATA_FROM });
                        this.store.dispatch({ type: ActionTypes.CLEAR_DATA_TO });
                        this.store.dispatch({ type: ActionTypes.CLEAR_ACCOUNT_DATA });
                    }
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.errorMessage = { errorMessage: error };
                this.errorService.emitError(error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            }
            );

    }

    public enableForm(): void {
        this._isFormEnabled = true;
        this.form_group.controls['fromAccountNumber'].enable();
        this.form_group.controls['toAccountNumber'].enable();
        this.fromAccountNumber.nativeElement.focus();
    }

    public disableForm(): void {
        this.routeAwayGlobals.resetRouteAwayFlags(); // CR implementation
        this.resetFields();
        this._isFormEnabled = false;
        //this.pageData.clearData();
        //this.pageData.clearSecondaryData();
        this.store.dispatch({ type: ActionTypes.CLEAR_DATA_FROM });
        this.store.dispatch({ type: ActionTypes.CLEAR_DATA_TO });
        this.cbb.disableComponent(false);
        /*this.autoOpenFrom = true;
        setTimeout(() => {
            this.autoOpenFrom = false;
        }, 100);*/
    }

    public resetFields(): void {
        this.form_group.reset();
    }
    public numberPadding(num: any, size: any): string {
        let s = num + '';
        while (s.length < size) s = '0' + s;
        return s;
    }

    public preRoute(data: any, toData: any): void {
        this.routeAwayGlobals.setEllipseOpenFlag(true);
        if (toData) {
            this.store.dispatch({ type: ActionTypes.SAVE_DATA_TO, payload: data });
        } else {
            this.store.dispatch({ type: ActionTypes.SAVE_DATA_FROM, payload: data });
        }
        /*setTimeout(() => {
            this.router.navigate(['/contractmanagement/account/merge']);
        }, 200);*/

    }

    public onFromAccountBlur(event: any): void {
        if (this.form_group.controls['fromAccountNumber'] && this.form_group.controls['fromAccountNumber'].value !== '') {
            let data = [{
                'table': 'Account',
                'query': { 'AccountNumber': this.form_group.controls['fromAccountNumber'].value },
                'fields': ['AccountNumber', 'AccountName', 'AccountAddressLine1', 'AccountAddressLine2', 'AccountAddressLine3', 'AccountAddressLine4', 'AccountAddressLine5', 'AccountPostcode']
            }];
            this.lookUpRecord(JSON.parse(JSON.stringify(data)), 100).subscribe(
                (e) => {
                    if (e['results'] && e['results'].length > 0 && e['results'][0].length > 0) {
                        this.form_group.controls['FromAccountName'].setValue(e['results'][0][0].AccountName);
                        this.form_group.controls['FromAccountAddressLine1'].setValue(e['results'][0][0].AccountAddressLine1);
                        this.form_group.controls['FromAccountAddressLine2'].setValue(e['results'][0][0].AccountAddressLine2);
                        this.form_group.controls['FromAccountAddressLine3'].setValue(e['results'][0][0].AccountAddressLine3);
                        this.form_group.controls['FromAccountAddressLine4'].setValue(e['results'][0][0].AccountAddressLine4);
                        this.form_group.controls['FromAccountAddressLine5'].setValue(e['results'][0][0].AccountAddressLine5);
                        this.form_group.controls['FromPostcode'].setValue(e['results'][0][0].AccountPostcode);
                        this.cbb.disableComponent(true);
                    } else {
                        this.form_group.controls['FromAccountName'].setValue('');
                        this.form_group.controls['FromAccountAddressLine1'].setValue('');
                        this.form_group.controls['FromAccountAddressLine2'].setValue('');
                        this.form_group.controls['FromAccountAddressLine3'].setValue('');
                        this.form_group.controls['FromAccountAddressLine4'].setValue('');
                        this.form_group.controls['FromAccountAddressLine5'].setValue('');
                        this.form_group.controls['FromPostcode'].setValue('');
                        e['errorMessage'] = ErrorConstant.Message.RecordNotFound;
                        this.errorService.emitError(e);
                    }
                    this.autoOpenFrom = false;
                },
                (error) => {
                    this.form_group.controls['FromAccountName'].setValue('');
                    error['errorMessage'] = error['errorMessage'] || ErrorConstant.Message.ErrorFetchingRecord;
                    //this.errorService.emitError(error);
                }
            );
        } else {
            //this.form_group.controls['accountName'].setValue('');
        }
    };

    public onToAccountBlur(event: any): void {
        if (this.form_group.controls['toAccountNumber'] && this.form_group.controls['toAccountNumber'].value !== '') {
            let data = [{
                'table': 'Account',
                'query': { 'AccountNumber': this.form_group.controls['toAccountNumber'].value },
                'fields': ['AccountNumber', 'AccountName', 'AccountAddressLine1', 'AccountAddressLine2', 'AccountAddressLine3', 'AccountAddressLine4', 'AccountAddressLine5', 'AccountPostcode']
            }];
            this.lookUpRecord(JSON.parse(JSON.stringify(data)), 100).subscribe(
                (e) => {
                    if (e['results'] && e['results'].length > 0 && e['results'][0].length > 0) {
                        this.form_group.controls['ToAccountName'].setValue(e['results'][0][0].AccountName);
                        this.form_group.controls['ToAccountAddressLine1'].setValue(e['results'][0][0].AccountAddressLine1);
                        this.form_group.controls['ToAccountAddressLine2'].setValue(e['results'][0][0].AccountAddressLine2);
                        this.form_group.controls['ToAccountAddressLine3'].setValue(e['results'][0][0].AccountAddressLine3);
                        this.form_group.controls['ToAccountAddressLine4'].setValue(e['results'][0][0].AccountAddressLine4);
                        this.form_group.controls['ToAccountAddressLine5'].setValue(e['results'][0][0].AccountAddressLine5);
                        this.form_group.controls['ToPostcode'].setValue(e['results'][0][0].AccountPostcode);
                        this.cbb.disableComponent(true);
                    } else {
                        this.form_group.controls['ToAccountName'].setValue('');
                        this.form_group.controls['ToAccountAddressLine1'].setValue('');
                        this.form_group.controls['ToAccountAddressLine2'].setValue('');
                        this.form_group.controls['ToAccountAddressLine3'].setValue('');
                        this.form_group.controls['ToAccountAddressLine4'].setValue('');
                        this.form_group.controls['ToAccountAddressLine5'].setValue('');
                        this.form_group.controls['ToPostcode'].setValue('');
                        e['errorMessage'] = ErrorConstant.Message.RecordNotFound;
                        this.errorService.emitError(e);
                    }
                    this.autoOpenTo = false;
                },
                (error) => {
                    this.form_group.controls['ToAccountName'].setValue('');
                    error['errorMessage'] = error['errorMessage'] || ErrorConstant.Message.ErrorFetchingRecord;
                    //this.errorService.emitError(error);
                }
            );
        } else {
            //this.form_group.controls['accountName'].setValue('');
        }
    };

    public lookUpRecord(data: any, maxresults: number): any {
        this.queryLookUp.set(this.serviceConstants.Action, '0');
        this.queryLookUp.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.queryLookUp.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        if (maxresults) {
            this.queryLookUp.set(this.serviceConstants.MaxResults, maxresults.toString());
        }
        return this.httpService.lookUpRequest(this.queryLookUp, data);
    }

    public onDataReceived(data: any, route: any): void {
        this.form_group.controls['fromAccountNumber'].setValue(data.AccountNumber);
        this.form_group.controls['FromAccountName'].setValue(data.AccountName);
        this.form_group.controls['FromAccountAddressLine1'].setValue(data.AccountAddressLine1);
        this.form_group.controls['FromAccountAddressLine2'].setValue(data.AccountAddressLine2);
        this.form_group.controls['FromAccountAddressLine3'].setValue(data.AccountAddressLine3);
        this.form_group.controls['FromAccountAddressLine4'].setValue(data.AccountAddressLine4);
        this.form_group.controls['FromAccountAddressLine5'].setValue(data.AccountAddressLine5);
        this.form_group.controls['FromPostcode'].setValue(data.AccountPostcode);
        this.cbb.disableComponent(true);
        if (route === true) {
            this.preRoute(data, false);
        }
    }

    public onDataReceivedTo(data: any, route: any): void {
        this.form_group.controls['toAccountNumber'].setValue(data.AccountNumber);
        this.form_group.controls['ToAccountName'].setValue(data.AccountName);
        this.form_group.controls['ToAccountAddressLine1'].setValue(data.AccountAddressLine1);
        this.form_group.controls['ToAccountAddressLine2'].setValue(data.AccountAddressLine2);
        this.form_group.controls['ToAccountAddressLine3'].setValue(data.AccountAddressLine3);
        this.form_group.controls['ToAccountAddressLine4'].setValue(data.AccountAddressLine4);
        this.form_group.controls['ToAccountAddressLine5'].setValue(data.AccountAddressLine5);
        this.form_group.controls['ToPostcode'].setValue(data.AccountPostcode);
        this.cbb.disableComponent(true);
        if (route === true) {
            this.preRoute(data, true);
        }
    }

    public onBlur(event: any): void {
        let elementValue = event.target.value;
        if (elementValue.length > 0 && elementValue.length < 9) {
            let _paddedValue = this.numberPadding(elementValue, 9);
            if (event.target.id === 'fromAccountNumber') {
                this.form_group.controls['fromAccountNumber'].setValue(_paddedValue);
            }
            else if (event.target.id === 'toAccountNumber') {
                this.form_group.controls['toAccountNumber'].setValue(_paddedValue);
            }
        }
    };

    public getTranslatedValue(key: string, params: any): any {
        if (params) {
            return this.translate.get(key, { value: params });
        } else {
            return this.translate.get(key);
        }

    }

    /*
    *   Pops up confirmation dialog if there are unsaved changes
    */
    @ViewChild('routeAwayComponent') public routeAwayComponent;
    public canDeactivate(): Observable<boolean> {
        return this.routeAwayComponent.canDeactivate();
    }
    public routeAwayUpdateSaveFlag(): void {
        this.form_group.valueChanges.subscribe((value: any) => {
            if ((value.fromAccountNumber !== undefined) && (value.toAccountNumber !== undefined) && (value.fromAccountNumber !== '') && (value.toAccountNumber !== '' && (value.fromAccountNumber !== null) && (value.toAccountNumber !== null))) {
                this.routeAwayGlobals.setSaveEnabledFlag(true);
            }
        });
    }
}
