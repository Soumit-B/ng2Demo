import { GlobalizeService } from './../../../shared/services/globalize.service';
import * as moment from 'moment';
import { RiExchange } from './../../../shared/services/riExchange';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { Utils } from './../../../shared/services/utility';
import { LookUp } from './../../../shared/services/lookup';
import { ErrorConstant } from './../../../shared/constants/error.constant';
import { ErrorService } from './../../../shared/services/error.service';
import { MessageService } from '../../../shared/services/message.service';
import { AjaxObservableConstant } from './../../../shared/constants/ajax-observable.constant';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { URLSearchParams } from '@angular/http';
import { HttpService } from './../../../shared/services/http-service';
import { PageDataService } from './../../../shared/services/page-data.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Logger } from '@nsalaun/ng2-logger';
import { ContractSearchComponent } from './../../internal/search/iCABSAContractSearch';
import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, Input, NgZone } from '@angular/core';
import { Router, Data } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { LocaleTranslationService } from '../../../shared/services/translation.service';
import { RouteAwayComponent } from '../../../shared/components/route-away/route-away';
import { RouteAwayGlobals } from '../../../shared/services/route-away-global.service';
import { Observable } from 'rxjs/Observable';


@Component({
    templateUrl: 'iCABSAAPIDateMaintenance.html',
    providers: [ErrorService, MessageService]
})
export class ApiDateMaintenanceComponent implements OnInit, OnDestroy {

    @ViewChild('errorModal') public errorModal;
    @ViewChild('messageModal') public messageModal;
    @ViewChild('promptModal') public promptModal;

    //CR implementation
    @ViewChild('routeAwayComponent') public routeAwayComponent;
    public canDeactivate(): Observable<boolean> {
        this.routeAwayGlobals.setSaveEnabledFlag(this.formDateMaintenance.dirty);
        if (this.routeAwayComponent) {
            return this.routeAwayComponent.canDeactivate();
        }
    }

    public routerSubscription: Subscription;
    public contractSearchComponent = ContractSearchComponent;

    public autoOpen: boolean = false;
    public showCloseButton: boolean = true;
    public formDateMaintenance: FormGroup;
    private pageData: PageDataService;
    public inputParams: any = {};
    public ajaxSource = new BehaviorSubject<any>(0);
    public ajaxSource$;
    public ajaxSubscription: Subscription;
    public errorSubscription;
    public messageSubscription;
    public showErrorHeader: boolean = true;
    public showMessageHeader: boolean = true;
    public isDateReadOnly: boolean = true;
    public ServiceDateFrom: Date;
    public dtNextAPIDate: string;
    public apiParams: any = {};
    public searchParams: URLSearchParams = new URLSearchParams();
    public postSearchParams: URLSearchParams = new URLSearchParams();
    public isRequesting: boolean = false;
    // public contractDetails: Object = {};
    public currentAnnivDate: string;
    public storeData: any;
    public promptTitle: string = 'Confirm Record?';
    public promptContent: string = '';
    public formData: any = {};
    public setFocusNextAPI: boolean = false;
    public disableSearch: boolean = false;

    private subLookupContract: Subscription;

    public headerParams: any = {
        method: 'contract-management/maintenance',
        operation: 'Application/iCABSAAPIDateMaintenance',
        module: 'api'
    };

    constructor(
        private serviceConstants: ServiceConstants,
        private httpService: HttpService,
        private errorService: ErrorService,
        private messageService: MessageService,
        private ajaxconstant: AjaxObservableConstant,
        private zone: NgZone,
        private LookUp: LookUp,
        private router: Router,
        private fb: FormBuilder,
        private logger: Logger,
        private utils: Utils,
        private riExchange: RiExchange,
        private localeTranslateService: LocaleTranslationService,
        private globalize: GlobalizeService,
        private routeAwayGlobals: RouteAwayGlobals) {
        this.utils.getTranslatedval('API Date Maintenance').then((res: string) => {
            this.utils.setTitle(res);
        });
    };

