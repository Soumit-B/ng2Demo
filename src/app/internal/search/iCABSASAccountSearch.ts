import { MessageService } from './../../../shared/services/message.service';
import { AccountMaintenanceActionTypes } from './../../actions/account-maintenance';
import { TableComponent } from './../../../shared/components/table/table';
import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, Input, NgZone, forwardRef, Inject, Renderer } from '@angular/core';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { EllipsisComponent } from './../../../shared/components/ellipsis/ellipsis';
import { Subscription } from 'rxjs/Subscription';
import { Http, URLSearchParams } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalStorageService } from 'ng2-webstorage';
import { TranslateService } from 'ng2-translate';
import { Store } from '@ngrx/store';
import { Utils } from '../../../shared/services/utility';
import { LocaleTranslationService } from '../../../shared/services/translation.service';
import { GlobalConstant } from '../../../shared/constants/global.constant';
import { ErrorConstant } from '../../../shared/constants/error.constant';
import { ErrorService } from '../../../shared/services/error.service';
import { HttpService } from '../../../shared/services/http-service';
import { AuthService } from '../../../shared/services/auth.service';
import { CBBService } from '../../../shared/services/cbb.service';// CR Changes
import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { Observable } from 'rxjs/Rx';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';

@Component({
    templateUrl: 'iCABSASAccountSearch.html'
})
export class AccountSearchComponent implements OnInit, AfterViewInit, OnDestroy {

    @ViewChild('accountTable') accountTable: TableComponent;
    @ViewChild('searchButton') searchButton: any;
    @Input() inputParams: any;

    public translateSubscription: Subscription;
    public storeSubscription: Subscription;
    public isRequesting: boolean = false;
    public selectedrowdata: any;
    public method: string = 'contract-management/search';
    public module: string = 'account';
    public operation: string = 'Application/iCABSAAccountSearch';
    public search: URLSearchParams;
    public pagination: boolean = true;
    public pagesize: string = '10';
    public pagecurrent: string = '1';
    public countryCode: any;
    public businessCode: any;
    public showAddNew: boolean = false;
    public showAddNewDisplay: boolean = true;
    public showBusinessCode: boolean = true;
    public showCountryCode: boolean = true;

    public searchFilter: string;
    public isSearchValueDisabled: boolean = false;
    public searchValue: any;
    public groupNumber: string;
    public groupName: string;
    public maxlength: string = '20';
    public isSearchDisabled: boolean = false;

    public grdSearchName: boolean = false;
    public grdAccountSearch: boolean = false;
    public grdPostcodeSearch: boolean = false;
    public grdGroupAccountDetail: boolean = false;

    public title: string = 'Account Search';
    public pageTitle: string;
    public screenHeaderTitle: string = 'Accounts Matching Name';

    public countryCodeList: Array<any>;
    public businessCodeList: Array<any>;
    public businessCodeListDisabled: boolean = false;//CR Changes
    public disableCountry: any = null;
    public itemsPerPage: number = 10;
    public page: number = 1;

    public dropdownSelectedIndex: Object = {
        businessCode: 0,
        countryCode: 0
    };

    public columns: Array<any> = [];

    public rowmetadata: Array<any> = [
        { name: 'LiveAccount', type: 'img' },
        { name: 'NationalAccount', type: 'img' }
    ];

    public rows: Array<any> = [];
    public localeData: any;
    public storeData: any;
    public buttonTranslatedText: any = {
        'search': 'Search',
        'cancel': 'Cancel',
        'addNew': 'Add New',
        'all': 'All'
    };

    public filter: Object = {
        select: '',
        nameBegins: '',
        nameMatches: '',
        postCode: '',
        number: ''
    };

    public resetRowId: boolean = false;
    public triggerCBBChange: boolean = true;
    private error: any;

    constructor(
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private zone: NgZone,
        private http: Http,
        private store: Store<any>,
        private errorService: ErrorService,
        private _httpService: HttpService,
        private _authService: AuthService,
        private _ls: LocalStorageService,
        private serviceConstants: ServiceConstants,
        private renderer: Renderer,
        private translate: TranslateService,
        private localeTranslateService: LocaleTranslationService,
        private ls: LocalStorageService,
        private messageService: MessageService,
        private util: Utils,
        private cbbService: CBBService,//CR Changes
        private ellipsis: EllipsisComponent
    ) {
        this.storeSubscription = store.select('account').subscribe(data => {
            this.storeData = data['data'];
        });
    }

