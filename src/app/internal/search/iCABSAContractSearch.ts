import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AjaxObservableConstant } from './../../../shared/constants/ajax-observable.constant';
import { TableComponent } from './../../../shared/components/table/table';
import { Logger } from '@nsalaun/ng2-logger';
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
import { Utils } from '../../../shared/services/utility';
import { ContractActionTypes } from '../../../app/actions/contract';
import { CBBService } from '../../../shared/services/cbb.service';// CR Changes
import { Observable } from 'rxjs/Rx';
import { ContractManagementModuleRoutes } from '../../base/PageRoutes';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';

@Component({

    templateUrl: 'iCABSAContractSearch.html'
})
export class ContractSearchComponent implements OnInit, AfterViewInit, OnDestroy {


    @ViewChild('contractTable') contractTable: TableComponent;
    @ViewChild('searchButton') searchButton: any;
    @Input() inputParams: any;

    public enableAccountSearch: boolean = true;
    public grdAccountDetail: boolean = false;
    public grdContractSearch: boolean = true;
    public grdPostcodeDetail: boolean = false;
    public statusSearchType: boolean = false;
    public expirySearchType: boolean = false;
    public specificBranch: boolean = false;

    public isRequesting: boolean = false;
    public selectedrowdata: any;
    public method: string = 'contract-management/search';
    public module: string = 'contract';
    public operation: string = 'Application/iCABSAContractSearch';
    public search: URLSearchParams;
    public pagination: boolean = true;
    public pagesize: string = '10';
    public pagecurrent: string = '1';
    public countryCode: any;
    public businessCode: any;
    public branchCode: any;
    public status: any = 'All';
    public expiry: any = 'All';
    public showAddNew: boolean = false;
    public showBranch: boolean = true;
    public showBusiness: boolean = true;
    public showCountry: boolean = true;
    public enableAddNew: boolean = false;
    public storeSubscription: Subscription;
    public translateSubscription: Subscription;

    public searchFilter: any = '';
    public searchValue: any;
    private loggedInBranch: string = '';
    public branchValue: any;
    public groupNumber: string;
    public groupName: string;
    public maxlength: string = '20';
    public branchSelection: string;
    public accountNumber: string;
    public accountName: string;
    public postCode: string;
    public inputParamsForBranchSearch: any = {
        'parentMode': 'Contract-Search'
    };

    public title: string = 'Contract Search';
    public pageTitle: string;

    public countryCodeList: Array<any>;
    public businessCodeList: Array<any>;
    public branchCodeList: Array<any>;//CR Changes
    public statusList: Array<any> = [];
    public businessCodeListDisabled: boolean = false;//CR Changes
    public branchCodeListDisabled: boolean = false;//CR Changes

    public contractSearchType: Array<any> = [];

    public filter: Array<any> = [
        { 'Name Begins': '' },
        { 'Name Match': '' },
        { 'Number': '' }
    ];

    public isSearchDisabled: boolean = false;

    public dropdownSelectedIndex: Object = {
        businessCode: 0,
        countryCode: 0
    };

    public itemsPerPage: number = 10;
    public page: number = 1;
    public columns: Array<any>;
    public rows: Array<any> = [];
    public rowmetadata: Array<any> = [];
    private contractStoreData: Object;
    private error: any;
    public buttonTranslatedText: any = {// CR Changes
        'search': 'Search',
        'cancel': 'Cancel',
        'addNew': 'Add New',
        'all': 'All'
    };

    public disableCountry: any = null;
    public disableBusinessCode: any = null;
    public resetRowId: boolean = false;