    public ngOnInit(): void {
        this.routeAwayGlobals.setEllipseOpenFlag(false); //CR implementation
        this.localeTranslateService.setUpTranslation();
        this.routerSubscription = this.router.events.subscribe(event => {
            this.inputParams.parentMode = 'Search';
            this.inputParams.currentContractType = 'C';
            this.inputParams.ContractTypeCode = 'C';
            this.autoOpen = true;
        });

        this.formDateMaintenance = this.fb.group({
            contractNumber: [''],
            contractName: [''],
            contractStatus: [''],
            accountNumber: [''],
            accountName: [''],
            address1: [''],
            address2: [''],
            address3: [''],
            address4: [''],
            address5: [''],
            postcode: [''],
            negBranchNumber: [''],
            branchName: [''],
            invoiceFrequencyCode: [''],
            invoiceFrequencyDesc: [''],
            annualValue: [''],
            commenceDate: [''],
            anniversaryDate: [''],
            statusCode: ['']
        });
        this.ajaxSource$ = this.ajaxSource.asObservable();
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

        this.messageService.emitMessage(0);
        this.messageSubscription = this.messageService.getObservableSource().subscribe(data => {
            if (data !== 0) {
                this.zone.run(() => {
                    this.messageModal.show(data, false);
                });
            }
        });
    }

    public updateView(): void {
        this.inputParams.parentMode = 'LookUp';
        this.inputParams.currentContractType = 'C';
    }

    public ngOnDestroy(): void {
        this.errorSubscription.unsubscribe();
        this.ajaxSubscription.unsubscribe();
        this.routeAwayGlobals.resetRouteAwayFlags();
    }

    public onContractChange(): void {
        this.isDateReadOnly = true;
        let _contractNumber = this.formDateMaintenance.controls['contractNumber'].value;
        let paddedContractNumber;
        if (_contractNumber) {
            paddedContractNumber = this.numberPadding(_contractNumber, 8);
            this.formDateMaintenance.controls['contractNumber'].setValue(paddedContractNumber);
        }
        this.riExchange.riInputElement.MarkAsPristine(this.formDateMaintenance, 'contractNumber');
        this.fetchContractDetails(paddedContractNumber);
    }

    public fetchContractDetails(contractNumber: string): void {
        this.ajaxSource.next(this.ajaxconstant.START);
        this.searchParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.searchParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.searchParams.set(this.serviceConstants.Action, '0');
        this.searchParams.set('ContractNumber', contractNumber);

        let _module = this.headerParams.module;
        let _method = this.headerParams.method;
        let _operation = this.headerParams.operation;
        let _search = this.searchParams;

        this.httpService.makeGetRequest(_method, _module, _operation, _search)
            .subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);

