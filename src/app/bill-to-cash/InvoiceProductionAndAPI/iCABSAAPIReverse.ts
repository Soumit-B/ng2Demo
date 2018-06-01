import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, Input, NgZone } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs/Subscription';
import { URLSearchParams } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { TranslateService } from 'ng2-translate';
import { LocalStorageService } from 'ng2-webstorage';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { ContractSearchComponent } from '../../internal/search/iCABSAContractSearch';
import { PremiseSearchComponent } from '../../internal/search/iCABSAPremiseSearch';
import { ServiceCoverSearchComponent } from './../../internal/search/iCABSAServiceCoverSearch';
import { HttpService } from './../../../shared/services/http-service';
import { ErrorService } from '../../../shared/services/error.service';
import { LocaleTranslationService } from '../../../shared/services/translation.service';
import { PageDataService } from '../../../shared/services/page-data.service';
import { AuthService } from '../../../shared/services/auth.service';
import { MessageService } from '../../../shared/services/message.service';
import { CBBService } from '../../../shared/services/cbb.service';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { AjaxObservableConstant } from '../../../shared/constants/ajax-observable.constant';
import { GlobalConstant } from '../../../shared/constants/global.constant';
import { MessageConstant } from '../../../shared/constants/message.constant';
import { ErrorConstant } from '../../../shared/constants/error.constant';
import { ContractActionTypes } from '../../../app/actions/contract';
import { Utils } from '../../../shared/services/utility';
import { RouteAwayComponent } from '../../../shared/components/route-away/route-away';
import { RouteAwayGlobals } from '../../../shared/services/route-away-global.service';
import { GlobalizeService } from '../../../shared/services/globalize.service';

@Component({
    templateUrl: 'iCABSAAPIReverse.html',
    providers: [ErrorService, MessageService]
})

export class ApiReverseMaintenanceComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('errorModal') public errorModal;
    @ViewChild('messageModal') public messageModal;
    public mode: string;
    public contractNum: string;
    public contractDesc: string;
    public effectiveDate: string;
    public currentValue: string;
    public effectiveValue: string;
    public lastValue: string;
    public lastRemovalValue: string;
    public premiseNumber: string;
    public premiseDesc: string;
    public productCode: string;
    public productDesc: string;
    public visitFrequency: string;

    public query: URLSearchParams = new URLSearchParams();
    public queryPost: URLSearchParams = new URLSearchParams();
    public queryForBranch: URLSearchParams = new URLSearchParams();
    public queryLookUp: URLSearchParams = new URLSearchParams();
    public method: string = 'contract-management/maintenance';
    public module: string = 'api';
    public operation: string = 'Application/iCABSAAPIReverse';
    public contentType: string = 'application/x-www-form-urlencoded';

    public ajaxSource = new BehaviorSubject<any>(0);
    public ajaxSource$;
    public ajaxSubscription: Subscription;
    public componentInteractionSubscription: Subscription;
    public translateSubscription: Subscription;
    public storeSubscription: Subscription;
    public errorSubscription;
    public messageSubscription;
    public apiReverseFormGroup: FormGroup;

    public errorMessage: string;
    public isRequesting: boolean = false;
    public contractAutoOpen: boolean = false;
    public serviceAutoOpen: boolean = false;
    public showHeader: boolean = true;
    public showCloseButton: boolean = true;
    public showErrorHeader: boolean = true;
    public showMessageHeader: boolean = true;
    public modalConfig: any = {
        backdrop: 'static',
        keyboard: true
    };

    public inputParams: any = {
        'parentMode': 'Search',
        'businessCode': '',
        'countryCode': '',
        'methodType': 'maintenance',
        'action': '',
        'pageTitle': 'API Reverse',
        'showAddNew': false,
        'currentContractType': 'C'
    };

    public inputParamsServiceCoverSearch: any = {
        'parentMode': 'Search',
        'businessCode': '',
        'countryCode': '',
        'ContractNumber': '',
        'ContractName': '',
        'PremiseNumber': '',
        'PremiseName': '',
        'ProductCode': '',
        'ProductDesc': '',
        'showAddNew': false
    };


    public inputParamsPremise: any = {
        'parentMode': 'Search',
        'ContractNumber': '',
        'ContractName': '',
        'showAddNew': false
    };
    // Todo lookup api for branch number
    public queryParams: any = {
        'level': '',
        'branchNumber': ''
    };

    public queryParamsForBranch: any = {
        module: 'structure',
        operation: 'Business/iCABSBBranchSearch',
        method: 'it-functions/search',
        table: 'userauthoritybranch',
        action: 0
    };
    public buttonTranslatedText: any = {
        'update': 'Save',
        'cancel': 'Cancel'
    };

    public serviceCoverRowID: string = '';
    public isContractDisabled: boolean = false;

    public contractSearchComponent: any;
    public premiseSearchComponent: any;
    public productSearchComponent: any;
    public contractData: any = {};
    public premiseData: any = {};
    public productData: any = {};
    public isFormEnabled: boolean = false;
    public isFormValid: boolean = false;
    public localeData: any;


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
        private store: Store<any>,
        private zone: NgZone,
        private ls: LocalStorageService,
        private translate: TranslateService,
        private localeTranslateService: LocaleTranslationService,
        private utils: Utils,
        private routeAwayGlobals: RouteAwayGlobals,
        private cbb: CBBService,
        private globalize: GlobalizeService
    ) {
    }

    ngOnInit(): void {
        this.ajaxSource$ = this.ajaxSource.asObservable();
        this.apiReverseFormGroup = this.fb.group({
            contractNumber: [{ value: '', disabled: false }, Validators.required],
            contractDesc: [{ value: '', disabled: true }],
            premiseNumber: [{ value: '', disabled: false }, Validators.required],
            premiseDesc: [{ value: '', disabled: true }],
            productCode: [{ value: '', disabled: false }, Validators.required],
            productDesc: [{ value: '', disabled: true }],
            visitFrequency: [{ value: '', disabled: true }],
            effectiveDate: [{ value: '', disabled: true }],
            currentValue: [{ value: '', disabled: true }],
            effectiveValue: [{ value: '', disabled: true }],
            lastValue: [{ value: '', disabled: true }],
            lastRemovalValue: [{ value: '', disabled: true }]
        });

        this.router.events.subscribe(event => {
            if (event.url.indexOf('/billtocash/contract/apireverse') !== -1) {
                this.mode = 'Contract';
                this.queryParams.level = 'Contract';
                this.apiReverseFormGroup.controls['premiseNumber'].clearValidators();
                this.apiReverseFormGroup.controls['productCode'].clearValidators();
                this.apiReverseFormGroup.controls['premiseNumber'].updateValueAndValidity();
                this.apiReverseFormGroup.controls['productCode'].updateValueAndValidity();
            }
            else if (event.url.indexOf('/billtocash/premise/apireverse') !== -1) {
                this.mode = 'Premise';
                this.queryParams.level = 'Premise';
                this.apiReverseFormGroup.controls['productCode'].clearValidators();
                this.apiReverseFormGroup.controls['productCode'].updateValueAndValidity();

            }
            else if (event.url.indexOf('/billtocash/servicecover/apireverse') !== -1) {
                this.mode = 'Service';
                this.queryParams.level = 'Service';
            }
        });

        if (this.mode === 'Contract') {
            this.inputParams.parentMode = 'Search';
        } else {
            this.inputParams.parentMode = 'LookUp';
        }

        if (this.mode === 'Premise') {
            this.inputParamsPremise.parentMode = 'Search';
        } else {
            this.inputParamsPremise.parentMode = 'LookUp';
        }

        this.contractSearchComponent = ContractSearchComponent;
        this.premiseSearchComponent = PremiseSearchComponent;
        this.productSearchComponent = ServiceCoverSearchComponent;
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

                    this.messageModal.show({ msg: MessageConstant.Message.SavedSuccessfully, title: 'Message' }, false);
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

        this.translateSubscription = this.localeTranslateService.ajaxSource$.subscribe(event => {
            if (event !== 0) {
                this.fetchTranslationContent();
            }
        });

        this.titleService.setTitle(this.inputParams.pageTitle);
        this.localeTranslateService.setUpTranslation();
        this.routeAwayUpdateSaveFlag(); // CR implementation
        this.routeAwayGlobals.setEllipseOpenFlag(false); // CR implementation
    }

    ngAfterViewInit(): void {
        this.contractAutoOpen = true;
        setTimeout(() => {
            this.contractAutoOpen = false;
        });
    }

    ngOnDestroy(): void {
        this.errorSubscription.unsubscribe();
        this.messageSubscription.unsubscribe();
        this.ajaxSubscription.unsubscribe();
        this.translateSubscription.unsubscribe();
        this.routeAwayGlobals.resetRouteAwayFlags(); // CR implementation
    }

    public onSubmit(data: FormGroup, valid: boolean, event: any): void {
        this.routeAwayGlobals.setSaveEnabledFlag(false); // CR implementation
        event.preventDefault();
        let formdata: Object = {};
        this.queryPost.set(this.serviceConstants.BusinessCode, this.contractData.BusinessCode ? this.contractData.BusinessCode : this.utils.getBusinessCode());
        this.queryPost.set(this.serviceConstants.CountryCode, this.contractData.CountryCode ? this.contractData.CountryCode : this.utils.getCountryCode());
        this.queryPost.set('Level', this.queryParams.level);
        this.queryPost.set(this.serviceConstants.Action, '2');
        this.queryPost.set('BranchNumber', this.queryParams.branchNumber ? this.queryParams.branchNumber : this.cbb.getBranchCode());
        if (this.mode === 'Contract') {
            formdata['ContractNumber'] = this.apiReverseFormGroup.controls['contractNumber'].value;
            formdata['ContractName'] = this.apiReverseFormGroup.controls['contractDesc'].value;
        } else if (this.mode === 'Premise') {
            formdata['ContractNumber'] = this.apiReverseFormGroup.controls['contractNumber'].value;
            formdata['PremiseNumber'] = this.apiReverseFormGroup.controls['premiseNumber'].value;
            formdata['PremiseName'] = this.apiReverseFormGroup.controls['premiseDesc'].value;
        } else if (this.mode === 'Service') {
            formdata['ContractNumber'] = this.apiReverseFormGroup.controls['contractNumber'].value;
            formdata['PremiseNumber'] = this.apiReverseFormGroup.controls['premiseNumber'].value;
            formdata['ProductCode'] = this.apiReverseFormGroup.controls['productCode'].value;
            formdata['ServiceVisitFrequency'] = this.apiReverseFormGroup.controls['visitFrequency'].value;
            formdata['ServiceCoverROWID'] = this.serviceCoverRowID;
        }

        this.inputParams.search = this.queryPost;

        if (valid) {
            this.ajaxSource.next(this.ajaxconstant.START);
            this.httpService.makePostRequest(this.method, this.module, this.operation, this.queryPost, formdata)
                .subscribe(
                (e) => {
                    if (e.status === 'failure') {
                        this.errorService.emitError(e.oResponse);
                    } else {
                        if (e.errorMessage || e.fullError) {
                            setTimeout(() => {
                                this.errorService.emitError(e);
                            }, 200);

                        } else {
                            this.messageService.emitMessage(e);
                            this.disableForm();
                            this.apiReverseFormGroup.markAsPristine();
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
    }

    public fetchAPIDetails(): void {
        this.query.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.query.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.query.set('Level', this.queryParams.level);
        this.query.set(this.serviceConstants.Action, '0');
        this.query.set('BranchNumber', this.queryParams.branchNumber ? this.queryParams.branchNumber : this.cbb.getBranchCode());
        this.query.set('ContractNumber', this.apiReverseFormGroup.controls['contractNumber'].value);
        this.query.set('ContractName', this.apiReverseFormGroup.controls['contractDesc'].value);

        if (this.mode === 'Premise') {
            this.query.set('PremiseNumber', this.apiReverseFormGroup.controls['premiseNumber'].value);
            this.query.set('PremiseDesc', this.apiReverseFormGroup.controls['premiseDesc'].value);

        } else if (this.mode === 'Service') {
            this.query.set('PremiseNumber', this.apiReverseFormGroup.controls['premiseNumber'].value);
            this.query.set('PremiseDesc', this.apiReverseFormGroup.controls['premiseDesc'].value);
            this.query.set('ProductCode', this.apiReverseFormGroup.controls['productCode'].value);
            this.query.set('ProductDesc', this.apiReverseFormGroup.controls['productDesc'].value);
            this.query.set('ServiceCoverROWID', this.serviceCoverRowID);
        }

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.method, this.module, this.operation, this.query)
            .subscribe(
            (e) => {

                if (e.status === 'failure') {
                    this.errorService.emitError(e.oResponse);
                } else {
                    //this.enableForm();
                    if (e.errorMessage || e.fullError) {
                        this.errorService.emitError(e);
                        this.isFormValid = false;
                        this.resetSecondaryFeilds();
                    } else {
                        this.isFormValid = true;
                        this.apiReverseFormGroup.controls['visitFrequency'].setValue(e.ServiceVisitFrequency);
                        this.apiReverseFormGroup.controls['effectiveDate'].setValue(e.APIEffectiveDate);
                        this.apiReverseFormGroup.controls['currentValue'].setValue(e.CurrentValue);
                        this.apiReverseFormGroup.controls['effectiveValue'].setValue(e.ValueAtEffectDate);
                        this.apiReverseFormGroup.controls['lastValue'].setValue(e.APIValue);
                        this.apiReverseFormGroup.controls['lastRemovalValue'].setValue(e.NewAPIValue);
                        if (e.ServiceCover) {
                            this.serviceCoverRowID = e.ServiceCover;
                        }
                    }
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);

            },
            (error) => {
                this.errorMessage = error as any;
                this.errorService.emitError(error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.isFormValid = false;
                this.resetSecondaryFeilds();
            }
            );
    }

    public resetSecondaryFeilds(): void {
        this.apiReverseFormGroup.controls['visitFrequency'].setValue('');
        this.apiReverseFormGroup.controls['effectiveDate'].setValue('');
        this.apiReverseFormGroup.controls['currentValue'].setValue('');
        this.apiReverseFormGroup.controls['effectiveValue'].setValue('');
        this.apiReverseFormGroup.controls['lastValue'].setValue('');
        this.apiReverseFormGroup.controls['lastRemovalValue'].setValue('');
    }

    public fetchBranchDetails(contractData: any, triggerAPI: boolean): void {
        this.queryParams.branchNumber = this.cbb.getBranchCode();
        if (!this.queryParams.branchNumber) {
            let userCode = this.authService.getSavedUserCode();
            let data = [{
                'table': 'UserAuthorityBranch',
                'query': { 'UserCode': userCode.UserCode, 'BusinessCode': this.utils.getBusinessCode() },
                'fields': ['BusinessCode', 'BranchNumber', 'DefaultBranchInd', 'CurrentBranchInd', 'UserCode']
            }];
            this.contractData = contractData;
            this.lookUpRecord(JSON.parse(JSON.stringify(data)), 100).subscribe(
                (e) => {
                    if (e['results'] && e['results'].length > 0 && e['results'][0].length > 0 && !this.queryParams.branchNumber) {
                        let found = false;
                        for (let i = 0; i < e['results'][0].length; i++) {
                            if (e['results'][0][i].CurrentBranchInd) {
                                this.queryParams.branchNumber = e['results'][0][i].BranchNumber;
                                found = true;
                            }
                        }
                        if (!found) {
                            for (let i = 0; i < e['results'][0].length; i++) {
                                if (e['results'][0][i].DefaultBranchInd) {
                                    this.queryParams.branchNumber = e['results'][0][i].BranchNumber;
                                    break;
                                }
                            }
                        }
                        if (triggerAPI) {
                            this.fetchAPIDetails();
                        }

                    } else {
                        if (triggerAPI) {
                            this.fetchAPIDetails();
                        }
                    }

                },
                (error) => {
                    // error statement
                }
            );
        } else {
            if (triggerAPI) {
                this.fetchAPIDetails();
            }
        }
    }

    public lookUpRecord(data: any, maxresults: number): any {
        this.queryLookUp.set(this.serviceConstants.Action, '0');
        this.queryLookUp.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.queryLookUp.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        if (maxresults) {
            this.queryLookUp.set(this.serviceConstants.MaxResults, maxresults.toString());
        }
        return this.httpService.lookUpRequest(this.queryLookUp, data);
    }

    public fetchTranslationContent(): void {
        // translation content
    }

    public onContractDataReceived(data: any, route: any): void {
        this.contractData = data;
        this.apiReverseFormGroup.controls['contractNumber'].setValue(data.ContractNumber);
        this.apiReverseFormGroup.controls['contractDesc'].setValue(data.ContractName);

        this.inputParamsServiceCoverSearch.ContractNumber = data.ContractNumber;
        this.inputParamsServiceCoverSearch.ContractName = data['ContractName'] ? data['ContractName'] : '';

        this.inputParamsPremise.ContractNumber = data.ContractNumber;
        this.inputParamsPremise.ContractName = data['ContractName'] ? data['ContractName'] : '';

        this.cbb.disableComponent(true);
        if (this.mode === 'Contract') {
            this.fetchBranchDetails(this.contractData, true);
        } else {

            if (this.mode === 'Premise') {

                if (this.apiReverseFormGroup.controls['premiseNumber'].value !== '') {
                    this.fetchBranchDetails(this.contractData, true);
                } else {
                    this.fetchBranchDetails(this.contractData, false);
                }
            }

            if (this.mode === 'Service') {
                if (this.apiReverseFormGroup.controls['premiseNumber'].value !== '' && this.apiReverseFormGroup.controls['premiseNumber'].value !== null && this.apiReverseFormGroup.controls['productCode'].value !== '' && this.apiReverseFormGroup.controls['productCode'].value !== null) {
                    this.fetchBranchDetails(this.contractData, true);
                } else {
                    this.fetchBranchDetails(this.contractData, false);
                }


            }
        }
        this.apiReverseFormGroup.markAsDirty();
    }

    public onProductDataReceived(data: any, route: any): void {
        this.productData = data;
        this.apiReverseFormGroup.controls['productCode'].setValue(data.ProductCode);
        this.apiReverseFormGroup.controls['productDesc'].setValue(data.ProductDesc);
        this.inputParamsServiceCoverSearch.ProductCode = data.ProductCode;
        this.serviceCoverRowID = data['row'] ? data['row'].ttServiceCover : '';
        if (this.mode === 'Service' && this.apiReverseFormGroup.controls['contractNumber'].value !== '' && this.apiReverseFormGroup.controls['contractNumber'].value !== null && this.apiReverseFormGroup.controls['premiseNumber'].value !== '' && this.apiReverseFormGroup.controls['premiseNumber'].value !== null) {
            this.fetchAPIDetails();
        }
    }

    public onPremiseDataReceived(data: any, route: any): void {
        this.premiseData = data;
        this.apiReverseFormGroup.controls['premiseNumber'].setValue(data.PremiseNumber);
        this.apiReverseFormGroup.controls['premiseDesc'].setValue(data['PremiseName'] ? data['PremiseName'] : data['PremiseDesc']);
        this.inputParamsServiceCoverSearch.PremiseNumber = data.PremiseNumber;
        this.inputParamsServiceCoverSearch.PremiseName = data['PremiseName'] ? data['PremiseName'] : data['PremiseDesc'];

        if (this.mode === 'Premise' && this.apiReverseFormGroup.controls['contractNumber'].value !== '' && this.apiReverseFormGroup.controls['contractNumber'].value !== null) {
            this.fetchAPIDetails();
        }
    }

    public onContractBlur(event: any): void {
        this.isContractDisabled = true;
        this.contractAutoOpen = false;
        let elementValue = event.target.value;
        if (elementValue.length > 0 && elementValue.length < 8) {
            let _paddedValue = this.numberPadding(elementValue, 8);
            if (event.target.id === 'contractNumber') {
                this.apiReverseFormGroup.controls['contractNumber'].setValue(_paddedValue.toUpperCase());
            }
        }
        this.inputParamsServiceCoverSearch.ContractNumber = '';
        this.inputParamsServiceCoverSearch.ContractName = '';
        if (this.apiReverseFormGroup.controls['contractNumber'].value !== null && this.apiReverseFormGroup.controls['contractNumber'].value.toString().trim() !== '') {
            /*if (this.contractData && this.contractData.ContractNumber === elementValue) {
                this.isContractDisabled = false;
                return;
            }*/
            let data = [{
                'table': 'contract',
                'query': { 'ContractNumber': this.apiReverseFormGroup.controls['contractNumber'].value },
                'fields': ['BusinessCode', 'ContractNumber', 'ContractName', 'CountryCode']
            }];
            this.ajaxSource.next(this.ajaxconstant.START);
            this.lookUpRecord(JSON.parse(JSON.stringify(data)), 5).subscribe(
                (e) => {
                    if (e['results'] && e['results'].length > 0 && e['results'][0].length > 0) {
                        this.apiReverseFormGroup.controls['contractDesc'].setValue(e['results'][0][0].ContractName);

                        this.inputParamsServiceCoverSearch.ContractNumber = this.apiReverseFormGroup.controls['contractNumber'].value;
                        this.inputParamsServiceCoverSearch.ContractName = e['results'][0][0].ContractName;
                        this.inputParamsPremise.ContractNumber = this.apiReverseFormGroup.controls['contractNumber'].value;
                        this.inputParamsPremise.ContractName = e['results'][0][0].ContractName;

                        if (this.mode === 'Contract') {
                            this.fetchBranchDetails(e['results'][0][0], true);
                        } else if (this.mode === 'Premise') {
                            this.onPremiseBlur();
                        } else if (this.mode === 'Service') {
                            this.onProductBlur();
                        }
                        this.cbb.disableComponent(true);

                    } else {
                        e['errorMessage'] = ErrorConstant.Message.RecordNotFound;
                        this.errorService.emitError(e);
                        this.apiReverseFormGroup.controls['contractNumber'].setValue('');
                        this.apiReverseFormGroup.controls['contractDesc'].setValue('');
                    }
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    this.isContractDisabled = false;

                },
                (error) => {
                    error['errorMessage'] = error['errorMessage'] || ErrorConstant.Message.ErrorFetchingRecord;
                    this.errorService.emitError(error);
                    this.apiReverseFormGroup.controls['contractNumber'].setValue('');
                    this.apiReverseFormGroup.controls['contractDesc'].setValue('');
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    this.isContractDisabled = false;
                }
            );
        } else {
            this.isContractDisabled = false;
        }
    };

    public onPremiseBlur(): any {
        this.inputParamsServiceCoverSearch.PremiseNumber = '';
        this.inputParamsServiceCoverSearch.PremiseName = '';
        if (this.apiReverseFormGroup.controls['premiseNumber'].value !== null && this.apiReverseFormGroup.controls['premiseNumber'].value.toString().trim() !== '' && this.apiReverseFormGroup.controls['contractNumber'].value !== null && this.apiReverseFormGroup.controls['contractNumber'].value.toString().trim() !== '') {
            this.isContractDisabled = true;
            let data = [{
                'table': 'Premise',
                'query': { 'ContractNumber': this.apiReverseFormGroup.controls['contractNumber'].value, 'PremiseNumber': this.apiReverseFormGroup.controls['premiseNumber'].value },
                'fields': ['BusinessCode', 'PremiseNumber', 'PremiseName']
            }];
            this.ajaxSource.next(this.ajaxconstant.START);
            this.lookUpRecord(data, 5).subscribe(
                (e) => {
                    if (e['results'] && e['results'].length > 0 && e['results'][0].length > 0) {
                        if (this.mode === 'Premise') {
                            this.fetchAPIDetails();
                        } else if (this.mode === 'Service') {
                            //this.onProductBlur();
                        }
                        this.apiReverseFormGroup.controls['premiseDesc'].setValue(e['results'][0][0].PremiseName);
                        this.inputParamsServiceCoverSearch.PremiseNumber = this.apiReverseFormGroup.controls['premiseNumber'].value;
                        this.inputParamsServiceCoverSearch.PremiseName = e['results'][0][0].PremiseName;
                    } else {
                        e['errorMessage'] = ErrorConstant.Message.RecordNotFound;
                        this.errorService.emitError(e);
                        //this.apiReverseFormGroup.controls['premiseNumber'].setValue('');
                    }
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    this.isContractDisabled = false;

                },
                (error) => {
                    error['errorMessage'] = error['errorMessage'] || ErrorConstant.Message.ErrorFetchingRecord;
                    this.errorService.emitError(error);
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    this.isContractDisabled = false;
                    //this.apiReverseFormGroup.controls['contractNumber'].setValue('');
                }
            );
        }

    }

    public onProductBlur(): any {
        this.inputParamsServiceCoverSearch.ProductCode = '';
        if (this.apiReverseFormGroup.controls['productCode'].value !== null && this.apiReverseFormGroup.controls['productCode'].value.toString().trim() !== '' && this.apiReverseFormGroup.controls['contractNumber'].value !== null && this.apiReverseFormGroup.controls['contractNumber'].value.toString().trim() !== '' && this.apiReverseFormGroup.controls['premiseNumber'].value !== null && this.apiReverseFormGroup.controls['premiseNumber'].value.toString().trim() !== '') {
            this.isContractDisabled = true;
            let productData = [{
                'table': 'Product',
                'query': { 'ProductCode': this.apiReverseFormGroup.controls['productCode'].value },
                'fields': ['BusinessCode', 'ProductDesc']
            }];
            this.ajaxSource.next(this.ajaxconstant.START);
            this.lookUpRecord(productData, 100).subscribe(
                (e) => {
                    if (e['results'] && e['results'].length > 0 && e['results'][0].length > 0) {
                        this.apiReverseFormGroup.controls['productDesc'].setValue(e['results'][0][0].ProductDesc);
                        let data = [{
                            'table': 'ServiceCover',
                            'query': { 'ContractNumber': this.apiReverseFormGroup.controls['contractNumber'].value, 'PremiseNumber': this.apiReverseFormGroup.controls['premiseNumber'].value, 'ProductCode': this.apiReverseFormGroup.controls['productCode'].value },
                            'fields': ['BusinessCode', 'ContractNumber', 'PremiseNumber', 'PremiseName', 'ProductCode', 'ServiceVisitFrequency']
                        }];
                        this.lookUpRecord(data, 5).subscribe(
                            (e) => {
                                if (e['results'] && e['results'].length > 0 && e['results'][0].length > 0) {
                                    if (this.mode === 'Service') {
                                        if (e['results'][0].length === 1) {
                                            this.serviceCoverRowID = e['results'][0][0].ttServiceCover;
                                            this.inputParamsServiceCoverSearch.ProductCode = e['results'][0][0].ProductCode;
                                            this.fetchAPIDetails();
                                        } else {
                                            this.inputParamsServiceCoverSearch.ProductCode = e['results'][0][0].ProductCode;
                                            this.serviceAutoOpen = true;
                                            setTimeout(() => {
                                                this.serviceAutoOpen = false;
                                            });
                                        }
                                    }
                                } else {
                                    e['errorMessage'] = ErrorConstant.Message.RecordNotFound;
                                    this.errorService.emitError(e);
                                    //this.apiReverseFormGroup.controls['premiseNumber'].setValue('');
                                }
                                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                                this.isContractDisabled = false;
                            },
                            (error) => {
                                error['errorMessage'] = error['errorMessage'] || ErrorConstant.Message.ErrorFetchingRecord;
                                this.errorService.emitError(error);
                                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                                this.isContractDisabled = false;
                                //this.apiReverseFormGroup.controls['contractNumber'].setValue('');
                            }
                        );
                    } else {
                        e['errorMessage'] = ErrorConstant.Message.RecordNotFound;
                        this.errorService.emitError(e);
                        this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                        this.isContractDisabled = false;

                    }

                },
                (error) => {
                    error['errorMessage'] = error['errorMessage'] || ErrorConstant.Message.ErrorFetchingRecord;
                    this.errorService.emitError(error);
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);

                }
            );

        }

    }

    public enableForm(): void {
        this.isFormEnabled = true;
    }

    public disableForm(): void {
        this.isFormEnabled = false;
        this.apiReverseFormGroup.reset();
        this.cbb.disableComponent(false);
    }

    public onCancel(): void {
        this.apiReverseFormGroup.markAsPristine();
        this.resetParams();
    }

    public resetParams(): void {
        this.inputParamsServiceCoverSearch = {
            'parentMode': 'Search',
            'businessCode': '',
            'countryCode': '',
            'ContractNumber': '',
            'ContractName': '',
            'PremiseNumber': '',
            'PremiseName': '',
            'ProductCode': '',
            'ProductDesc': '',
            'showAddNew': false
        };
        this.inputParamsPremise = {
            'parentMode': 'Search',
            'ContractNumber': '',
            'ContractName': '',
            'showAddNew': false
        };
        this.serviceCoverRowID = '';
    }

    public toUpperCase(event: any): void {
        let target = event.target.getAttribute('formControlName');
        let elementValue = event.target.value;
        this.apiReverseFormGroup.controls[target].setValue(elementValue.toUpperCase());
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
    *   Alerts user when user is moving away without saving the changes. // CR implementation
    */
    @ViewChild('routeAwayComponent') public routeAwayComponent;
    public canDeactivate(): Observable<boolean> {
        this.routeAwayGlobals.setSaveEnabledFlag(this.apiReverseFormGroup.dirty);
        if (this.routeAwayComponent) {
            return this.routeAwayComponent.canDeactivate();
        }
    }
    public routeAwayUpdateSaveFlag(): void {
        this.apiReverseFormGroup.statusChanges.subscribe((value: any) => {
            if (this.apiReverseFormGroup.valid === true || this.isFormValid === true) {
                this.routeAwayGlobals.setSaveEnabledFlag(true);
            }
        });
    }

}