    ngOnInit(): void {
        this.countryCodeList = [];
        this.businessCodeList = [];
        // Set Country and Business list
        this.setDefaultCountryBusinessCode();//CR Changes
        this.countryCodeList = this.cbbService.getCountryList();//CR Changes
        this.businessCodeList = this.cbbService.getBusinessListByCountry(this.countryCode);//CR Changes

        let pageTitle: string = '';
        this.pageTitle = 'Account Name/Number Search';
        this.translateSubscription = this.localeTranslateService.ajaxSource$.subscribe(event => {
            if (event !== 0) {
                this.fetchTranslationContent();
            }
            this.buildTableColumns();
        });
    }

    ngAfterViewInit(): void {
        //let event = new MouseEvent('click', {bubbles: true});
        //this.renderer.invokeElementMethod(this.searchButton.nativeElement, 'dispatchEvent', [event]);
        this.fetchTranslationContent();
    }

    ngOnDestroy(): void {
        this.searchValue = '';
        this.groupName = '';
        this.groupNumber = '';
        this.rows = [];
        if (this.storeSubscription)
            this.storeSubscription.unsubscribe();
        if (this.translateSubscription)
            this.translateSubscription.unsubscribe();
    }

    public onAddNew(): void {
        this.store.dispatch({
            type: AccountMaintenanceActionTypes.SAVE_CODE, payload:
            {
                business: (this.businessCode === 'All') ? this.util.getBusinessCode() : this.businessCode,
                country: (this.countryCode === 'All') ? this.util.getCountryCode() : this.countryCode
            }
        });
        this.messageService.emitMessage({
            updateMode: false,
            addMode: true,
            searchMode: false
        });
        this.ellipsis.closeModal();
        this.updateCBB(this.countryCode, this.businessCode);//CR Changes
    }

    public fetchTranslationContent(): void {
        Observable.forkJoin(
            this.getTranslatedValue('All', null),
            this.getTranslatedValue('Search', null),
            this.getTranslatedValue('Add New', null),
            this.getTranslatedValue('Select', null),
            this.getTranslatedValue('Name begins', null),
            this.getTranslatedValue('Name matches', null),
            this.getTranslatedValue('Number', null),
            this.getTranslatedValue('Post Code', null)
        ).subscribe((data) => {
            if (data[0]) {
                // this.businessCode = data[0];
                //this.countryCode = data[0];
                //this.buttonTranslatedText.all = data[0];
            }
            if (data[1]) {
                this.buttonTranslatedText.search = data[1];
            }
            if (data[2]) {
                this.buttonTranslatedText.addNew = data[2];
            }
            if (data[3]) {
                this.filter['select'] = data[3].toString().trim();
            }
            if (data[4]) {
                this.filter['nameBegins'] = data[4].toString().trim();
                this.searchFilter = data[4].toString().trim();
            }
            if (data[5]) {
                this.filter['nameMatches'] = data[5].toString().trim();
            }
            if (data[6]) {
                this.filter['number'] = data[6].toString().trim();
            }
            if (data[7]) {
                this.filter['postCode'] = data[7].toString().trim();
            }
        });
    }