    public ajaxSource = new BehaviorSubject<any>(0);
    public ajaxSource$;
    public branchSubscription: Subscription;

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
        private _logger: Logger,
        private translate: TranslateService,
        private localeTranslateService: LocaleTranslationService,
        private util: Utils,
        private cbbService: CBBService,//CR Changes
        private ellipsis: EllipsisComponent,
        private ajaxconstant: AjaxObservableConstant,
        private httpService: HttpService) {
        this.storeSubscription = store.select('contract').subscribe(data => {
            if (data !== null && data['data'] && !(Object.keys(data['data']).length === 0 && data['data'].constructor === Object)) {
                this.contractStoreData = data['data'];
            }
        });
    }

    ngOnInit(): void {
        this.getLoggedInBranch();

        this.searchValue = '';
        this.branchValue = '';
        this.status = 'All';
        this.expiry = 'all';
        this.dropdownSelectedIndex['branchCode'] = 0;
        this.dropdownSelectedIndex['businessCode'] = 0;
        this.dropdownSelectedIndex['countryCode'] = 0;
        this.enableAddNew = false;

        // Set Country and Business list
        this.setDefaultCountryBusinessCode();//CR Changes
        this.countryCodeList = this.cbbService.getCountryList();//CR Changes
        this.businessCodeList = this.cbbService.getBusinessListByCountry(this.countryCode);//CR Changes
        this.branchCodeList = this.cbbService.getBranchListByCountryAndBusiness(this.countryCode, this.businessCode);//CR Changes
        this.localeTranslateService.setUpTranslation();
        this.translateSubscription = this.localeTranslateService.ajaxSource$.subscribe(event => {
            if (event !== 0) {
                this.statusList = [];
                this.contractSearchType = [];
                this.setPageTitle();
                this.setTableTitle();
                this.buildStatusOptions();
                this.buildSearchOptions();
                this.fetchTranslationContent();
                if (this.translateSubscription) {
                    this.translateSubscription.unsubscribe();
                }
            }
        });
        this.ajaxSource$ = this.ajaxSource.asObservable();
    }

    ngAfterViewInit(): void {
        // TODO
        //this.fetchTranslationContent();
    }

    ngOnDestroy(): void {
        // TODO
        this.storeSubscription.unsubscribe();
        if (this.translateSubscription) {
            this.translateSubscription.unsubscribe();
        }
        if (this.branchSubscription) {
            this.branchSubscription.unsubscribe();
        }
    }

    public fetchTranslationContent(): void {
        Observable.forkJoin(
            this.getTranslatedValue('All', null),
            this.getTranslatedValue('Add New', null),
            this.getTranslatedValue('Own Branch', null),
            this.getTranslatedValue('All Branches', null),
            this.getTranslatedValue('Name begins', null),
            this.getTranslatedValue('Name matches', null),
            this.getTranslatedValue('Number', null)
        ).subscribe((data) => {
            if (data[0]) {
                this.buttonTranslatedText.all = data[0];
            }
            if (data[1]) {
                this.buttonTranslatedText.addNew = data[1];
            }
            if (data[2]) {
                this.filter['Own Branch'] = data[2];
                this.branchSelection = data[2];
            }
            if (data[3]) {
                this.filter['All Branches'] = data[3];
            }
            if (data[4]) {
                this.filter['Name Begins'] = data[4];
                this.contractSearchType.push(data[4]);
                this.searchFilter = data[4];
            }
            if (data[5]) {
                this.filter['Name Matches'] = data[5];
                this.contractSearchType.push(data[5]);
            }
            if (data[6]) {
                this.filter['Number'] = data[6];
                this.contractSearchType.push(data[6]);
            }
        });
    }

    public onBranchDataReceived(obj: any): void {
        this.branchValue = obj.BranchNumber;
    }

    public getTranslatedValue(key: any, params: any): any {
        if (params) {
            return this.translate.get(key, { value: params });
        } else {
            return this.translate.get(key);
        }

    }

    public getInstantTranslatedValue(key: any, params: any): any {
        if (params) {
            return this.translate.instant(key, { value: params });
        } else {
            return this.translate.instant(key);
        }

    }

    public buildStatusOptions(): void {
        if (this.inputParams && this.inputParams.parentMode === 'Search-Inactive') {
            this.statusList = [
                {
                    value: 'T',
                    text: 'Terminated'
                },
                {
                    value: 'FT',
                    text: 'Forward Terminated'
                }
            ];
            this.status = 'T';
        } else {
            this.statusList = [
                {
                    value: 'All',
                    text: 'All'
                },
                {
                    value: 'AllCurrent',
                    text: 'Current (All)'
                },
                {
                    value: 'L',
                    text: 'Current'
                },
                {
                    value: 'FL',
                    text: 'Forward Current'
                },
                {
                    value: 'T',
                    text: 'Terminated'
                },
                {
                    value: 'FT',
                    text: 'Forward Terminated'
                },
                {
                    value: 'PT',
                    text: 'Pending Termination'
                },
                {
                    value: 'C',
                    text: 'Cancelled'
                }
            ];
        }
    }

    public buildSearchOptions(): void {
        if (this.inputParams && this.inputParams.parentMode === 'ProspectPipeline') {
            Observable.forkJoin(
                this.getTranslatedValue('Postcode Begins', null),
                this.getTranslatedValue('Postcode Matches', null)
            ).subscribe((data) => {
                if (data[0]) {
                    this.contractSearchType.push(data[0]);
                }
                if (data[1]) {
                    this.contractSearchType.push(data[1]);;
                }
            });
        }
    }

    public clearRowId(): void {
        this.resetRowId = true;
        setTimeout(() => {
            this.resetRowId = false;
        });
    }

    public setUI(parentMode: string): void {
        this.setPageTitle();
        this.setTableTitle();
        if (!this.inputParams.contractPostcode) {
            this.grdPostcodeDetail = false;
        } else {
            this.grdContractSearch = false;
        }
        if (typeof this.inputParams['enableAccountSearch'] !== 'undefined') {
            this.enableAccountSearch = this.inputParams['enableAccountSearch'];
        } else {
            this.enableAccountSearch = true;
        }
        if (this.inputParams.accountNumber && this.enableAccountSearch === true) {
            this.accountNumber = this.inputParams.accountNumber;
            this.accountName = this.inputParams.accountName;
            this.grdAccountDetail = true;
        } else {
            this.accountNumber = '';
            this.accountName = '';
            this.grdAccountDetail = false;
        }
    }

    public setTableTitle(): void {
        let searchTitle = 'Search';
        this.getTranslatedValue('Search', null).subscribe((res: string) => {
            if (res) {
                searchTitle = res;
            }
        });
        Observable.forkJoin(
            this.getTranslatedValue('Contract', null),
            this.getTranslatedValue('Job', null),
            this.getTranslatedValue('Product Sale', null)
        ).subscribe((data) => {
            switch (this.inputParams && this.inputParams.currentContractType) {
                case 'J':
                    this.title = data[1] + ' ' + searchTitle;
                    break;
                case 'P':
                    this.title = data[2] + ' ' + searchTitle;
                    break;
                default:
                    this.title = data[0] + ' ' + searchTitle;
            }
        });
        if (this.inputParams && this.inputParams.parentMode) {
            switch (this.inputParams.parentMode) {
                case 'PostcodeSearch':
                    this.getTranslatedValue('Contracts Matching Postcode', null).subscribe((res: string) => {
                        if (res) {
                            this.title = res;
                        } else {
                            this.title = 'Contracts Matching Postcode';
                        }
                    });
                    break;
                case 'Account':
                case 'LookUp-All':
                case 'Prospect':
                case 'LookUp-String':
                case 'ContractCopy':
                case 'LookUp-ProspectConversion':
                    this.getTranslatedValue('Contract/Job/Product Sales Search', null).subscribe((res: string) => {
                        if (res) {
                            this.title = res;
                        } else {
                            this.title = 'Contract/Job/Product Sales Search';
                        }
                    });
                    this.getTranslatedValue('Contract/Job/Product Sales Search', null).subscribe((res: string) => {
                        if (res) {
                            this.pageTitle = res;
                        } else {
                            this.pageTitle = 'Contract/Job/Product Sales Search';
                        }
                    });
                    break;
            }
        }
    }
    public setPageTitle(): void {
        let searchTitle = 'Search';
        this.getTranslatedValue('Search', null).subscribe((res: string) => {
            if (res) {
                searchTitle = res;
            }
            Observable.forkJoin(
                this.getTranslatedValue('Contract', null),
                this.getTranslatedValue('Job', null),
                this.getTranslatedValue('Product Sale', null)
            ).subscribe((data) => {
                switch (this.inputParams && this.inputParams.currentContractType) {
                    case 'J':
                        this.pageTitle = data[1] + ' ' + searchTitle;
                        this.statusSearchType = false;
                        this.expirySearchType = true;
                        break;
                    case 'P':
                        this.pageTitle = data[2] + ' ' + searchTitle;
                        this.statusSearchType = false;
                        this.expirySearchType = false;
                        break;
                    default:
                        this.pageTitle = data[0] + ' ' + searchTitle;
                        this.statusSearchType = true;
                        this.expirySearchType = false;
                }
            });
        });

    }


    public updateView(params: any): void {
        this.zone.run(() => {
            this.inputParams = params;
            if (this.inputParams && this.inputParams.showAddNew !== undefined) {
                this.showAddNew = true;
            }
            this.setUI(this.inputParams.parentMode);
            this.buildStatusOptions();
            this.inputParams.module = this.module;
            this.inputParams.method = this.method;
            this.inputParams.operation = this.operation;
            this.showCountry = true;
            this.showBusiness = true;
            this.showBranch = true;

            // Set Default From CBB
            this.countryCode = this.util.getCountryCode();
            this.countryOnChangeEffect(this.countryCode);
            this.businessCode = this.util.getBusinessCode();
            this.businessOnChangeEffect(this.countryCode, this.businessCode);
            this.branchCode = parseInt(this.util.getBranchCode(), 10);
            if (this.inputParams.parentMode === 'LookUp-CopyContractNumber') {
                this.showAddNew = false;
                this.inputParams.isCopy = true;
                this.inputParams.showBusiness = false;
                this.inputParams.showCountry = false;
            }
            if (typeof params.showAddNew !== 'undefined') {
                this.showAddNew = params.showAddNew;
            }
            if (typeof params.showCountry !== 'undefined' && params.showCountry === false) {
                this.showCountry = params.showCountry;
                this.enableAddNew = false;
            } else {
                this.enableAddNew = false;
                if (this.countryCode !== 'All' && this.businessCode !== 'All' && this.branchCode !== 'All') {
                    this.enableAddNew = true;
                }
            }
            if (typeof params.showBusiness !== 'undefined' && params.showBusiness === false) {
                this.showBusiness = params.showBusiness;
                this.enableAddNew = false;
            } else {
                this.enableAddNew = false;
                if (this.countryCode !== 'All' && this.businessCode !== 'All' && this.branchCode !== 'All') {
                    this.enableAddNew = true;
                }
            }

            if (this.inputParams.hasOwnProperty('initEmpty')) {
                if (this.inputParams.initEmpty) this.clearTable();
            }

            /*if (this.contractStoreData && !(Object.keys(this.contractStoreData).length === 0 && this.contractStoreData.constructor === Object)) {
                this.setFilterValues();
                this.search.set('ContractNumber', this.contractStoreData['ContractNumber']);
                this.inputParams.search = this.search;
                this.isSearchDisabled = true;
                this.contractTable.loadTableData(this.inputParams);
            }*/

            if (params['parentMode'] === 'InvGrpPremiseMaintenance') {
                this.disableCountry = true;
                this.disableBusinessCode = true;
            }
            if (this.grdAccountDetail === true || this.grdPostcodeDetail === true) {
                this.loadData();
            }

            //Fixing for IUI-15412 starts
            if (this.inputParams['accountNumber']) {
                if (this.inputParams['accountNumber'] !== '' && this.businessCode !== 'All' && this.branchCode !== 'All' && this.countryCode !== 'All') {
                    let queryParams = new URLSearchParams();
                    queryParams.set(this.serviceConstants.BusinessCode, this.businessCode);
                    queryParams.set(this.serviceConstants.CountryCode, this.countryCode);
                    let lookupQuery: any;
                    queryParams.set(this.serviceConstants.Action, '3');
                    lookupQuery = [{
                        'table': 'Account',
                        'query': { 'AccountNumber': this.inputParams['accountNumber'], 'BusinessCode': this.businessCode },
                        'fields': ['AccountName']
                    }
                    ];
                    this.ajaxSource.next(this.ajaxconstant.START);
                    this.httpService.lookUpRequest(queryParams, lookupQuery).subscribe(
                        value => {
                            if (value.error) {
                                return;
                            }
                            if (value.results) {
                                if (value.results.length > 0) {
                                    if (value.results[0].length > 0) {
                                        if (value.results[0][0].AccountName) {
                                            this.accountName = value.results[0][0].AccountName;
                                        }
                                    }
                                }
                            }
                        },
                        error => {
                            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                        },
                        () => {
                            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                        }
                    );
                }
            }
            //Fixing for IUI-15412 ends
        });


    }

    public loadData(): void {
        if (this.inputParams) {
            this.onBlur({ target: '' });
            this.setFilterValues();
            this.columns = new Array();
            this.buildTableColumns();
            this.inputParams.search = this.search;
            this.isSearchDisabled = true;
            this.contractTable.loadTableData(this.inputParams);
        }
    }

    public filterOnChange(): void {
        switch (this.searchFilter) {
            case this.filter['Name Begins']:
            case this.filter['Name Matches']:
                this.maxlength = '30';
                break;
            case this.filter['Number']:
                this.maxlength = '9';
                break;
        }
        //this.searchValue = ''; //Commenting this code due to IUI-5177.
    }

    public onBlur(event: any): void {
        let elementValue = event.target['value'] || this.searchValue;
        if (this.filter['Number'] === this.searchFilter && elementValue.length > 0 && elementValue.length < 8) {
            this.searchValue = this.util.numberPadding(elementValue, 8);
        }
    };

    public buildTableColumns(): void {
        if (this.branchSelection === this.filter['All Branches']) {
            this.columns.push({ title: this.getInstantTranslatedValue('Neg Branch', null), name: 'NegBranchNumber' });

        }

        Observable.forkJoin(
            this.getTranslatedValue('Country', null),
            this.getTranslatedValue('Bus.', null),
            this.getTranslatedValue('Branch', null),
            this.getTranslatedValue('Prefix', null),
            this.getTranslatedValue('Number', null),
            this.getTranslatedValue('Name', null),
            this.getTranslatedValue('Commence Date', null),
            this.getTranslatedValue('Anniv Date', null),
            this.getTranslatedValue('Inv Freq', null),
            this.getTranslatedValue('Status', null),
            this.getTranslatedValue('Expiry Date', null),
            this.getTranslatedValue('Account Number', null),
            this.getTranslatedValue('Account', null),
            this.getTranslatedValue('Account Address Line 1', null),
            this.getTranslatedValue('Account Postcode', null)
        ).subscribe((data) => {
            if (data[0]) {
                this.columns.push({ title: data[0], name: 'CountryCode', type: MntConst.eTypeCode });
            } else {
                this.columns.push({ title: 'Country', name: 'CountryCode', type: MntConst.eTypeCode });
            }
            if (data[1]) {
                this.columns.push({ title: data[1], name: 'BusinessCode', type: MntConst.eTypeCode });
            } else {
                this.columns.push({ title: 'Bus.', name: 'BusinessCode', type: MntConst.eTypeCode });
            }
            if (data[2]) {
                this.columns.push({ title: data[2], name: 'NegBranchNumber', type: MntConst.eTypeCode });
            } else {
                this.columns.push({ title: 'Branch', name: 'NegBranchNumber', type: MntConst.eTypeCode });
            }
            if (data[3]) {
                this.columns.push({ title: data[3], name: 'ContractTypePrefix', type: MntConst.eTypeCode });
            } else {
                this.columns.push({ title: 'Prefix', name: 'ContractTypePrefix', type: MntConst.eTypeCode });
            }
            if (data[4]) {
                this.columns.push({ title: data[4], name: 'ContractNumber', type: MntConst.eTypeCode });
            } else {
                this.columns.push({ title: 'Number', name: 'ContractNumber', type: MntConst.eTypeCode });
            }
            if (data[5]) {
                this.columns.push({ title: data[5], name: 'ContractName', type: MntConst.eTypeText });
            } else {
                this.columns.push({ title: 'Name', name: 'ContractName', type: MntConst.eTypeText });
            }
            if (data[6]) {
                this.columns.push({ title: data[6], name: 'ContractCommenceDate', type: MntConst.eTypeDate });
            } else {
                this.columns.push({ title: 'Commence Date', name: 'ContractCommenceDate', type: MntConst.eTypeDate });
            }
            if (data[7]) {
                this.columns.push({ title: data[7], name: 'InvoiceAnnivDate', type: MntConst.eTypeDate });
            } else {
                this.columns.push({ title: 'Anniv Date', name: 'InvoiceAnnivDate', type: MntConst.eTypeDate });
            }
            if (data[8]) {
                this.columns.push({ title: data[8], name: 'InvoiceFrequencyCode', type: MntConst.eTypeInteger });
            } else {
                this.columns.push({ title: 'Inv Freq', name: 'InvoiceFrequencyCode', type: MntConst.eTypeInteger });
            }
            if (this.inputParams.parentMode !== 'Search-Inactive') {
                if (data[9]) {
                    this.columns.push({ title: data[9], name: 'PortfolioStatusDesc', type: MntConst.eTypeText });
                } else {
                    this.columns.push({ title: 'Status', name: 'PortfolioStatusDesc', type: MntConst.eTypeText });
                }
            }
            if (data[10]) {
                this.columns.push({ title: data[10], name: 'ContractExpiryDate', type: MntConst.eTypeDate });
            } else {
                this.columns.push({ title: 'Expiry Date', name: 'ContractExpiryDate', type: MntConst.eTypeDate });
            }
            if (this.postCode || this.accountNumber) {
                //Fixing for IUI-15412 hiding account number field if account number is supplied
                if (this.accountNumber === '') {
                    if (data[11]) {
                        this.columns.push({ title: data[11], name: 'AccountNumber', type: MntConst.eTypeText });
                    } else {
                        this.columns.push({ title: 'Account Number', name: 'AccountNumber', type: MntConst.eTypeText });
                    }
                }
            } else {
                if (data[12]) {
                    this.columns.push({ title: data[12], name: 'AccountNumber', type: MntConst.eTypeText });
                } else {
                    this.columns.push({ title: 'Account', name: 'AccountNumber', type: MntConst.eTypeText });
                }
            }
            if (data[13]) {
                this.columns.push({ title: data[13], name: 'AccountAddressLine1', type: MntConst.eTypeText });
            } else {
                this.columns.push({ title: 'Account Address Line 1', name: 'AccountAddressLine1', type: MntConst.eTypeText });
            }
            if (data[14]) {
                this.columns.push({ title: data[14], name: 'AccountPostCode', type: MntConst.eTypeText });
            } else {
                this.columns.push({ title: 'Account Postcode', name: 'AccountPostCode', type: MntConst.eTypeText });
            }
            this.inputParams.columns = [];
            this.inputParams.columns = this.columns;
        });
    }

    public branchCodeOnChange(event: any): void {
        // Todo add translation
        if (this.countryCode !== 'All' && this.businessCode !== 'All' && this.branchCode !== 'All') {
            if (!(this.inputParams && this.inputParams.isCopy === true)) {
                this.enableAddNew = true;
            }
        } else {
            this.enableAddNew = false;
        }
        this.dropdownSelectedIndex['branchCode'] = event.target.selectedIndex;
        this.getLoggedInBranch();
    }

    public businessOnChange(event: any): void {
        // Todo add translation
        if (this.countryCode !== 'All' && this.businessCode !== 'All' && this.branchCode !== 'All') {
            this.enableAddNew = true;
        } else {
            this.enableAddNew = false;
        }
        this.dropdownSelectedIndex['businessCode'] = event.target.selectedIndex;
        this.businessOnChangeEffect(this.countryCode, this.businessCode);
    }

    public countryOnChange(event: any): void {
        // Todo add translation
        if (this.countryCode !== 'All' && this.businessCode !== 'All' && this.branchCode !== 'All') {
            this.enableAddNew = true;
        } else {
            this.enableAddNew = false;
        }
        this.dropdownSelectedIndex['countryCode'] = event.target.selectedIndex;
        this.countryOnChangeEffect(this.countryCode);
    }

    public search_onkeydown(event: any): void {
        if (event.keyCode === 13) {
            this.loadData();
        }
    }

    public branchOnChange(event: any): void {
        if (this.branchSelection === 'Specific Branch') {
            this.specificBranch = true;
        } else {
            this.specificBranch = false;
        }
    }

    public onAddNew(): void {
        this.updateCBB(this.countryCode, this.businessCode, this.branchCode);
        this.store.dispatch({
            type: ContractActionTypes.SAVE_CODE, payload:
            {
                business: this.businessCode,
                country: this.countryCode
            }
        });
        this.ellipsis.closeModal();
        setTimeout(() => {
            this.messageService.emitComponentMessage({
                updateMode: false,
                addMode: true,
                searchMode: false
            });
        }, 0);

    }

    public setFilterValues(): void {
        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.Action, '0');
        this.search.set(this.serviceConstants.BusinessCode, this.businessCode);

        if (parseInt(this.dropdownSelectedIndex['businessCode'], 10) === 0) {
            this.search.set(this.serviceConstants.BusinessCode, this.util.getBusinessCode());
        } else {
            this.search.set(this.serviceConstants.BusinessCode, this.businessCode);
        }
        if (!this.showBusiness && this.inputParams.businessCode) {
            this.search.set(this.serviceConstants.BusinessCode, this.inputParams.businessCode);
        }
        if (parseInt(this.dropdownSelectedIndex['countryCode'], 10) === 0) {
            this.search.set(this.serviceConstants.CountryCode, this.util.getCountryCode());
        } else {
            this.search.set(this.serviceConstants.CountryCode, this.countryCode);
        }
        if (!this.showCountry && this.inputParams.countryCode) {
            this.search.set(this.serviceConstants.CountryCode, this.inputParams.countryCode);
        }

        this.search.set(this.serviceConstants.BusinessCode, this.businessCode);//CR Changes
        this.search.set(this.serviceConstants.CountryCode, this.countryCode);//CR Changes
        if (this.branchCode !== 'All') {//CR Changes
            this.search.set('NegBranchNumber', this.branchCode);
        }

        if (this.inputParams.parentMode !== 'Account' &&
            this.inputParams.parentMode !== 'Prospect' &&
            this.inputParams.parentMode !== 'LookUp-All' &&
            this.inputParams.parentMode !== 'LookUp-String' &&
            this.inputParams.parentMode !== 'ContractCopy' &&
            this.inputParams.parentMode !== 'CallCentreSearch' &&
            this.inputParams.parentMode !== 'LookUp-ProspectConversion') {
            this.search.set('ContractTypeCode', this.inputParams.currentContractType !== null && this.inputParams.currentContractType !== undefined ? this.inputParams.currentContractType : 'C');
        } else {
            this.search.set('ContractTypeCode', '');
        }

        /*if (this.status !== '' &&
            this.status !== 'All' &&
            this.status !== 'Current (All)') {
            let status = '';
            switch (this.status) {
                case 'All':
                    status = 'All';
                    break;
                case 'Current (All)':
                    status = 'AllCurrent';
                    break;
                case 'Current':
                    status = 'L';
                    break;
                case 'Forward Current':
                    status = 'FL';
                    break;
                case 'Terminated':
                    status = 'T';
                    break;
                case 'Forward Terminated':
                    status = 'FT';
                    break;
                case 'Pending Termination':
                    status = 'PT';
                    break;
                case 'Cancelled':
                    status = 'C';
                    break;
                default:
                    status = 'All';
                    break;
            }
            this.search.set('PortfolioStatusCode', status);
        }*/
        //if (this.inputParams.currentContractType === 'C')
        this.search.set('PortfolioStatusCode', this.status);

        if (this.expirySearchType && this.expiry !== 'all') {
            switch (this.expiry) {
                case 'expired':
                    //this.search.set('search.op.ContractExpiryDate', 'LE');
                    //this.search.set('ContractExpiryDate', this.util.TodayAsDDMMYYYY());
                    this.search.set('Expiry', 'Expired');
                    break;
                case 'unexpired':
                    //this.search.set('search.op.ContractExpiryDate', 'GT');
                    //this.search.set('ContractExpiryDate', this.util.TodayAsDDMMYYYY());
                    this.search.set('Expiry', 'Unexpired');
                    break;
            }
        }

        if (this.grdPostcodeDetail) {
            this.search.set('ContractPostcode', this.searchValue);
            //this.search.set('jsonSortField', 'Contract.ContractNumber');//CR Changes
        } else if (this.grdAccountDetail) {
            this.search.set('AccountNumber', this.inputParams.accountNumber);
            //this.search.set('jsonSortField', 'Contract.ContractNumber');//CR Changes
        }

        if (this.searchFilter !== this.filter['Select']) {
            switch (this.searchFilter) {
                case this.filter['Name Begins']:
                    this.search.set('ContractName', this.searchValue);
                    this.search.set('search.op.ContractName', 'BEGINS');
                    //this.search.set('jsonSortField', 'Contract.ContractName');//CR Changes
                    break;
                case this.filter['Name Matches']:
                    this.search.set('ContractName', this.searchValue);
                    this.search.set('search.op.ContractName', 'CONTAINS');
                    //.search.set('jsonSortField', 'Contract.ContractName');//CR Changes
                    break;
                case this.filter['Number']:
                    this.search.set('ContractNumber', this.searchValue);
                    this.search.set('search.op.ContractNumber', 'GE');
                    //this.search.set('jsonSortField', 'Contract.ContractNumber');//CR Changes
                    break;
                case 'POSTCODE BEGINS':
                    this.search.set('Account.AccountPostcode', this.searchValue);
                    this.search.set('search.op.Account.AccountPostcode', 'BEGINS');
                    //this.search.set('jsonSortField', 'Contract.ContractNumber');//CR Changes
                    break;
                case 'POSTCODE MATCHES':
                    this.search.set('Account.AccountPostcode', this.searchValue);
                    //this.search.set('jsonSortField', 'Contract.ContractNumber');//CR Changes
                    break;
            }
        }


        if (this.countryCode === 'All' || this.businessCode === 'All') {
            this.search.set('jsonSortField', 'Contract.ContractName');//CR Changes
            this.search.set('sort', 'true');//CR Changes
        }

        if (this.inputParams.parentMode === 'LookUp-NatAx') {
            this.search.set('Account.NationalAccount', 'true');
        }
    }

    private getLoggedInBranch(): void {
        let businessCode = '',
            countryCode = '';
        if (parseInt(this.dropdownSelectedIndex['businessCode'], 10) === 0) {
            businessCode = this.util.getBusinessCode();
        } else {
            businessCode = this.businessCode;
        }
        if (!this.showBusiness && this.inputParams.businessCode) {
            businessCode = this.inputParams.businessCode;
        }
        if (parseInt(this.dropdownSelectedIndex['countryCode'], 10) === 0) {
            countryCode = this.util.getCountryCode();
        } else {
            countryCode = this.countryCode;
        }
        this.branchSubscription = this.util.getLoggedInBranch(businessCode, countryCode).subscribe((data) => {
            if (data.results && data.results[0] && data.results[0].length > 0) {
                this.loggedInBranch = data.results[0][0].BranchNumber;
            } else if (data.results && data.results[1] && data.results[1].length > 0) {
                this.loggedInBranch = data.results[1][0].BranchNumber;
            } else {
                this.loggedInBranch = '';
            }
        });
    }

    public tableDataLoaded(data: any): void {
        this.isSearchDisabled = false;
    }

    public selectedData(event: any): void {
        let businessCode = '',
            countryCode = '',
            branchCode = '';


        if (parseInt(this.dropdownSelectedIndex['businessCode'], 10) === 0) {
            businessCode = this.util.getBusinessCode();
        } else {
            businessCode = this.businessCode;
        }
        if (!this.showBusiness && this.inputParams.business) {
            businessCode = this.inputParams.business;
        }
        if (parseInt(this.dropdownSelectedIndex['countryCode'], 10) === 0) {
            countryCode = this.util.getCountryCode();
        } else {
            countryCode = this.countryCode;
        }
        if (!this.showCountry && this.inputParams.countryCode) {
            countryCode = this.inputParams.countryCode;
        }
        if (!(this.inputParams && this.inputParams.isCopy === true)) {
            this.updateCBB(event.row.CountryCode, event.row.BusinessCode, event.row.NegBranchNumber);
        }
        this.store.dispatch({
            type: ContractActionTypes.SAVE_CODE, payload:
            {
                business: event.row.BusinessCode,
                country: event.row.CountryCode
            }
        });
        this.ellipsis.sendDataToParent(event.row);
        if (this.inputParams.parentMode === 'Account') {
            if (event.row.ContractTypePrefix === 'P') {
                this._router.navigate([ContractManagementModuleRoutes.ICABSAPRODUCTSALEMAINTENANCE], { queryParams: { parentMode: 'Search', ContractNumber: event.row.ContractNumber, CurrentContractType: event.row.ContractTypePrefix } });
            } else if (event.row.ContractTypePrefix === 'J') {
                this._router.navigate([ContractManagementModuleRoutes.ICABSAJOBMAINTENANCE], { queryParams: { parentMode: 'Search', ContractNumber: event.row.ContractNumber, CurrentContractType: event.row.ContractTypePrefix } });
            } else {
                this._router.navigate([ContractManagementModuleRoutes.ICABSACONTRACTMAINTENANCE], { queryParams: { parentMode: 'Search', ContractNumber: event.row.ContractNumber, CurrentContractType: event.row.ContractTypePrefix } });
            }
        }
    }

    /************Start: CR Changes*************/
    private setDefaultCountryBusinessCode(): void {
        let defaultCountryCode = '',
            defaultBusinessCode = '';

        defaultCountryCode = this.util.getLogInCountryCode();

        this.countryCode = defaultCountryCode;
        this.countryOnChangeEffect(this.countryCode);
    }
    private countryOnChangeEffect(selectedCountryCode: string): void {
        this.businessCodeListDisabled = false;
        if (selectedCountryCode === 'All') {
            this.businessCodeList = [];
            this.businessCode = 'All';
            this.businessCodeListDisabled = true;
            //this.showAddNew = false;
            this.businessOnChangeEffect(selectedCountryCode, this.businessCode);
        } else {
            //this.showAddNew = true;
            this.businessCodeList = this.cbbService.getBusinessListByCountry(selectedCountryCode);
            this.businessCode = this.businessCodeList[0].value;
            this.businessOnChangeEffect(selectedCountryCode, this.businessCode);
        }
    }
    private businessOnChangeEffect(selectedCountryCode: string, selectedBusinessCode: string): void {
        this.branchCodeListDisabled = false;
        if (selectedBusinessCode === 'All') {
            this.branchCodeList = [];
            this.branchCode = 'All';
            this.branchCodeListDisabled = true;
            //this.showAddNew = false;
            this.enableAddNew = false;
        } else {
            //this.showAddNew = true;
            this.enableAddNew = true;
            this.branchCodeList = this.cbbService.getBranchListByCountryAndBusiness(selectedCountryCode, selectedBusinessCode);
            this.branchCode = this.branchCodeList[0] ? this.branchCodeList[0].value : '';
        }
    }
    private updateCBB(countryCode: string, businessCode: string, branchCode: string): void {
        if (countryCode !== 'All' && businessCode !== 'All' && branchCode !== 'All') {
            this.cbbService.setCountryCode(countryCode, true);
            this.cbbService.setBusinessCode(businessCode, false, true);
            this.cbbService.setBranchCode(branchCode, true);
            setTimeout(() => {
                this.cbbService.setBusinessCode(businessCode, false, true);
                this.cbbService.setBranchCode(branchCode, true);
            }, 0);
        }
    }
    /************End: CR Changes*************/

    public clearTable(): void {
        this.contractTable.clearTable();
    }
}
