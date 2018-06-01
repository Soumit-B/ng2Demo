import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, NgZone } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Store } from '@ngrx/store';
import { URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Subscription } from 'rxjs/Subscription';
import { TranslateService } from 'ng2-translate';
import * as moment from 'moment';
import { Utils } from './../../../shared/services/utility';
import { LookUp } from './../../../shared/services/lookup';
import { ErrorConstant } from '../../../shared/constants/error.constant';
import { LocaleTranslationService } from '../../../shared/services/translation.service';
import { ComponentInteractionService } from '../../../shared/services/component-interaction.service';
import { EllipsisComponent } from '../../../shared/components/ellipsis/ellipsis';
import { AccountSearchComponent } from '../../internal/search/iCABSASAccountSearch';
import { ContractSearchComponent } from './../../internal/search/iCABSAContractSearch';
import { HttpService } from './../../../shared/services/http-service';
import { ErrorService } from '../../../shared/services/error.service';
import { PageDataService } from '../../../shared/services/page-data.service';
import { MessageService } from '../../../shared/services/message.service';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { MessageConstant } from '../../../shared/constants/message.constant';
import { AjaxObservableConstant } from '../../../shared/constants/ajax-observable.constant';
import { ActionTypes } from '../../actions/account';
import { RouteAwayComponent } from '../../../shared/components/route-away/route-away';
import { RouteAwayGlobals } from '../../../shared/services/route-away-global.service';
import { CBBService } from '../../../shared/services/cbb.service';
import { GlobalizeService } from '../../../shared/services/globalize.service';
import { ContractManagementModuleRoutes } from '../../base/PageRoutes';

@Component({
    selector: 'icabs-account-move',
    templateUrl: 'iCABSAAccountMove.html',
    styles: ['input[type="number"]::-webkit-outer-spin-button, input[type="number"]::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0;}'],
    providers: [ErrorService, MessageService, ComponentInteractionService]
})