    public buildTableColumns(): void {
        this.columns = [];
        Observable.forkJoin(
            this.getTranslatedValue('Country', null),
            this.getTranslatedValue('Business', null),
            this.getTranslatedValue('Account Number', null),
            this.getTranslatedValue('Account Name', null),
            this.getTranslatedValue('Address 1', null),
            this.getTranslatedValue('Address 4', null),
            this.getTranslatedValue('Postcode', null),
            this.getTranslatedValue('Live', null),
            this.getTranslatedValue('Nat Acc', null),
            this.getTranslatedValue('Address 2', null)
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
                this.columns.push({ title: data[2], name: 'AccountNumber', type: MntConst.eTypeText });
            } else {
                this.columns.push({ title: 'Account Number', name: 'AccountNumber', type: MntConst.eTypeText });
            }
            if (data[3]) {
                this.columns.push({ title: data[3], name: 'AccountName', type: MntConst.eTypeText });
            } else {
                this.columns.push({ title: 'Account Name', name: 'AccountName', type: MntConst.eTypeText });

            }
            if (data[4]) {
                this.columns.push({ title: data[4], name: 'AccountAddressLine1', type: MntConst.eTypeText });
            } else {
                this.columns.push({ title: 'Address 1', name: 'AccountAddressLine1', type: MntConst.eTypeText });
            }
            if (data[5]) {
                this.columns.push({ title: data[5], name: 'AccountAddressLine4', type: MntConst.eTypeText });
            } else {
                this.columns.push({ title: 'Address 4', name: 'AccountAddressLine4', type: MntConst.eTypeText });
            }
            if (data[6]) {
                this.columns.push({ title: data[6], name: 'AccountPostcode', type: MntConst.eTypeText });
            } else {
                this.columns.push({ title: 'Postcode', name: 'AccountPostcode', type: MntConst.eTypeText });
            }
            if (data[7]) {
                this.columns.push({ title: data[7], name: 'LiveAccount', type: MntConst.eTypeCheckBox });
            } else {
                this.columns.push({ title: 'Live', name: 'LiveAccount', type: MntConst.eTypeCheckBox });
            }
            if (data[8]) {
                this.columns.push({ title: data[8], name: 'NationalAccount', type: MntConst.eTypeCheckBox });
            } else {
                this.columns.push({ title: 'Nat Acc', name: 'NationalAccount', type: MntConst.eTypeCheckBox });
            }
            if (this.inputParams && (this.inputParams.parentMode === 'ContractSearch' || this.inputParams.parentMode === 'AccountSearch' || this.inputParams.parentMode === 'SOPPostcodeSearch')) {
                if (data[9]) {
                    this.columns.push({ title: data[9], name: 'AccountAddressLine2', type: MntConst.eTypeText });
                }
            }
        });
    }

    public setUI(parentMode: string): void {
        switch (parentMode) {
            case 'ContractSearch':
                this.title = 'Account Search';
                this.pageTitle = 'Select Existing Account To Add To';
                this.searchValue = this.inputParams.contractName;
                this.isSearchValueDisabled = this.inputParams.isSearchValueDisabled ? this.inputParams.isSearchValueDisabled : false;
                this.grdSearchName = true;
                this.grdAccountSearch = false;
                this.grdPostcodeSearch = false;
                this.setHeaderTitle();
                this.screenHeaderTitle = 'Select Existing Account To Add To';
                setTimeout(() => {
                    this.loadData();
                }, 0);
                break;
            case 'SOPPostcodeSearch':
                this.title = 'Potential Renegotiations';
                this.pageTitle = 'Accounts Matching Postcode For Potential Renegotiations';
                this.searchValue = this.inputParams.contractPostcode;
                this.grdSearchName = false;
                this.grdAccountSearch = false;
                this.grdPostcodeSearch = true;
                this.setHeaderTitle();
                break;
            case 'AccountSearch':
                this.title = 'Account Search';
                this.pageTitle = 'Account Name/Number Search';
                this.searchValue = this.inputParams.accountName;
                this.grdSearchName = false;
                this.grdAccountSearch = true;
                this.grdPostcodeSearch = false;
                this.setHeaderTitle();
                this.screenHeaderTitle = 'Accounts Matching Name';
                setTimeout(() => {
                    this.loadData();
                }, 0);
                break;
            case 'ContractManagement':
            case 'BusinessRuleMaintenance':
            case 'LookUp-Search':
                this.title = 'Account Search';
                this.grdSearchName = false;
                this.pageTitle = 'Accounts Matching Name';
                this.grdAccountSearch = true;
                this.grdPostcodeSearch = false;
                this.showAddNew = true;
                this.setHeaderTitle();
                break;
            case 'LookUp-NatAx':
                this.title = 'National Account Search';
                this.pageTitle = 'Account Name/Number Search';
                this.grdSearchName = false;
                this.grdAccountSearch = true;
                this.grdPostcodeSearch = false;
                this.setHeaderTitle();
                break;
            case 'ExistingAccountSearch':
                this.title = 'Existing Account Search';
                this.pageTitle = 'Account Name/Number Search';
                this.grdSearchName = false;
                this.grdAccountSearch = true;
                this.grdPostcodeSearch = false;
                this.setHeaderTitle();
                break;
            case 'ExistingAccountPipelineSearch':
                this.title = 'Existing Account Search';
                this.pageTitle = 'Account Name/Number Search';
                this.grdSearchName = false;
                this.grdAccountSearch = true;
                this.grdPostcodeSearch = false;
                this.setHeaderTitle();
                break;
            case 'LookUp-InterGroup':
                this.title = 'InterGroup Account Search';
                this.pageTitle = 'Account Name/Number Search';
                this.grdSearchName = false;
                this.grdAccountSearch = true;
                this.grdPostcodeSearch = false;
                this.setHeaderTitle();
                break;
            case 'InvoiceGroupMaintenanceSearch':
                this.title = 'Account Search';
                this.pageTitle = 'Account Name/Number Search';
                this.searchValue = this.inputParams.accountName;
                this.grdSearchName = false;
                this.grdAccountSearch = true;
                this.grdPostcodeSearch = false;
                this.showAddNewDisplay = false;
                this.setHeaderTitle();
                break;
            default:
                this.title = 'Account Search';
                this.pageTitle = 'Account Name/Number Search';
                this.grdSearchName = false;
                this.grdAccountSearch = true;
                this.grdPostcodeSearch = false;
                this.setHeaderTitle();
            //this.disableCountry = this.inputParams['disableCountry'] ? this.inputParams['disableCountry'] : false;
            //this.businessCodeListDisabled = this.inputParams['businessCodeListDisabled'] ? this.inputParams['businessCodeListDisabled'] : false;
        }
        if (this.inputParams.groupAccountNumber) {
            this.grdGroupAccountDetail = true;
            this.groupName = this.inputParams.groupName;
            this.groupNumber = this.inputParams.groupAccountNumber;
            this.loadData();
        } else {
            this.grdGroupAccountDetail = false;
            this.groupName = '';
            this.groupNumber = '';
        }

        this.filterOnChange(this.inputParams.shouldRetainFilter ? this.inputParams.shouldRetainFilter : false);
    }

    public setHeaderTitle(): void {
        if (this.grdAccountSearch === true) {
            this.screenHeaderTitle = 'Account Name/Number Search';
        } else if (this.grdSearchName === true) {
            this.screenHeaderTitle = 'Accounts Matching Name';
        } else if (this.grdPostcodeSearch === true) {
            this.screenHeaderTitle = 'Accounts Matching Postcode For Potential Renegotiations';
        }
    }

    public updateView(params: any): void {
        this.inputParams = params;
        if (this.inputParams['showAddNewDisplay'] !== null &&
            this.inputParams['showAddNewDisplay'] !== '' &&
            this.inputParams['showAddNewDisplay'] !== undefined) {
            this.showAddNewDisplay = this.inputParams['showAddNewDisplay'];
        }
        if (this.inputParams['triggerCBBChange'] !== null &&
            this.inputParams['triggerCBBChange'] !== '' &&
            this.inputParams['triggerCBBChange'] !== undefined) {
            this.triggerCBBChange = this.inputParams['triggerCBBChange'];
        }
        this.setUI(this.inputParams.parentMode);
        this.inputParams.module = this.module;
        this.inputParams.method = this.method;
        this.inputParams.operation = this.operation;

        if (this.inputParams && typeof this.inputParams.showCountryCode !== 'undefined') {
            this.showCountryCode = this.inputParams.showCountryCode;
        }

        if (this.inputParams && typeof this.inputParams.showBusinessCode !== 'undefined') {
            this.showBusinessCode = this.inputParams.showBusinessCode;
        }

        // Set COuntry And Business Code
        this.countryCode = this.util.getCountryCode();
        this.countryOnChangeEffect(this.countryCode);
        this.businessCode = this.util.getBusinessCode();
        // As per current requirement, we will display data when search screen opens

        this.searchValue = this.inputParams.searchValue ? this.inputParams.searchValue : this.searchValue;
        /*this.getTranslatedValue('All', null).subscribe((res: string) => {
            if (res) {
                this.businessCode = res;
                this.countryCode = res;
            }
            this.getTranslatedValue('Name begins', null).subscribe((res: string) => {
                    if (res) {
                        this.searchFilter = res;
                    }
                    this.dropdownSelectedIndex['countryCode'] = 0;
                    this.dropdownSelectedIndex['businessCode'] = 0;
                    //this.loadData();

                    if (this.storeData && this.storeData['data'] && this.storeData['data'].length > 0) {
                        this.setFilterValues();
                        this.search.set('AccountNumber', this.storeData['data'][0]['AccountNumber']);
                        this.inputParams.search = this.search;
                        this.isSearchDisabled = true;
                        this.accountTable.loadTableData(this.inputParams);
                    } else {
                        if (this.searchValue) {
                            this.loadData();
                        }
                    }
                });
        });*/
        //this.loadData();
    }

    public loadData(): void {
        //Check the filter values to be set
        this.buildTableColumns();
        this.setFilterValues();
        this.inputParams.search = this.search;
        this.isSearchDisabled = true;
        this.inputParams.module = this.module;
        this.inputParams.method = this.method;
        this.inputParams.operation = this.operation;
        this.accountTable.loadTableData(this.inputParams);
    }

    public tableDataLoaded(data: any): void {
        this.isSearchDisabled = false;
    }

    public search_onkeydown(event: any): void {
        if (event.keyCode === 13) {
            if (this.filter['number'] === this.searchFilter && this.searchValue.length > 0 && this.searchValue.length < 9) {
                this.searchValue = this.util.numberPadding(this.searchValue, 9);
            }
            this.loadData();
        }
    }

    public selectedData(event: any): void {
        let returnObj: any;
        this.updateCBB(event.row.CountryCode, event.row.BusinessCode);
        switch (this.inputParams.parentMode) {
            case 'ContractSearch':
            case 'ContractManagement':
            case 'LookUp-NatAx':
            case 'ExistingAccountSearch':
            case 'AccountSearch':
            case 'HistorySearch':
            case 'LookUp':
            case 'Lookup-UpdateParent':
            case 'LookUp-InterGroup':
                returnObj = {
                    'AccountNumber': event.row.AccountNumber,
                    'AccountName': event.row.AccountName
                };
                break;
            case 'ExistingAccountPipelineSearch':
                returnObj = {
                    'AccountNumber': event.row.AccountNumber,
                    'AccountName': event.row.AccountName,
                    'NextActionRequired': 'AccountSelected'
                };
                break;
            case 'LookUp-MergeFrom':
                returnObj = {
                    'FromAccountNumber': event.row.AccountNumber,
                    'FromAccountName': event.row.AccountName
                };
                break;
            case 'LookUp-MergeTo':
                returnObj = {
                    'ToAccountNumber': event.row.AccountNumber,
                    'ToAccountName': event.row.AccountName
                };
                break;
            case 'SOPPostcodeSearch':
                returnObj = {
                    'AccountNumber': event.row.AccountNumber,
                    'AccountName': event.row.AccountName,
                    'AccountAddressLine1': event.row.AccountAddressLine1,
                    'AccountAddressLine2': event.row.AccountAddressLine2,
                    'AccountAddressLine3': event.row.AccountAddressLine3,
                    'AccountAddressLine4': event.row.AccountAddressLine4,
                    'AccountAddressLine5': event.row.AccountAddressLine5,
                    'AccountPostcode': event.row.AccountPostcode,
                    'RenegInd': true
                };
                break;

            case 'LookUp-Search':
                returnObj = {
                    'SearchId': event.row.AccountNumber,
                    'SearchDesc': event.row.AccountName
                };
                break;
            case 'LookUp-CollectFrom':
                returnObj = {
                    'CollectFrom': event.row.AccountNumber,
                    'CollectFromName': event.row.AccountName
                };
                break;
            case 'GeneralSearch-Lookup':
                returnObj = {
                    'SearchValue': event.row.AccountNumber
                };
                break;
            case 'LookUp-CopyAccountNumber':
                returnObj = {
                    'CopyAccountNumber': event.row.AccountNumber
                };
                break;
            case 'CallCentreAnalysis':
                returnObj = {
                    'ViewByValue': event.row.AccountNumber,
                    'ViewByValueDesc': event.row.AccountName
                };
                break;
            case 'LookUp-CrossReference':
                returnObj = {
                    'CrossReferenceAccountNumber': event.row.AccountNumber,
                    'CrossReferenceAccountName': event.row.AccountName
                };
                break;
            default:
                returnObj = {
                    'AccountNumber': event.row.PaymentTypeCode,
                    'Object': event.row
                };
        }

        //this.getCodeData();
        this.store.dispatch({
            type: AccountMaintenanceActionTypes.SAVE_CODE, payload:
            {
                business: event.row.BusinessCode,
                country: event.row.CountryCode
            }
        });
        //
        setTimeout(() => {
            this.ellipsis.sendDataToParent(event.row);
        },0);
    }

    public getCodeData(): void {
        let businessCode = '';
        let countryCode = '';

        if (parseInt(this.dropdownSelectedIndex['businessCode'], 10) === 0) {
            businessCode = this.util.getLogInBusinessCode();
        } else {
            businessCode = this.businessCode;
        }

        if (parseInt(this.dropdownSelectedIndex['countryCode'], 10) === 0) {
            countryCode = this.util.getLogInCountryCode();
        } else {
            countryCode = this.countryCode;
        }

        this.store.dispatch({
            type: AccountMaintenanceActionTypes.SAVE_CODE, payload:
            {
                business: businessCode,
                country: countryCode
            }
        });
    }

    public businessOnChange(event: any): void {
        if (event.target.selectedIndex === 0) {
            this.businessCode = 'All';
        }
        else {
            this.dropdownSelectedIndex['businessCode'] = event.target.selectedIndex;
            this.businessCode = this.businessCodeList[event.target.selectedIndex - 1].value;
        }

        if (this.countryCode !== 'All' && this.businessCode !== 'All') {
            this.showAddNew = true;
        } else {
            this.showAddNew = false;
        }
    }

    public countryOnChange(event: any): void {
        if (event.target.selectedIndex === 0) {
            this.countryCode = 'All';
            this.countryOnChangeEffect(this.countryCode);
            return;
        }
        this.dropdownSelectedIndex['countryCode'] = event.target.selectedIndex;
        this.countryCode = this.countryCodeList[event.target.selectedIndex - 1].value;
        this.countryOnChangeEffect(this.countryCode);
    }

    public filterOnChange(shouldRetainFilter?: boolean): void {
        switch (this.searchFilter) {
            case this.filter['nameBegins']:
            case this.filter['nameMatches']:
                this.maxlength = '30';
                break;
            case this.filter['number']:
                this.maxlength = '9';
                break;
            case this.filter['postCode']:
                this.maxlength = '10';
                break;
        }
        if (!shouldRetainFilter) {
            this.searchValue = '';
        }
    }

    public clearRowId(): void {
        this.resetRowId = true;
        setTimeout(() => {
            this.resetRowId = false;
        });
    }

    public onAccountNumberBlur(event: any): void {
        let elementValue = event.target['value'] || this.searchValue;
        if (this.filter['number'] === this.searchFilter && elementValue.length > 0 && elementValue.length < 9) {
            this.searchValue = this.util.numberPadding(elementValue, 9);
        }
    }

    public setFilterValues(): void {
        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.Action, '0');

        /* if (parseInt(this.dropdownSelectedIndex['businessCode'], 0) === 0) {
             this.search.set(this.serviceConstants.BusinessCode, userCode.AuthorisedBusinesses[0]);
         } else {
             this.search.set(this.serviceConstants.BusinessCode, this.businessCode);
         }
         if (parseInt(this.dropdownSelectedIndex['countryCode'], 0) === 0) {
             this.search.set(this.serviceConstants.CountryCode, this.util.getLogInCountryCode());
         } else {
             this.search.set(this.serviceConstants.CountryCode, this.countryCode);
         }*/

        if (this.inputParams.businessCode) {
            this.search.set(this.serviceConstants.BusinessCode, this.inputParams.businessCode);
        } else {
            this.search.set(this.serviceConstants.BusinessCode, this.util.getBusinessCode());
        }

        if (this.inputParams.countryCode) {
            this.search.set(this.serviceConstants.CountryCode, this.inputParams.countryCode);
        } else {
            this.search.set(this.serviceConstants.CountryCode, this.util.getCountryCode());
        }

        if (this.showBusinessCode) {
            this.search.set(this.serviceConstants.BusinessCode, this.businessCode);//CR Changes
        }

        if (this.showCountryCode) {
            this.search.set(this.serviceConstants.CountryCode, this.countryCode);//CR Changes
        }

        this.search.set('NegBranchNumber', this.util.getBranchCode());

        switch (this.inputParams.parentMode) {
            case 'ContractSearch':
            case 'AccountSearch':
                switch (this.searchFilter) {

                    case this.filter['nameBegins']:
                        this.search.set('AccountName', this.searchValue);
                        this.search.set('search.op.AccountName', 'BEGINS');
                        this.search.set('search.sortby', 'AccountName');
                        //this.search.set('jsonSortField', 'AccountName');//CR Changes
                        break;
                    case this.filter['nameMatches']:
                        this.search.set('AccountName', this.searchValue);
                        this.search.set('search.op.AccountName', 'CONTAINS');
                        this.search.set('search.sortby', 'AccountName');
                        //this.search.set('jsonSortField', 'AccountName');//CR Changes
                        break;
                    case this.filter['number']:
                        this.search.set('AccountNumber', this.searchValue);
                        this.search.set('search.op.AccountNumber', 'GE');
                        this.search.set('search.sortby', 'AccountNumber');
                        //this.search.set('jsonSortField', 'AccountNumber');//CR Changes
                        break;
                    case this.filter['postCode']:
                        this.search.set('AccountPostCode', this.searchValue);
                        this.search.set('search.op.AccountPostCode', 'BEGINS');
                        this.search.set('search.sortby', 'AccountPostCode');
                        //this.search.set('jsonSortField', 'AccountPostCode');//CR Changes
                        break;
                }
                break;
            case 'SOPPostcodeSearch':
                this.search.set('AccountPostcode', this.searchValue);
                this.search.set('search.op.AccountPostcode', 'BEGINS');
                break;
            default:

                switch (this.searchFilter) {

                    case this.filter['nameBegins']:
                        this.search.set('AccountName', this.searchValue);
                        this.search.set('search.op.AccountName', 'BEGINS');
                        this.search.set('search.sortby', 'BusinessCode,AccountName');
                        //this.search.set('jsonSortField', 'AccountName');//CR Changes
                        break;
                    case this.filter['nameMatches']:
                        this.search.set('AccountName', this.searchValue);
                        this.search.set('search.op.AccountName', 'CONTAINS');
                        this.search.set('search.sortby', 'BusinessCode,AccountName');
                        //this.search.set('jsonSortField', 'AccountName');//CR Changes
                        break;
                    case this.filter['number']:
                        this.search.set('AccountNumber', this.searchValue);
                        this.search.set('search.op.AccountNumber', 'GE');
                        this.search.set('search.sortby', 'BusinessCode,AccountNumber');
                        //this.search.set('jsonSortField', 'AccountNumber');//CR Changes
                        break;
                    case this.filter['postCode']:
                        this.search.set('AccountPostCode', this.searchValue);
                        this.search.set('search.op.AccountPostCode', 'BEGINS');
                        this.search.set('search.sortby', 'BusinessCode,AccountPostCode');
                        //this.search.set('jsonSortField', 'AccountPostCode');//CR Changes
                        break;
                }

                if (this.inputParams.parentMode === 'LookUp-NatAx') {
                    this.search.set('NationalAccount', 'true');
                }
                if (this.inputParams.parentMode === 'LookUp-InterGroup') {
                    this.search.set('InterGroupAccount', 'true');
                }
        }

        if (this.countryCode === 'All' || this.businessCode === 'All') {
            this.search.set('jsonSortField', 'AccountName');//CR Changes
            this.search.set('sortPreference', 'true');//CR Changes
            this.search.set('sort', 'true');//CR Changes
        }
        if (this.inputParams.groupAccountNumber) {
            this.search.set('GroupAccountNumber', this.inputParams.groupAccountNumber);
        }

    }


    public getTranslatedValue(key: any, params: any): any {
        if (params) {
            return this.translate.get(key, { value: params });
        } else {
            return this.translate.get(key);
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
            this.showAddNew = false;
        } else {
            this.showAddNew = true;
            this.businessCodeList = this.cbbService.getBusinessListByCountry(selectedCountryCode);
            this.businessCode = this.businessCodeList[0].value;
        }
    }
    private updateCBB(countryCode: string, businessCode: string): void {
        let country = this.util.getCountryCode();
        let business = this.util.getBusinessCode();
        let branch = this.util.getBranchCode();
        if (countryCode !== 'All' && businessCode !== 'All') {
            if (this.triggerCBBChange) {
                this.cbbService.setCountryCode(countryCode, true);
                setTimeout(() => {
                    this.cbbService.setBusinessCode(businessCode, true, true);
                    if (country === countryCode && business === businessCode) {
                        setTimeout(() => {
                            this.cbbService.setBusinessCode(businessCode, false, true);
                            this.cbbService.setBranchCode(branch, true);
                        }, 0);
                    } else {
                        this.cbbService.setBranchCode(branch, true);
                    }
                }, 0);
            }
        }
    }
    /************End: CR Changes*************/
}