                if (data['errorMessage']) {
                    this.errorService.emitError(data);
                    this.formDateMaintenance.controls['contractNumber'].setValue('');
                    this.resetForm();
                } else {
                    data['ContractNumber'] = contractNumber;
                    this.formDateMaintenance.controls['accountNumber'].setValue(data.AccountNumber);
                    this.populateDataFields(data);
                    this.fetchOtherDetails(data);
                }
            },
            error => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    public fetchOtherDetails(data: Object): void {
        this.ajaxSource.next(this.ajaxconstant.START);
        let lookupIP_details = [{
            'table': 'Account',
            'query': {
                'BusinessCode': this.utils.getBusinessCode(),
                'AccountNumber': data['AccountNumber']
            },
            'fields': [
                'AccountName',
                'AccountAddressLine1',
                'AccountAddressLine2',
                'AccountAddressLine3',
                'AccountAddressLine4',
                'AccountAddressLine5',
                'AccountPostcode']
        },
        {
            'table': 'SystemInvoiceFrequency',
            'query': {
                'InvoiceFrequencyCode': data['InvoiceFrequencyCode']
            },
            'fields': ['InvoiceFrequencyDesc']
        },
        {
            'table': 'Branch',
            'query': {
                'BusinessCode': this.utils.getBusinessCode(),
                'BranchNumber': data['NegBranchNumber']
            },
            'fields': ['BranchName']
        },
        {
            'table': 'PortfolioStatusLang',
            'query': {
                'LanguageCode': this.riExchange.LanguageCode(),
                'PortfolioStatusCode': data['PortfolioStatusCode']
            },
            'fields': ['PortfolioStatusDesc']
        }];

        this.subLookupContract = this.LookUp.lookUpRecord(lookupIP_details).subscribe((e) => {
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            if (e['errorMessage']) {
                this.errorService.emitError(e);
                return;
            }
            if (e && e.length > 0 && e[0].length > 0) {
                this.populateOtherDataFields(e);
            }
        },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    public onDataReceived(data: any): void {
        this.formDateMaintenance.controls['contractNumber'].setValue(data.ContractNumber);
        this.formDateMaintenance.controls['contractName'].setValue(data.ContractName);
        this.formDateMaintenance.controls['accountNumber'].setValue(data.AccountNumber);

        this.fetchContractDetails(data.ContractNumber);
    }

    public populateDataFields(data: any): void {
        this.formDateMaintenance.controls['contractNumber'].setValue(data.ContractNumber);
        this.formDateMaintenance.controls['contractName'].setValue(data.ContractName);
        this.formDateMaintenance.controls['accountNumber'].setValue(data.AccountNumber);
        this.formDateMaintenance.controls['negBranchNumber'].setValue(data.NegBranchNumber);
        this.formDateMaintenance.controls['invoiceFrequencyCode'].setValue(data.InvoiceFrequencyCode);
        this.formDateMaintenance.controls['statusCode'].setValue(data.PortfolioStatusCode);
        this.formDateMaintenance.controls['annualValue'].setValue(data.ContractAnnualValue);
        this.formDateMaintenance.controls['commenceDate'].setValue(data.ContractCommenceDate);
        this.formDateMaintenance.controls['anniversaryDate'].setValue(data.InvoiceAnnivDate);
        this.dtNextAPIDate = data.NextAPIDate;
        this.isDateReadOnly = false;
        /*if (moment(data.NextAPIDate, 'DD/MM/YYYY', true).isValid()) {
            this.dtNextAPIDate = this.utils.convertDate(data.NextAPIDate);
        } else {
            this.dtNextAPIDate = this.utils.formatDate(data.NextAPIDate);
        }
        if (!this.dtNextAPIDate) {
            this.ServiceDateFrom = null;
        } else {
            this.ServiceDateFrom = new Date(this.dtNextAPIDate);
            if (!moment(this.dtNextAPIDate, 'DD/MM/YYYY', true).isValid()) {
                this.dtNextAPIDate = this.utils.formatDate(this.dtNextAPIDate);
            }
        }
        this.currentAnnivDate = data.NextAPIDate;*/

        if (data.NextAPIDate) {
            this.dtNextAPIDate = this.globalize.parseDateToFixedFormat(data.NextAPIDate) as string;
            let parsedDate: any = this.globalize.parseDateStringToDate(data.NextAPIDate);
            if (parsedDate instanceof Date) {
                this.ServiceDateFrom = parsedDate;
            } else {
                this.ServiceDateFrom = null;
            }
            this.currentAnnivDate = this.dtNextAPIDate;
        } else {
            this.dtNextAPIDate = '';
            this.ServiceDateFrom = null;
            this.currentAnnivDate = '';
        }
    }

    public populateOtherDataFields(data: any): void {
        //    this.disableSearch = true;
        this.formDateMaintenance.controls['accountName'].setValue((data[0])[0].AccountName);
        this.formDateMaintenance.controls['address1'].setValue((data[0])[0].AccountAddressLine1);
        this.formDateMaintenance.controls['address2'].setValue((data[0])[0].AccountAddressLine2);
        this.formDateMaintenance.controls['address3'].setValue((data[0])[0].AccountAddressLine3);
        this.formDateMaintenance.controls['address4'].setValue((data[0])[0].AccountAddressLine4);
        this.formDateMaintenance.controls['address5'].setValue((data[0])[0].AccountAddressLine5);
        this.formDateMaintenance.controls['postcode'].setValue((data[0])[0].AccountPostcode);
        this.formDateMaintenance.controls['invoiceFrequencyDesc'].setValue((data[1])[0].InvoiceFrequencyDesc);
        this.formDateMaintenance.controls['branchName'].setValue((data[2])[0].BranchName);
        this.formDateMaintenance.controls['contractStatus'].setValue((data[3])[0].PortfolioStatusDesc);
    }

    public updateDate(): void {
        let ContractNumber = this.formDateMaintenance.controls['contractNumber'].value;

        if (ContractNumber) {
            this.isDateReadOnly = false;
        }
        else {
            let _error: Object = {};
            _error['errorMessage'] = 'No record selected';
            this.errorService.emitError(_error);
        }

    }

    public resetDate(): void {
        this.ServiceDateFrom = this.globalize.parseDateStringToDate(this.currentAnnivDate) as Date;
        this.riExchange.riInputElement.MarkAsPristine(this.formDateMaintenance, 'anniversaryDate');
    }

    public updateDatePickerValue(value: any): void {
        if (value && value.value) {
            this.dtNextAPIDate = value.value;
        } else {
            this.dtNextAPIDate = '';
        }
        if (value.trigger) {
            this.riExchange.riInputElement.MarkAsDirty(this.formDateMaintenance, 'anniversaryDate');
        }
    };

    public serviceDateFromSelectedValue(value: any): void {
        if (value && value.value)
            this.dtNextAPIDate = value.value;
    }

    public resetForm(): void {
        //    this.disableSearch = false;
        this.formDateMaintenance.controls['contractNumber'].setValue('');
        this.formDateMaintenance.controls['contractName'].setValue('');
        this.formDateMaintenance.controls['statusCode'].setValue('');
        this.formDateMaintenance.controls['contractStatus'].setValue('');
        this.formDateMaintenance.controls['accountNumber'].setValue('');
        this.formDateMaintenance.controls['accountName'].setValue('');
        this.formDateMaintenance.controls['address1'].setValue('');
        this.formDateMaintenance.controls['address2'].setValue('');
        this.formDateMaintenance.controls['address3'].setValue('');
        this.formDateMaintenance.controls['address4'].setValue('');
        this.formDateMaintenance.controls['address5'].setValue('');
        this.formDateMaintenance.controls['postcode'].setValue('');

        this.formDateMaintenance.controls['negBranchNumber'].setValue('');
        this.formDateMaintenance.controls['branchName'].setValue('');

        this.formDateMaintenance.controls['invoiceFrequencyCode'].setValue('');
        this.formDateMaintenance.controls['invoiceFrequencyDesc'].setValue('');

        this.formDateMaintenance.controls['annualValue'].setValue('');
        this.formDateMaintenance.controls['commenceDate'].setValue('');
        this.formDateMaintenance.controls['anniversaryDate'].setValue('');
        this.dtNextAPIDate = null;
        this.ServiceDateFrom = null;
    }

    public onSubmit(data: FormGroup, event: any): void {
        this.routeAwayComponent.resetDirtyFlagAfterSaveUpdate();
        event.preventDefault();
        this.formData = data;
        let ContractNumber = this.formDateMaintenance.controls['contractNumber'].value;
        if (ContractNumber) {
            this.promptModal.show();
        } else {
            let _error: Object = {};
            _error['errorMessage'] = MessageConstant.Message.RecordNotFound;
            this.errorService.emitError(_error);
        }
    }

    public promptSave(event: any): void {

        let _formData: Object = {};

        _formData['ContractNumber'] = this.formData['contractNumber'];
        _formData['ContractName'] = this.formData['contractName'];
        _formData['PortfolioStatusCode'] = this.formData['statusCode'];
        _formData['AccountNumber'] = this.formData['accountNumber'];
        _formData['NegBranchNumber'] = this.formData['negBranchNumber'];
        _formData['ContractAnnualValue'] = this.globalize.parseCurrencyToFixedFormat(this.formData['annualValue']);
        _formData['InvoiceAnnivDate'] = this.globalize.parseDateToFixedFormat(this.formData['anniversaryDate']);
        _formData['InvoiceFrequencyCode'] = this.formData['invoiceFrequencyCode'];
        _formData['ContractCommenceDate'] = this.globalize.parseDateToFixedFormat(this.formData['commenceDate']);
        _formData['NextAPIDate'] = this.dtNextAPIDate;
        this.postSearchParams.set(this.serviceConstants.Action, '2');
        this.postSearchParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.postSearchParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.postSearchParams.set('Function', 'CheckContractType');

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, this.postSearchParams, _formData)
            .subscribe(
            (e) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (e['status'] === 'failure') {
                    this.errorService.emitError(e['oResponse']);
                } else {
                    if ((typeof e['oResponse'] !== 'undefined' && e.oResponse['errorMessage'])) {
                        this.errorService.emitError(e['oResponse']);
                    } else if (e['errorMessage']) {
                        this.errorService.emitError(e);
                    } else {
                        this.currentAnnivDate = this.dtNextAPIDate;
                        e['msg'] = MessageConstant.Message.RecordSavedSuccessfully;
                        this.messageService.emitMessage(e);
                        this.riExchange.riInputElement.MarkAsPristine(this.formDateMaintenance, 'anniversaryDate');
                    }
                }
            },
            (error) => {
                this.errorService.emitError(error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    public numberPadding(num: any, size: any): any {
        let s = num + '';
        while (s.length < size) s = '0' + s;
        return s;
    }

}