export class AccountMoveComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('formContractNumber') formContractNumber;
    @ViewChild('fromAccountNumber') fromAccountInput;
    @ViewChild('toAccountNumber') toAccountInput;
    @ViewChild('errorModal') public errorModal;
    @ViewChild('messageModal') public messageModal;
    @ViewChild('promptModal') public promptModal;

    public contractSearchComponent = ContractSearchComponent;
    public accountSearchComponent = AccountSearchComponent;
    public fromIdentifier: string = 'from';
    public toIdentifier: string = 'to';

    public ajaxSource = new BehaviorSubject<any>(0);
    public ajaxSource$;
    public ajaxSubscription: Subscription;
    public routerSubscription: Subscription;
    public storeSubscription: Subscription;
    public componentInteractionSubscription: Subscription;
    public lookUpSubscription: Subscription;
    private subLookupContract: Subscription;
    public errorSubscription;
    public messageSubscription;
    public accountMoveFormGroup: FormGroup;

    // Local variables
    public errorMessage: string;
    public isRequesting: boolean = false;
    public hideEllipsis: boolean = false;
    public autoOpenFrom: boolean = false;
    public autoOpenTo: boolean = false;

    public modalConfig: any = {
        backdrop: 'static',
        keyboard: true
    };
    public inputParams: any = {
        'parentMode': '',
        'currentContractType': 'C',
        'action': '1'
    };
    public inputParamsContract: any = {
        'parentMode': 'LookUp-AccountMove'
    };
    public inputParamsAccount: any = {
        'parentMode': 'LookUp-MergeTo',
        'showBusinessCode': false,
        'showCountryCode': false,
        'showAddNew': false,
        'showAddNewDisplay': false
    };
    public dateObjectsEnabled: Object = {
        ContractCommenceDate: false
    };
    public queryParamsForMoveToAccount: any = {
        module: 'account',
        operation: 'Application/iCABSAAccountMove',
        method: 'contract-management/maintenance',
        AccountNumber: '',
        action: 1,
        table: 'Account'
    };

    public method: string = 'contract-management/maintenance';
    public module: string = 'account';
    public operation: string = 'Application/iCABSAAccountMove';
    // public functionName: string = 'move';
    public function: string = 'GetToAccount';
    public contentType: string = 'application/x-www-form-urlencoded';
    public addNew: boolean = false;
    public currentContractType: string = 'C';
    public search: URLSearchParams = new URLSearchParams();
    public searchForMoveToAccount: URLSearchParams = new URLSearchParams();
    public searchModalRoute: string = '/contractmanagement/account/move/search';
    public searchPageRoute: string = '/contractmanagement/account/move';
    public showHeader: boolean = true;
    public showCloseButton: boolean = true;
    public showErrorHeader: boolean = true;
    public showMessageHeader: boolean = true;
    public formData: any;
    public promptTitle: string = 'Confirm Record?';
    public promptContent: string = '';
    public storeData: any;
    public contractLookupComponent: Component;
    private isFormEnabled: boolean = false;
    private localeData: any;

    constructor(
        private httpService: HttpService,
        private fb: FormBuilder,
        private serviceConstants: ServiceConstants,
        private errorService: ErrorService,
        private messageService: MessageService,
        private ajaxconstant: AjaxObservableConstant,
        private router: Router,
        private pageData: PageDataService,
        private titleService: Title,
        private LookUp: LookUp,
        private zone: NgZone,
        private store: Store<any>,
        private translate: TranslateService,
        private utils: Utils,
        private localeTranslateService: LocaleTranslationService,
        private componentInteractionService: ComponentInteractionService,
        private routeAwayGlobals: RouteAwayGlobals,
        private cbb: CBBService,
        private globalize: GlobalizeService
    ) {
        this.storeSubscription = store.select('account').subscribe(data => {
            this.storeData = data;

        });
    }

    public ngOnInit(): void {
        this.ajaxSource$ = this.ajaxSource.asObservable();
        this.routeAwayGlobals.setEllipseOpenFlag(false); //CR implementation
        this.contractSearchComponent = ContractSearchComponent;
        this.accountSearchComponent = AccountSearchComponent;
        this.queryParamsForMoveToAccount.countryCode = this.utils.getCountryCode();
        this.queryParamsForMoveToAccount.businessCode = this.utils.getBusinessCode();

        this.localeTranslateService.setUpTranslation();

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
                    this.messageModal.show({ msg: data['msg'], title: data['title'] }, false);
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

        this.routerSubscription = this.router.events.subscribe(event => {
            if (event.url === '/contractmanagement/account/move/search') {
                this.accountMoveFormGroup.controls['toAccountNumber'].disable();
                this.inputParams.parentMode = this.inputParamsContract.parentMode;
                this.inputParams.currentContractType = this.inputParamsContract.currentContractType;
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
            } else if (event.url === '/contractmanagement/account/move') {
                this.accountMoveFormGroup.controls['toAccountNumber'].enable();
                this.inputParams.parentMode = this.inputParamsAccount.parentMode;
                this.searchModalRoute = '/contractmanagement/account/move/search';
                if (this.storeData && (typeof this.storeData.from !== 'undefined' || typeof this.storeData.to !== 'undefined')) {
                    if (typeof this.storeData.from !== 'undefined') {
                        this.onDataReceived(this.storeData.from, false);
                    }

                    if (typeof this.storeData.to !== 'undefined') {
                        this.onDataReceivedTo(this.storeData.to, false);
                    }

                } else {
                    this.router.navigate([ContractManagementModuleRoutes.ICABSAACCOUNTMOVE]);
                }
            }
        });


        this.accountMoveFormGroup = this.fb.group({
            formContractNumber: [{ value: '', disabled: false }, Validators.required],
            fromContractName: [{ value: '', disabled: false }],
            fromAccountNumber: [{ value: '', disabled: false }],
            ContractAnnualValue: [{ value: '', disabled: false }],
            ContractCommenceDate: [{ value: '', disabled: false }],
            NegBranchNumber: [{ value: '', disabled: false }],
            CurrentPremises: [{ value: '', disabled: false }],
            FromAccountAddressLine1: [{ value: '', disabled: false }],
            FromAccountAddressLine2: [{ value: '', disabled: false }],
            FromAccountAddressLine3: [{ value: '', disabled: false }],
            FromAccountAddressLine4: [{ value: '', disabled: false }],
            FromAccountAddressLine5: [{ value: '', disabled: false }],
            FromAccountPostcode: [{ value: '', disabled: false }],
            toAccountNumber: [{ value: '', disabled: false }, Validators.required],
            toAccountName: [{ value: '', disabled: false }],
            ToAccountAddressLine1: [{ value: '', disabled: false }],
            ToAccountAddressLine2: [{ value: '', disabled: false }],
            ToAccountAddressLine3: [{ value: '', disabled: false }],
            ToAccountAddressLine4: [{ value: '', disabled: false }],
            ToAccountAddressLine5: [{ value: '', disabled: false }],
            ToAccountPostcode: [{ value: '', disabled: false }]
        });
        this.routeAwayUpdateSaveFlag(); //CR implementation
    }

    ngAfterViewInit(): void {
        this.autoOpenFrom = true;
    }

    ngOnDestroy(): void {
        if (this.errorSubscription)
            this.errorSubscription.unsubscribe();
        if (this.messageSubscription)
            this.messageSubscription.unsubscribe();
        if (this.ajaxSubscription)
            this.ajaxSubscription.unsubscribe();
        if (this.routerSubscription)
            this.routerSubscription.unsubscribe();
        if (this.storeSubscription)
            this.storeSubscription.unsubscribe();
        if (this.routeAwayGlobals)
            this.routeAwayGlobals.resetRouteAwayFlags();
        if (this.lookUpSubscription)
            this.lookUpSubscription.unsubscribe();
    }

    public onDataReceived(data: any, route: any): void {
        this.routeAwayGlobals.setEllipseOpenFlag(false); //CR implementation
        if (data && data.ContractNumber) {
            this.accountMoveFormGroup.controls['formContractNumber'].setValue(data.ContractNumber);
            this.accountMoveFormGroup.controls['fromContractName'].setValue(data.ContractName);
            this.accountMoveFormGroup.controls['fromAccountNumber'].setValue(data.AccountNumber);
            if (data.AccountAddressLine1)
                this.accountMoveFormGroup.controls['FromAccountAddressLine1'].setValue(data.AccountAddressLine1);
            if (data.AccountAddressLine2)
                this.accountMoveFormGroup.controls['FromAccountAddressLine2'].setValue(data.AccountAddressLine2);
            if (data.AccountAddressLine3)
                this.accountMoveFormGroup.controls['FromAccountAddressLine3'].setValue(data.AccountAddressLine3);
            this.fetchContractDetails();
        }
    }

    public onContractDataReceived(data: any, route: any): void {
        this.routeAwayGlobals.setEllipseOpenFlag(false); //CR implementation
        this.cbb.disableComponent(true);
        this.accountMoveFormGroup.controls['ContractAnnualValue'].setValue(data.ContractAnnualValue);
        this.accountMoveFormGroup.controls['NegBranchNumber'].setValue(data.NegBranchNumber);
        this.accountMoveFormGroup.controls['CurrentPremises'].setValue(data.CurrentPremises);
        this.accountMoveFormGroup.controls['fromAccountNumber'].setValue(data.AccountNumber);
        this.accountMoveFormGroup.controls['fromContractName'].setValue(data.ContractName);
        this.accountMoveFormGroup.controls['ContractCommenceDate'].setValue(this.globalize.parseDateToFixedFormat(data.ContractCommenceDate));
        this.fetchMoveFromAccountDetails();
    }

    public onDataReceivedFrom(data: any, route: any): void {
        this.routeAwayGlobals.setEllipseOpenFlag(false); //CR implementation
        this.accountMoveFormGroup.controls['FromAccountAddressLine1'].setValue(data.AccountAddressLine1);
        this.accountMoveFormGroup.controls['FromAccountAddressLine2'].setValue(data.AccountAddressLine2);
        this.accountMoveFormGroup.controls['FromAccountAddressLine3'].setValue(data.AccountAddressLine3);
        this.accountMoveFormGroup.controls['FromAccountAddressLine4'].setValue(data.AccountAddressLine4);
        this.accountMoveFormGroup.controls['FromAccountAddressLine5'].setValue(data.AccountAddressLine5);
        this.accountMoveFormGroup.controls['FromAccountPostcode'].setValue(data.AccountPostcode);
        this.enableForm();
    }

    public onDataReceivedTo(data: any, route: any): void {
        this.routeAwayGlobals.setEllipseOpenFlag(false); //CR implementation
        if (typeof data !== 'undefined') {
            if (data.AccountNumber) {
                this.accountMoveFormGroup.controls['toAccountNumber'].setValue(data.AccountNumber);
            }
            this.accountMoveFormGroup.controls['toAccountName'].setValue(data.AccountName);
            this.accountMoveFormGroup.controls['ToAccountAddressLine1'].setValue(data.AccountAddressLine1);
            this.accountMoveFormGroup.controls['ToAccountAddressLine2'].setValue(data.AccountAddressLine2);
            this.accountMoveFormGroup.controls['ToAccountAddressLine3'].setValue(data.AccountAddressLine3);
            this.accountMoveFormGroup.controls['ToAccountAddressLine4'].setValue(data.AccountAddressLine4);
            this.accountMoveFormGroup.controls['ToAccountAddressLine5'].setValue(data.AccountAddressLine5);
            this.accountMoveFormGroup.controls['ToAccountPostcode'].setValue(data.AccountPostcode);
            this.store.dispatch({ type: ActionTypes.SAVE_DATA_TO, payload: data });
        } else {
            this.accountMoveFormGroup.controls['toAccountName'].setValue('');
            this.accountMoveFormGroup.controls['ToAccountAddressLine1'].setValue('');
            this.accountMoveFormGroup.controls['ToAccountAddressLine2'].setValue('');
            this.accountMoveFormGroup.controls['ToAccountAddressLine3'].setValue('');
            this.accountMoveFormGroup.controls['ToAccountAddressLine4'].setValue('');
            this.accountMoveFormGroup.controls['ToAccountAddressLine5'].setValue('');
            this.accountMoveFormGroup.controls['ToAccountPostcode'].setValue('');
        }
    }

    public preRoute(data: any): void {
        this.pageData.saveData(data);
        this.router.navigate([ContractManagementModuleRoutes.ICABSAACCOUNTMOVE]);
    }

    public enableForm(): void {
        this.isFormEnabled = true;
        //this.accountMoveFormGroup.controls['fromAccountNumber'].enable();
        this.accountMoveFormGroup.controls['toAccountNumber'].enable();
    }

    public disableForm(): void {
        this.routeAwayGlobals.resetRouteAwayFlags();
        this.isFormEnabled = false;
        this.accountMoveFormGroup.controls['toAccountNumber'].disable();
        this.accountMoveFormGroup.reset();
        this.hideEllipsis = false;
        this.cbb.disableComponent(false);
        this.store.dispatch({ type: ActionTypes.CLEAR_DATA_FROM }); //to clear PageData
        //this.formContractNumber.nativeElement.focus();
    }

    public promptSave(event: any): void {

        this.ajaxSource.next(this.ajaxconstant.START);
        let formdata: Object = this.formData;
        let fromAccountNumber = this.accountMoveFormGroup.controls['fromAccountNumber'].value;
        let toAccountNumber = this.accountMoveFormGroup.controls['toAccountNumber'].value;
        let ContractNumber = this.accountMoveFormGroup.controls['formContractNumber'].value;
        this.inputParams.countryCode = this.utils.getCountryCode();
        this.inputParams.businessCode = this.utils.getBusinessCode();
        this.search.set(this.serviceConstants.Action, '1');
        this.search.set(this.serviceConstants.BusinessCode, this.inputParams.businessCode);
        this.search.set(this.serviceConstants.CountryCode, this.inputParams.countryCode);
        this.search.set('FromAccountNumber', fromAccountNumber);
        this.search.set('ToAccountNumber', toAccountNumber);
        this.search.set('ContractNumber', ContractNumber);
        this.search.set('Function', this.function);

        this.inputParams.search = this.search;
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.method, this.module, this.operation, this.search)
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
                        this.messageService.emitMessage({ msg: MessageConstant.Message.RecordSavedSuccessfully, title: 'Message' });
                        this.disableForm();
                        this.store.dispatch({ type: ActionTypes.CLEAR_DATA_FROM });
                    }
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.errorMessage = error as any;
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

    public onBlur(event: any): void {
        let elementValue = event.target.value;
        if (elementValue.length > 0) {
            let _paddedValue;;
            if (event.target.id === 'formContractNumber') {
                _paddedValue = this.numberPadding(elementValue, 8);
                this.accountMoveFormGroup.controls['formContractNumber'].setValue(_paddedValue);
                this.fetchContractDetails();
            } else if (event.target.id === 'toAccountNumber') {
                _paddedValue = this.numberPadding(elementValue, 9);
                this.accountMoveFormGroup.controls['toAccountNumber'].setValue(_paddedValue);
                this.fetchMoveToAccountDetails();
            }
        }
    };

    public fetchMoveToAccountDetails(): void {
        this.ajaxSource.next(this.ajaxconstant.START);
        this.searchForMoveToAccount = new URLSearchParams();
        this.queryParamsForMoveToAccount.AccountNumber = this.accountMoveFormGroup.controls['toAccountNumber'].value;
        this.searchForMoveToAccount.set(this.serviceConstants.Action, this.queryParamsForMoveToAccount.action);
        this.searchForMoveToAccount.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.searchForMoveToAccount.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.searchForMoveToAccount.set('AccountNumber', this.queryParamsForMoveToAccount.AccountNumber);

        this.httpService.makeGetRequest(this.queryParamsForMoveToAccount.method, this.queryParamsForMoveToAccount.module, this.queryParamsForMoveToAccount.operation, this.searchForMoveToAccount)
            .subscribe(
            (e) => {
                if (e['status'] === 'failure') {
                    this.errorService.emitError(e['oResponse']);
                } else {
                    if ((typeof e['oResponse'] !== 'undefined' && e.oResponse['errorMessage'])) {
                        //this.errorService.emitError(e['oResponse']);
                        this.fetchAccountDetails('To', e['oResponse']);
                    } else if (e['errorMessage']) {
                        //this.errorService.emitError(e);
                        this.fetchAccountDetails('To', e);
                    } else if (e.records.length > 0) {
                        this.onDataReceivedTo(e.records[0], true);
                    } else {
                        //this.messageService.emitMessage({ msg: 'Record not found' });
                        this.fetchAccountDetails('To', { msg: MessageConstant.Message.noRecordFound });
                    }
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.errorMessage = error as any;
                this.errorService.emitError(error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            }
            );

    }

    public fetchAccountDetails(type: string, errMsg: any): void {
        this.ajaxSource.next(this.ajaxconstant.START);
        let lookupIP = [
            {
                'table': 'Account',
                'query': {
                    'BusinessCode': this.utils.getBusinessCode(),
                    'AccountNumber': type === 'To' ? this.accountMoveFormGroup.controls['toAccountNumber'].value : this.accountMoveFormGroup.controls['fromAccountNumber'].value
                },
                'fields': ['AccountName', 'AccountAddressLine1', 'AccountAddressLine2', 'AccountAddressLine3', 'AccountAddressLine4', 'AccountAddressLine5', 'AccountPostcode']
            }];
        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe((data) => {
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            if (type === 'To') {
                if (data[0] && data[0].length > 0) {
                    this.onDataReceivedTo(data[0][0], true);
                } else {
                    this.onDataReceivedTo(undefined, true);
                    this.errorService.emitError(errMsg);
                }
            } else if (type === 'From') {
                if (data[0] && data[0].length > 0) {
                    this.onDataReceivedFrom(data[0][0], true);
                } else {
                    this.errorService.emitError(errMsg);
                }
            }
        });
    }

    public fetchMoveFromAccountDetails(): void {
        this.ajaxSource.next(this.ajaxconstant.START);
        let lookupIP = [
            {
                'table': 'Account',
                'query': {
                    'BusinessCode': this.utils.getBusinessCode(),
                    'AccountNumber': this.accountMoveFormGroup.controls['fromAccountNumber'].value
                },
                'fields': ['AccountAddressLine1', 'AccountAddressLine2', 'AccountAddressLine3', 'AccountAddressLine4', 'AccountAddressLine5', 'AccountPostcode']
            }];
        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe((data) => {
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            this.onDataReceivedFrom(data[0][0], true);
        });
    }

    public fetchContractDetails(): void {
        this.ajaxSource.next(this.ajaxconstant.START);
        this.searchForMoveToAccount = new URLSearchParams();
        this.queryParamsForMoveToAccount.ContractNumber = this.accountMoveFormGroup.controls['formContractNumber'].value;

        let lookupIP_contract = [{
            'table': 'Contract',
            'query': { 'BusinessCode': this.utils.getBusinessCode(), 'ContractNumber': this.accountMoveFormGroup.controls['formContractNumber'].value },
            'fields': ['BusinessCode', 'ContractNumber', 'ContractName', 'ContractCommenceDate', 'NegBranchNumber', 'ContractAnnualValue', 'CurrentPremises', 'AccountNumber']
        }];
        this.subLookupContract = this.LookUp.lookUpRecord(lookupIP_contract).subscribe((data) => {
            if (data.length > 0) {
                let resp = data[0];
                if (resp.length > 0) {
                    let record = resp[0];
                    this.onContractDataReceived(record, true);
                } else {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    this.messageService.emitMessage({ msg: 'Record not found', title: 'Message' });
                }
            }
        });
    }

    public formatDate(date: Date): any {
        let d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [day, month, year].join('/');
    }

    public onSubmit(data: FormGroup, valid: boolean, event: any): void {
        this.routeAwayGlobals.setSaveEnabledFlag(false);
        event.preventDefault();
        this.formData = data;
        this.promptModal.show();
    }
    /*
    *   Alerts user when user is moving away without saving the changes. //CR implementation
    */
    @ViewChild('routeAwayComponent') public routeAwayComponent;
    public canDeactivate(): Observable<boolean> {
        return this.routeAwayComponent.canDeactivate();
    }
    public routeAwayUpdateSaveFlag(): void {
        this.accountMoveFormGroup.statusChanges.subscribe((value: any) => {
            if (this.accountMoveFormGroup.valid === true) {
                this.routeAwayGlobals.setSaveEnabledFlag(true);
            } else {
                this.routeAwayGlobals.setSaveEnabledFlag(false);
            }
        });
    }
}
