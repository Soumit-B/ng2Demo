import { Component, NgZone, ViewChild, OnInit, OnDestroy, AfterViewInit, ElementRef } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { URLSearchParams } from '@angular/http';
import { Store } from '@ngrx/store';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
import { TranslateService } from 'ng2-translate';
import * as moment from 'moment';
import { LocaleTranslationService } from '../../../shared/services/translation.service';
import { HttpService } from '../../../shared/services/http-service';
import { ErrorService } from '../../../shared/services/error.service';
import { MessageService } from '../../../shared/services/message.service';
import { GridComponent } from './../../../shared/components/grid/grid';
import { AccountSearchComponent } from '../../internal/search/iCABSASAccountSearch';
import { ContractSearchComponent } from '../../internal/search/iCABSAContractSearch';
import { AjaxObservableConstant } from '../../../shared/constants/ajax-observable.constant';
import { GlobalConstant } from './../../../shared/constants/global.constant';
import { ContractActionTypes } from '../../actions/contract';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { SysCharConstants } from '../../../shared/constants/syscharservice.constant';
import { ErrorConstant } from '../../../shared/constants/error.constant';
import { Utils } from '../../../shared/services/utility';
import { EmployeeSearchComponent } from '../../internal/search/iCABSBEmployeeSearch';
import { PremiseSearchComponent } from '../../internal/search/iCABSAPremiseSearch';
import { ServiceCoverSearchComponent } from './../../internal/search/iCABSAServiceCoverSearch';
import { MntConst } from '../../../shared/services/riMaintenancehelper';
import { InternalGridSearchServiceModuleRoutes } from './../../base/PageRoutes';
import { GlobalizeService } from './../../../shared/services/globalize.service';

@Component({
    templateUrl: 'iCABSCMCustomerContactSearchGrid.html',
    styles: [`
        .custom-container .right-container {
            width: 100%;
            padding: 0;
        }
        .custom-container {
            margin-top: 0;
        }
    `],
    providers: [ErrorService, MessageService]
})

export class ContactSearchGridComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('topContainer') container: ElementRef;
    @ViewChild('errorModal') public errorModal;
    @ViewChild('messageModal') public messageModal;
    @ViewChild('contactSearchGrid') contactSearchGrid: GridComponent;
    public url: string = process.env.INVOICE_HISTORY;
    public maxColumn: number = 11;
    public infoDataColumnReference: number = -1;
    public currentPage: number = 1;
    public gridData: any;
    public gridTotalItems: number;
    public itemsPerPage: number;
    public errorSubscription: Subscription;
    public messageSubscription: Subscription;
    public translateSubscription: Subscription;
    public querySubscription: Subscription;
    public contactSearchFormGroup: FormGroup;
    public inputParams: any = {
        'parentMode': 'Contract',
        'pageTitle': 'Customer Contact Search',
        'showBusinessCode': false,
        'showCountryCode': false
    };
    public inputParamsPremise: any = {
        'parentMode': 'LookUp',
        'ContractNumber': '',
        'ContractName': '',
        'showAddNew': false
    };
    public inputParamsServiceCoverSearch: any = {
        'parentMode': 'LookUp',
        'businessCode': '',
        'countryCode': '',
        'ContractNumber': '',
        'ContractName': '',
        'PremiseNumber': '',
        'PremiseName': '',
        'showAddNew': false
    };
    public employeeSearchParams: any = {
        'parentMode': 'MyFilter',
        'showBusinessCode': false,
        'showCountryCode': false
    };
    public isRequesting: boolean = false;
    public customerContactTypeList: Array<any> = [{
        code: 'all',
        value: 'All'
    }
    ];

    public optionsList: Array<any> = [];
    public filterList: Array<any> = [];
    public filterPassedList: Array<any> = [];
    public filterLevelList: Array<any> = [];
    public filterValueList: Array<any> = [];
    public validateProperties: Array<any> = [];
    public customerContactType;
    public options = 'Options';

    public toDate: Date = new Date();
    public fromDate: Date = new Date(new Date().setDate(new Date().getDate() - 14));
    public toDateDisplay: string;
    public fromDateDisplay: string;
    public showEmployeeCode: boolean = false;
    public showCloseButton: boolean = true;
    public showHeader: boolean = true;
    public showMessageHeader: boolean = true;
    public showErrorHeader: boolean = true;
    public showOSCallOuts: boolean = false;
    public searchModalRoute: string;
    public modalConfig: any = {
        backdrop: 'static',
        keyboard: true
    };
    public query: URLSearchParams = new URLSearchParams();
    public queryLookUp: URLSearchParams = new URLSearchParams();
    public querySysChar: URLSearchParams = new URLSearchParams();
    public queryParams: any = {
        action: '0',
        operation: 'ContactManagement/iCABSCMCustomerContactSearchGrid',
        module: 'tickets',
        method: 'ccm/maintenance',
        contentType: 'application/x-www-form-urlencoded'

    };
    public inputParamsEmployeeSearch: any = { 'parentMode': 'MyFilter', 'countryCode': '', 'businessCode': '', 'negativeBranchNumber': '' };
    public ajaxSource = new BehaviorSubject<any>(0);
    public ajaxSource$;
    public ajaxSubscription: Subscription;
    public storeSubscription: Subscription;
    public routeSubscription: Subscription;
    public accountComponent: Component;
    public contractComponent: Component;
    public productComponent: Component;
    public premiseComponent: Component;
    public employeeComponent: Component;
    public viewingByTopLevel: boolean = false;
    public myContactType: string = ''; // Dropdown beside reference number

    public productData;
    public premiseData;
    public contractData;
    public storeData;
    public accountData;
    public employeeData;
    public backLinkText: string = '';
    public backLinkUrl: string = '';

    public serviceCover = {
        ServiceCoverNumber: '',
        ServiceCoverRowID: '',
        ServiceTypeCode: '',
        ServiceTypeDesc: ''
    };

    private pageQueryParams: any;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private httpService: HttpService,
        private serviceConstants: ServiceConstants,
        private zone: NgZone,
        private global: GlobalConstant,
        private ajaxconstant: AjaxObservableConstant,
        private errorService: ErrorService,
        private messageService: MessageService,
        private titleService: Title,
        private translate: TranslateService,
        private localeTranslateService: LocaleTranslationService,
        private store: Store<any>,
        private route: ActivatedRoute,
        private SysCharConstants: SysCharConstants,
        private utils: Utils,
        private globalize: GlobalizeService
    ) {
        this.storeSubscription = store.select('contract').subscribe(data => {
            this.contractData = data['data'];
            this.storeData = data;
        });
    }

    ngOnInit(): void {
        this.ajaxSource$ = this.ajaxSource.asObservable();
        this.filterList = [
            {
                code: 'all',
                value: 'All'
            },
            {
                code: 'open',
                value: 'Open'
            },
            {
                code: 'closed',
                value: 'Closed'
            }
        ];
        this.filterPassedList = [
            {
                code: 'all',
                value: 'All'
            },
            {
                code: 'passed',
                value: 'Passed'
            },
            {
                code: 'notpassed',
                value: 'Not Passed'
            }
        ];
        this.filterLevelList = [
            {
                code: 'all',
                value: 'All'
            },
            {
                code: 'currentowner',
                value: 'Current Owner is'
            },
            {
                code: 'currentactioner',
                value: 'Current Actioner is'
            },
            {
                code: 'anyaction',
                value: 'Any Action by'
            },
            {
                code: 'createdby',
                value: 'Created By'
            }
        ];
        this.filterValueList = [
            {
                code: 'all',
                value: 'All'
            },
            {
                code: 'me',
                value: 'Me'
            },
            {
                code: 'myemployees',
                value: 'My Employees'
            },
            {
                code: 'thisbranch',
                value: 'This Branch'
            },
            {
                code: 'thisemployee',
                value: 'This Employee'
            }
        ];
        this.optionsList = [
            {
                code: '',
                value: 'Options'
            },
            {
                code: 'New Contact',
                value: 'New Contact'
            },
            {
                code: 'Contact History',
                value: 'Event History'
            }
        ];
        this.validateProperties = [
            {
                'type': MntConst.eTypeInteger,
                'index': 0,
                'align': 'center'
            },
            {
                'type': MntConst.eTypeText,
                'index': 1,
                'align': 'center'
            },
            {
                'type': MntConst.eTypeText,
                'index': 2,
                'align': 'center'
            },
            {
                'type': MntConst.eTypeText,
                'index': 3,
                'align': 'center'
            },
            {
                'type': MntConst.eTypeText,
                'index': 4,
                'align': 'center'
            },
            {
                'type': MntConst.eTypeImage,
                'index': 5,
                'align': 'center'
            },
            {
                'type': MntConst.eTypeText,
                'index': 6,
                'align': 'center'
            },
            {
                'type': MntConst.eTypeText,
                'index': 7,
                'align': 'center'
            },
            {
                'type': MntConst.eTypeInteger,
                'index': 8,
                'align': 'center'
            },
            {
                'type': MntConst.eTypeCode,
                'index': 9,
                'align': 'center'
            },
            {
                'type': MntConst.eTypeText,
                'index': 10,
                'align': 'center'
            },
            {
                'type': MntConst.eTypeText,
                'index': 11,
                'align': 'center'
            },
            {
                'type': MntConst.eTypeImage,
                'index': 12,
                'align': 'center'
            },
            {
                'type': MntConst.eTypeImage,
                'index': 13,
                'align': 'center'
            },
            {
                'type': MntConst.eTypeInteger,
                'index': 14,
                'align': 'center'
            },
            {
                'type': MntConst.eTypeText,
                'index': 15,
                'align': 'center'
            },
            {
                'type': MntConst.eTypeText,
                'index': 16,
                'align': 'center'
            },
            {
                'type': MntConst.eTypeText,
                'index': 17,
                'align': 'center'
            },
            {
                'type': MntConst.eTypeText,
                'index': 18,
                'align': 'center'
            }
        ];
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
                    this.messageModal.show({ msg: data.msg, title: data.title }, false);
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

        this.querySubscription = this.route.queryParams.subscribe(params => {
            this.pageQueryParams = params;
            if (params['parentMode'])
                this.inputParams.parentMode = params['parentMode'];
            if (!(this.contractData && !(Object.keys(this.contractData).length === 0 && this.contractData.constructor === Object))) {
                this.contractData = params;
                this.storeData['code'] = {
                    country: this.utils.getCountryCode(),
                    business: this.utils.getBusinessCode()
                };
            } else {
                this.contractData = Object.assign({}, this.contractData, this.pageQueryParams);
            }
        });

        this.translateSubscription = this.localeTranslateService.ajaxSource$.subscribe(event => {
            if (event !== 0) {
                this.fetchTranslationContent();
            }
        });

        this.localeTranslateService.setUpTranslation();

        this.contactSearchFormGroup = this.fb.group({
            ReferenceNumber: [{ value: '', disabled: false }], // CustomerContactNumber
            CustomerContactType: [{ value: 'all', disabled: false }],
            EmployeeCode: [{ value: '', disabled: false }, Validators.required],
            AccountNumber: [{ value: '', disabled: false }],
            AccountName: [{ value: '', disabled: true }],
            ContractNumber: [{ value: '', disabled: false }],
            ContractName: [{ value: '', disabled: true }],
            PremiseNumber: [{ value: '', disabled: false }],
            PremiseName: [{ value: '', disabled: true }],
            ProductCode: [{ value: '', disabled: false }],
            ProductDesc: [{ value: '', disabled: true }],
            ContactName: [{ value: '', disabled: false }],
            ZipCode: [{ value: '', disabled: false }],
            ProspectNumber: [{ value: '', disabled: false }],
            OSCallOuts: [{ value: 'all', disabled: false }],
            Filter: [{ value: 'open', disabled: false }],
            FilterPassed: [{ value: 'all', disabled: false }],
            FilterLevel: [{ value: 'currentowner', disabled: false }],
            FilterValue: [{ value: 'thisbranch', disabled: false }],
            Options: [{ value: '', disabled: false }]
        });

        this.fetchSysChar(this.sysCharParameters()).subscribe(
            (e) => {
                if (e.errorMessage) {
                    this.errorService.emitError({
                        errorMessage: ErrorConstant.Message.SystemCharacteristicsFetchError
                    });
                    return false;
                }
                if (e.records && e.records.length > 0) {
                    this.viewingByTopLevel = e.records[0].Required;
                    switch (this.inputParams.parentMode) {
                        case 'Contract':
                        case 'Premise':
                        case 'Account':
                            if (!this.viewingByTopLevel) {
                                this.contactSearchFormGroup.controls['ContractNumber'].setValue(this.contractData.ContractNumber);
                                this.contactSearchFormGroup.controls['ContractName'].setValue(this.contractData.ContractName);
                                this.contactSearchFormGroup.controls['PremiseNumber'].setValue(this.contractData.PremiseNumber);
                                this.contactSearchFormGroup.controls['PremiseName'].setValue(this.contractData.PremiseName);
                                this.contactSearchFormGroup.controls['AccountNumber'].setValue(this.contractData.AccountNumber);
                                this.contactSearchFormGroup.controls['AccountName'].setValue(this.contractData.AccountContactName);
                                this.contactSearchFormGroup.controls['ProductCode'].setValue(this.contractData.ProductCode);
                                this.contactSearchFormGroup.controls['ProductDesc'].setValue(this.contractData.ProductDesc);
                                this.serviceCover.ServiceCoverNumber = this.contractData.ServiceCoverNumber ? this.contractData.ServiceCoverNumber : '';
                                this.serviceCover.ServiceCoverRowID = this.contractData.ServiceCoverRowID ? this.contractData.ServiceCoverRowID : '';

                            } else {
                                this.contactSearchFormGroup.controls['AccountNumber'].setValue(this.contractData.AccountNumber);
                                this.contactSearchFormGroup.controls['AccountName'].setValue(this.contractData.AccountContactName);

                            }
                            break;

                        case 'ServiceCover':
                            if (!this.viewingByTopLevel) {
                                this.contactSearchFormGroup.controls['ContractNumber'].setValue(this.contractData.ContractNumber);
                                this.contactSearchFormGroup.controls['ContractName'].setValue(this.contractData.ContractName);
                                this.contactSearchFormGroup.controls['PremiseNumber'].setValue(this.contractData.PremiseNumber);
                                this.contactSearchFormGroup.controls['PremiseName'].setValue(this.contractData.PremiseName);
                                this.contactSearchFormGroup.controls['AccountNumber'].setValue(this.contractData.AccountNumber);
                                this.contactSearchFormGroup.controls['AccountName'].setValue(this.contractData.AccountContactName);
                                this.contactSearchFormGroup.controls['ProductCode'].setValue(this.contractData.ProductCode);
                                this.contactSearchFormGroup.controls['ProductDesc'].setValue(this.contractData.ProductDesc);
                                this.serviceCover.ServiceCoverNumber = this.contractData.ServiceCoverNumber;
                                this.serviceCover.ServiceCoverRowID = this.contractData.ServiceCoverRowID;
                                if (this.serviceCover.ServiceCoverRowID !== '') {
                                    this.getServiceCoverNumberFromRowID();
                                } else {
                                    this.getServiceCoverNumberFromRecord();
                                }
                            } else {
                                this.contactSearchFormGroup.controls['AccountNumber'].setValue(this.contractData.AccountNumber);
                                this.contactSearchFormGroup.controls['AccountName'].setValue(this.contractData.AccountContactName);
                            }
                            break;
                        case 'Dashboard':
                            this.fromDateDisplay = this.globalize.parseDateToFixedFormat(this.pageQueryParams['FromDate']) as string;
                            this.fromDate = this.globalize.parseDateStringToDate(this.fromDateDisplay) as Date;
                            this.toDateDisplay = this.globalize.parseDateToFixedFormat(this.pageQueryParams['ToDate']) as string;
                            this.toDate = this.globalize.parseDateStringToDate(this.toDateDisplay) as Date;
                            break;

                        default:
                            // code...
                            break;
                    }
                    this.fetchContractTypeDetails();
                    this.onAccountBlur({});
                    this.loadSearchDefaults();
                    this.updateInputParams();
                }
            });

        this.accountComponent = AccountSearchComponent;
        this.productComponent = ServiceCoverSearchComponent;
        this.premiseComponent = PremiseSearchComponent;
        this.contractComponent = ContractSearchComponent;
        this.employeeComponent = EmployeeSearchComponent;
        this.titleService.setTitle(this.inputParams.pageTitle);
        this.itemsPerPage = this.global.AppConstants().tableConfig.itemsPerPage;
        this.inputParamsEmployeeSearch = Object.assign({}, this.inputParamsEmployeeSearch, {
            'countryCode': this.utils.getCountryCode(),
            'businessCode': this.utils.getBusinessCode(),
            'negotiatingBranchNumber': this.utils.getBranchCode()
        });

    }

    public fetchGridData(): void {
        this.query.set(this.serviceConstants.Action, '2');
        this.query.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.query.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.query.set('PageSize', this.itemsPerPage.toString());
        this.query.set('PageCurrent', this.currentPage.toString());
        this.query.set('ContractNumber', this.contactSearchFormGroup.controls['ContractNumber'].value);
        this.query.set('PremiseNumber', this.contactSearchFormGroup.controls['PremiseNumber'].value);
        this.query.set('AccountNumber', this.contactSearchFormGroup.controls['AccountNumber'].value);
        this.query.set('ProductCode', this.contactSearchFormGroup.controls['ProductCode'].value);
        this.query.set('ContactName', this.contactSearchFormGroup.controls['ContactName'].value);
        this.query.set('Postcode', this.contactSearchFormGroup.controls['ZipCode'].value);
        this.query.set('ProspectNumber', this.contactSearchFormGroup.controls['ProspectNumber'].value);
        this.query.set('ServiceCoverNumber', this.serviceCover.ServiceCoverNumber);
        this.query.set('Filter', this.contactSearchFormGroup.controls['Filter'].value);
        this.query.set('FilterPassed', this.contactSearchFormGroup.controls['FilterPassed'].value);
        this.query.set('FilterLevel', this.contactSearchFormGroup.controls['FilterLevel'].value);
        this.query.set('FilterValue', this.contactSearchFormGroup.controls['FilterValue'].value);
        this.query.set('FilterEmployeeCode', this.contactSearchFormGroup.controls['EmployeeCode'].value);
        this.query.set('CustomerContactNumber', this.contactSearchFormGroup.controls['ReferenceNumber'].value);
        this.query.set('BranchNumber', this.contractData.NegBranchNumber);
        this.query.set('BranchServiceAreaCode', '');
        this.query.set('LanguageCode', '');
        this.query.set('MyContactType', this.contactSearchFormGroup.controls['CustomerContactType'].value);
        this.query.set('OSCallOuts', this.contactSearchFormGroup.controls['OSCallOuts'] ? this.contactSearchFormGroup.controls['OSCallOuts'].value : 'all');
        this.query.set('HeaderClickedColumn', '');
        this.query.set('riSortOrder', this.queryParams.sortOrder);
        this.query.set('riGridHandle', (Math.floor(Math.random() * 900000) + 100000).toString());
        /*if (!this.toDateDisplay || this.toDateDisplay === '') {
            this.toDateDisplay = this.formatDate(this.toDate);
        }*/
        this.query.set('DateTo', this.globalize.parseDateToFixedFormat(this.toDateDisplay) as string);
        /*if (!this.fromDateDisplay || this.fromDateDisplay === '') {
            this.fromDateDisplay = this.formatDate(this.fromDate);
        }*/
        this.query.set('DateFrom', this.globalize.parseDateToFixedFormat(this.fromDateDisplay) as string);
        this.queryParams.search = this.query;
        this.contactSearchGrid.loadGridData(this.queryParams);

    }

    public fetchSysChar(sysCharNumbers: any): any {
        this.querySysChar.set(this.serviceConstants.Action, '0');
        this.querySysChar.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.querySysChar.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());

        this.querySysChar.set(this.serviceConstants.SystemCharNumber, sysCharNumbers);
        return this.httpService.sysCharRequest(this.querySysChar);
    }

    public sysCharParameters(): string {
        let sysCharList = [
            this.SysCharConstants.SystemCharContactManagementViewingByTopLevel
        ];
        return sysCharList.join(',');
    }

    public loadSearchDefaults(): void {
        this.fetchCustomerContactDataPost('GetSearchDefaults', {}, { BusinessCode: this.utils.getBusinessCode(), BranchNumber: this.utils.getBranchCode() }).subscribe((data) => {
            if (data['status'] === GlobalConstant.Configuration.Failure) {
                this.errorService.emitError(data['oResponse']);
            } else {
                if (data['errorMessage']) {
                    this.errorService.emitError({
                        errorMessage: data['errorMessage'] || ErrorConstant.Message.UnexpectedError
                    });
                } else {
                    this.contactSearchFormGroup.controls['CustomerContactType'].setValue(this.customerContactTypeList[parseInt(data.cmbContactType, 10)].code);
                    this.contactSearchFormGroup.controls['Filter'].setValue(this.filterList[parseInt(data.cmbStatus, 10)].code);
                    this.contactSearchFormGroup.controls['FilterPassed'].setValue(this.filterPassedList[parseInt(data.cmbPassed, 10)].code);
                    this.contactSearchFormGroup.controls['FilterLevel'].setValue(this.filterLevelList[parseInt(data.cmbLevel, 10)].code);
                    this.contactSearchFormGroup.controls['FilterValue'].setValue(this.filterValueList[parseInt(data.cmbValue, 10)].code);
                }
            }

        }, (error) => {
            // statement
        }
        );
    }

    public fetchCustomerContactDataPost(functionName: string, params: Object, formData: Object): any {
        let queryContact = new URLSearchParams();

        let businessCode = (this.storeData['code'] && this.storeData['code'].business) ? this.storeData['code'].business : this.utils.getBusinessCode();
        let countryCode = (this.storeData['code'] && this.storeData['code'].country) ? this.storeData['code'].country : this.utils.getCountryCode();
        queryContact.set(this.serviceConstants.BusinessCode, businessCode);
        queryContact.set(this.serviceConstants.CountryCode, countryCode);
        queryContact.set(this.serviceConstants.Action, this.queryParams.action);

        if (functionName !== '') {
            queryContact.set(this.serviceConstants.Action, '6');
            queryContact.set('Function', functionName);
        }
        for (let key in params) {
            if (key) {
                queryContact.set(key, params[key]);
            }
        }
        return this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, queryContact, formData);
    }

    public getServiceCoverNumber(functionName: string, params: Object): any {
        let queryServiceCover = new URLSearchParams();

        let businessCode = (this.storeData['code'] && this.storeData['code'].business) ? this.storeData['code'].business : this.utils.getBusinessCode();
        let countryCode = (this.storeData['code'] && this.storeData['code'].country) ? this.storeData['code'].country : this.utils.getCountryCode();
        queryServiceCover.set(this.serviceConstants.BusinessCode, businessCode);
        queryServiceCover.set(this.serviceConstants.CountryCode, countryCode);
        queryServiceCover.set(this.serviceConstants.Action, this.queryParams.action);

        if (functionName !== '') {
            queryServiceCover.set(this.serviceConstants.Action, '6');
            queryServiceCover.set('Function', functionName);
        }
        for (let key in params) {
            if (key) {
                queryServiceCover.set(key, params[key]);
            }
        }
        return this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, queryServiceCover);
    }

    public getServiceCoverNumberTop(): void {
        if (this.serviceCover.ServiceCoverRowID !== '') {
            this.getServiceCoverNumberFromRowID();
        } else {
            this.getServiceCoverNumberFromRecord();
        }
    }

    public getServiceCoverNumberFromRowID(): void {
        this.getServiceCoverNumber('GetServiceCoverFromRowID', { SCRowID: this.serviceCover.ServiceCoverRowID }).subscribe((data) => {
            if (data['status'] === GlobalConstant.Configuration.Failure) {
                this.errorService.emitError(data['oResponse']);
            } else {
                if (data['errorMessage']) {
                    this.errorService.emitError({
                        errorMessage: data['errorMessage'] || ErrorConstant.Message.UnexpectedError
                    });
                } else {
                    this.serviceCover.ServiceCoverNumber = data['ServiceCoverNumber'];
                    this.serviceCover.ServiceTypeCode = data['ServiceTypeCode'];
                    this.serviceCover.ServiceTypeDesc = data['ServiceTypeDesc'];
                    this.contactSearchFormGroup.controls['ProductDesc'].setValue(data['ProductDesc']);
                }
            }

        }, (error) => {
            // statement
        }
        );
    }

    public getServiceCoverNumberFromRecord(): void {
        let functionName = 'GetServiceCoverFromRecord';
        let parameters = {
            ContractNumber: this.contactSearchFormGroup.controls['ContractNumber'].value,
            PremiseNumber: this.contactSearchFormGroup.controls['PremiseNumber'].value,
            ProductCode: this.contactSearchFormGroup.controls['ProductCode'].value
        };
        this.getServiceCoverNumber(functionName, parameters).subscribe((data) => {
            if (data['status'] === GlobalConstant.Configuration.Failure) {
                this.errorService.emitError(data['oResponse']);
            } else {
                if (data['errorMessage']) {
                    this.errorService.emitError({
                        errorMessage: data['errorMessage'] || ErrorConstant.Message.UnexpectedError
                    });
                } else {
                    this.serviceCover.ServiceCoverRowID = data['ServiceCoverRowID'];
                    this.serviceCover.ServiceCoverNumber = data['ServiceCoverNumber'];
                    this.serviceCover.ServiceTypeCode = data['ServiceTypeCode'];
                    this.serviceCover.ServiceTypeDesc = data['ServiceTypeDesc'];
                    if (this.serviceCover.ServiceCoverNumber === '-1') {
                        this.getServiceCoverNumberFromRowID();
                    } else if (this.serviceCover.ServiceCoverNumber === '0') {
                        this.contactSearchFormGroup.controls['ProductCode'].setErrors({});
                    } else {
                        this.contactSearchFormGroup.controls['ProductDesc'].setValue(data['ProductDesc']);
                    }
                }
            }

        }, (error) => {
            // statement
        }
        );
    }

    public gridInfo(value: any): void {
        if (value && value.totalPages) {
            this.gridTotalItems = parseInt(value.totalPages, 10) * this.itemsPerPage;
        } else {
            this.gridTotalItems = 0;
        }

    }

    public fetchContractTypeDetails(): void {
        let data = [{
            'table': 'ContactType',
            'query': {},
            'fields': ['ContactTypeCode', 'ContactTypeSystemDesc']
        }];
        this.lookUpRecord(data, 100).subscribe(
            (e) => {
                if (e['results'] && e['results'].length > 0 && e['results'][0].length > 0) {
                    for (let i = 0; i < e['results'][0].length; i++) {
                        let obj = {
                            code: e['results'][0][i].ContactTypeCode,
                            value: e['results'][0][i].ContactTypeSystemDesc
                        };
                        this.customerContactTypeList.push(JSON.parse(JSON.stringify(obj)));
                    }

                } else {
                    // statement
                }
                this.fetchGridData();

            },
            (error) => {
                this.fetchGridData();
            }
        );
    }

    public updateInputParams(): void {
        this.inputParams['accountNumber'] = this.contactSearchFormGroup.controls['AccountNumber'].value;
        this.inputParams['accountName'] = this.contactSearchFormGroup.controls['AccountName'].value;
        this.inputParamsPremise.ContractNumber = this.contactSearchFormGroup.controls['ContractNumber'].value;
        this.inputParamsPremise.ContractName = this.contactSearchFormGroup.controls['ContractName'].value;
        this.inputParamsServiceCoverSearch.ContractNumber = this.contactSearchFormGroup.controls['ContractNumber'].value;
        this.inputParamsServiceCoverSearch.ContractName = this.contactSearchFormGroup.controls['ContractName'].value;
        this.inputParamsServiceCoverSearch.PremiseNumber = this.contactSearchFormGroup.controls['PremiseNumber'].value;
        this.inputParamsServiceCoverSearch.PremiseName = this.contactSearchFormGroup.controls['PremiseName'].value;
    }


    public onAccountBlur(event: any): void {
        if (this.contactSearchFormGroup.controls['AccountNumber'].value && this.contactSearchFormGroup.controls['AccountNumber'].value !== '') {
            let data = [{
                'table': 'Account',
                'query': { 'AccountNumber': this.contactSearchFormGroup.controls['AccountNumber'].value, 'BusinessCode': this.storeData['code'].business, 'CountryCode': this.storeData['code'].country },
                'fields': ['AccountNumber', 'AccountName']
            }];
            this.lookUpRecord(JSON.parse(JSON.stringify(data)), 100).subscribe(
                (e) => {
                    if (e['results'] && e['results'].length > 0 && e['results'][0].length > 0) {
                        this.contactSearchFormGroup.controls['AccountName'].setValue(e['results'][0][0].AccountName);

                    } else {
                        this.contactSearchFormGroup.controls['AccountName'].setValue('');
                        e['errorMessage'] = ErrorConstant.Message.RecordNotFound;
                        this.errorService.emitError(e);
                    }
                    this.updateInputParams();

                },
                (error) => {
                    this.contactSearchFormGroup.controls['AccountName'].setValue('');
                    error['errorMessage'] = error['errorMessage'] || ErrorConstant.Message.ErrorFetchingRecord;
                    //this.errorService.emitError(error);
                }
            );
        } else {
            this.contactSearchFormGroup.controls['AccountName'].setValue('');
        }
    }

    public onContractBlur(event: any): void {
        if (this.contactSearchFormGroup.controls['ContractNumber'].value && this.contactSearchFormGroup.controls['ContractNumber'].value !== '') {
            let data = [{
                'table': 'Contract',
                'query': { 'ContractNumber': this.contactSearchFormGroup.controls['ContractNumber'].value, 'BusinessCode': this.storeData['code'].business, 'CountryCode': this.storeData['code'].country },
                'fields': ['ContractNumber', 'ContractName']
            }];
            this.lookUpRecord(JSON.parse(JSON.stringify(data)), 100).subscribe(
                (e) => {
                    if (e['results'] && e['results'].length > 0 && e['results'][0].length > 0) {
                        this.contactSearchFormGroup.controls['ContractName'].setValue(e['results'][0][0].ContractName);

                    } else {
                        this.contactSearchFormGroup.controls['ContractName'].setValue('');
                        e['errorMessage'] = ErrorConstant.Message.RecordNotFound;
                        this.errorService.emitError(e);
                    }
                    this.updateInputParams();

                },
                (error) => {
                    this.contactSearchFormGroup.controls['ContractName'].setValue('');
                    error['errorMessage'] = error['errorMessage'] || ErrorConstant.Message.ErrorFetchingRecord;
                    //this.errorService.emitError(error);
                }
            );
        } else {
            this.contactSearchFormGroup.controls['ContractName'].setValue('');
        }
    }

    public onPremiseBlur(event: any): void {
        if (this.contactSearchFormGroup.controls['PremiseNumber'].value && this.contactSearchFormGroup.controls['PremiseNumber'].value !== '') {
            let isValid = this.isValid(this.contactSearchFormGroup.controls['PremiseNumber'].value);
            if (isValid) {
                this.contactSearchFormGroup.controls['PremiseNumber'].clearValidators();
                let data = [{
                    'table': 'Premise',
                    'query': { 'ContractNumber': this.contactSearchFormGroup.controls['ContractNumber'].value, 'PremiseNumber': this.contactSearchFormGroup.controls['PremiseNumber'].value, 'BusinessCode': this.storeData['code'].business },
                    'fields': ['BusinessCode', 'PremiseNumber', 'PremiseName']
                }];
                this.lookUpRecord(JSON.parse(JSON.stringify(data)), 100).subscribe(
                    (e) => {
                        if (e['results'] && e['results'].length > 0 && e['results'][0].length > 0) {
                            this.contactSearchFormGroup.controls['PremiseName'].setValue(e['results'][0][0].PremiseName);

                        } else {
                            this.contactSearchFormGroup.controls['PremiseName'].setValue('');
                            e['errorMessage'] = ErrorConstant.Message.RecordNotFound;
                            this.errorService.emitError(e);
                        }
                        this.updateInputParams();
                    },
                    (error) => {
                        this.contactSearchFormGroup.controls['PremiseName'].setValue('');
                        error['errorMessage'] = error['errorMessage'] || ErrorConstant.Message.ErrorFetchingRecord;
                        //this.errorService.emitError(error);
                    }
                );
            } else {
                this.contactSearchFormGroup.controls['PremiseNumber'].setErrors({});
            }

        } else {
            this.contactSearchFormGroup.controls['PremiseName'].setValue('');
        }
    }

    public onProductBlur(event: any): void {
        if (this.contactSearchFormGroup.controls['ProductCode'].value && this.contactSearchFormGroup.controls['ProductCode'].value !== '') {
            this.getServiceCoverNumberTop();
        } else {
            this.contactSearchFormGroup.controls['ProductDesc'].setValue('');
        }

    }

    public lookUpRecord(data: any, maxresults: number): any {
        this.queryLookUp.set(this.serviceConstants.Action, '0');
        this.queryLookUp.set(this.serviceConstants.BusinessCode, this.storeData['code'] && this.storeData['code'].business ? this.storeData['code'].business : this.utils.getBusinessCode());
        this.queryLookUp.set(this.serviceConstants.CountryCode, this.storeData['code'] && this.storeData['code'].country ? this.storeData['code'].country : this.utils.getCountryCode());
        if (maxresults) {
            this.queryLookUp.set(this.serviceConstants.MaxResults, maxresults.toString());
        }
        return this.httpService.lookUpRequest(this.queryLookUp, data);
    }

    public isValid(str: string): any {
        return !/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(str);
    }


    public getTranslatedValue(key: any, params: any): any {
        if (params) {
            return this.translate.get(key, { value: params });
        } else {
            return this.translate.get(key);
        }

    }

    public fetchTranslationContent(): void {
        this.getTranslatedValue('Customer Contact Search', null).subscribe((res: string) => {
            this.zone.run(() => {
                if (res) {
                    this.titleService.setTitle(res);
                } else {
                    this.titleService.setTitle(this.inputParams.pageTitle);
                }
            });

        });

        this.getTranslatedValue('Customer Contact Search', null).subscribe((res: string) => {
            this.zone.run(() => {
                if (res) {
                    this.inputParams.pageHeader = res;
                }
            });

        });
    }

    public onChange(event: any): void {
        //this._router.navigate(['/postlogin/account/' + event]);
    }

    public osCallOutOnChange(event: any): void {
        // statement
    }

    ngAfterViewInit(): void {
        this.arrangeElements();
    }

    ngOnDestroy(): void {
        if (this.routeSubscription)
            this.routeSubscription.unsubscribe();
        if (this.messageSubscription)
            this.messageSubscription.unsubscribe();
        if (this.errorSubscription)
            this.errorSubscription.unsubscribe();
        if (this.ajaxSubscription)
            this.ajaxSubscription.unsubscribe();
        if (this.translateSubscription)
            this.translateSubscription.unsubscribe();
        if (this.querySubscription)
            this.querySubscription.unsubscribe();
    }

    public arrangeElements(): void {
        // statement

    }

    public removeClass(): void {
        HTMLElement.prototype['removeClass'] = function (remove: any): void {
            let newClassName = '';
            let i;
            let classes = this.className.split(' ');
            for (i = 0; i < classes.length; i++) {
                if (classes[i] !== remove) {
                    newClassName += classes[i] + ' ';
                }
            }
            this.className = newClassName;
        };
    }

    public getCurrentPage(event: any): void {
        this.currentPage = event.value;
        this.fetchGridData();
    }

    public optionsChange(data: any): void {
        if (this.contactSearchFormGroup.controls['Options'].value === 'Contact History') {
            this.router.navigate([InternalGridSearchServiceModuleRoutes.ICABSCMCUSTOMERCONTACTHISTORYGRID], {
                queryParams: {
                    parentMode: 'Contract',
                    currentContractTypeURLParameter: this.inputParams.currentContractTypeURLParameter,
                    ContractNumber: this.contactSearchFormGroup.controls['ContractNumber'].value,
                    ContractName: this.contactSearchFormGroup.controls['ContractName'].value,
                    AccountNumber: this.contactSearchFormGroup.controls['AccountNumber'].value,
                    AccountName: this.contactSearchFormGroup.controls['AccountName'].value,
                    PremiseNumber: this.contactSearchFormGroup.controls['PremiseNumber'].value,
                    PremiseName: this.contactSearchFormGroup.controls['PremiseName'].value,
                    ProductCode: this.contactSearchFormGroup.controls['ProductCode'].value,
                    ProductDesc: this.contactSearchFormGroup.controls['ProductDesc'].value
                }
            });

        } else if (this.contactSearchFormGroup.controls['Options'].value === 'New Contact') {
            // statement
            alert('Screen part of Release 3');
        }
    }

    public customerContactTypeChange(data: any): void {
        let refVal = this.contactSearchFormGroup.controls['CustomerContactType'].value;
        for (let i = 0; i < this.customerContactTypeList.length; i++) {
            if (refVal === this.customerContactTypeList[i].value) {
                this.myContactType = this.customerContactTypeList[i].code;
            }
        }
    }

    public filterChange(data: any): void {
        // statement
    }

    public passedChange(data: any): void {
        // statement
    }

    public levelChange(data: any): void {
        // statement
    }

    public valueChange(data: any): void {
        if (this.contactSearchFormGroup.controls['FilterValue'].value === 'thisemployee') {
            this.showEmployeeCode = true;
            setTimeout(() => {
                document.getElementById('EmployeeCode').focus();
            }, 0);
        } else {
            this.showEmployeeCode = false;
            this.contactSearchFormGroup.controls['EmployeeCode'].setValue('');
        }
    }

    public onRefresh(): void {
        //this.currentPage = 1;
        this.fetchGridData();
    }

    public onGridRowDblClick(data: any): void {
        if (data.cellIndex === 0) {
            // iCABSCMCustomerContactMaintenance
            /*this.router.navigate(['contactmanagement/customercontactHistorygrid'], {
              queryParams: {
                parentMode: 'CMSearch',
                ContractNumber: this.contactSearchFormGroup.controls['ContractNumber'].value,
                ContractName: this.contactSearchFormGroup.controls['ContractName'].value,
                AccountNumber: this.contactSearchFormGroup.controls['AccountNumber'].value,
                AccountName: this.contactSearchFormGroup.controls['AccountName'].value
              }
            });*/
        } else if (data.cellIndex === 10) {
            if (data.trRowData[data.cellIndex].rowID !== '1') {
                // iCABSCMCallOutMaintenance
                /*this.router.navigate(['contactmanagement/customercontactHistorygrid'], {
                  queryParams: {
                    parentMode: 'UpdateCallOut-ContactSearch',
                    ContractNumber: this.contactSearchFormGroup.controls['ContractNumber'].value,
                    ContractName: this.contactSearchFormGroup.controls['ContractName'].value,
                    AccountNumber: this.contactSearchFormGroup.controls['AccountNumber'].value,
                    AccountName: this.contactSearchFormGroup.controls['AccountName'].value,
                    RowID: data.trRowData[0].rowID
                  }
                });*/
            }

        }
    }

    public onContractDataReceived(data: any, route: any): void {
        // TODO
        this.contractData = data;
        this.contactSearchFormGroup.controls['ContractNumber'].setValue(data.ContractNumber);
        this.contactSearchFormGroup.controls['ContractName'].setValue(data.ContractName);
        this.updateInputParams();
    }

    public onProductDataReceived(data: any, route: any): void {
        // TODO
        this.productData = data;
        this.contactSearchFormGroup.controls['ProductCode'].setValue(data.ProductCode);
        this.contactSearchFormGroup.controls['ProductDesc'].setValue(data.ProductDesc);
        if (data.row) {
            this.serviceCover.ServiceCoverNumber = data.row.ServiceCoverNumber;
        }
    }

    public onAccountDataReceived(data: any, route: any): void {
        // TODO
        this.accountData = data;
        this.contactSearchFormGroup.controls['AccountNumber'].setValue(data.AccountNumber);
        this.contactSearchFormGroup.controls['AccountName'].setValue(data.AccountName);
        this.updateInputParams();
    }

    public onPremiseDataReceived(data: any, route: any): void {
        // TODO
        this.premiseData = data;
        this.contactSearchFormGroup.controls['PremiseNumber'].setValue(data.PremiseNumber);
        this.contactSearchFormGroup.controls['PremiseName'].setValue(data.PremiseDesc || data.PremiseName);
        this.updateInputParams();
    }

    public onEmployeeDataReceived(data: any, route: any): void {
        this.employeeData = data;
        this.contactSearchFormGroup.controls['EmployeeCode'].setValue(data.EmployeeCode);
    }

    public isNumber(evt: any): boolean {
        evt = (evt) ? evt : window.event;
        let charCode = (evt.which) ? evt.which : evt.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    }

    public toUpperCase(event: any): void {
        let target = event.target.getAttribute('formControlName');
        let elementValue = event.target.value;
        if (elementValue !== null && elementValue !== undefined) {
            this.contactSearchFormGroup.controls[target].setValue(elementValue.toUpperCase());
        }

    }

    public toDateSelectedValue(value: any): void {
        if (value) {
            this.toDateDisplay = value.value;
        } else {
            this.toDateDisplay = '';
        }
    }

    public fromDateSelectedValue(value: any): void {
        if (value) {
            this.fromDateDisplay = value.value;
        }
        else {
            this.fromDateDisplay = '';
        }
    }

    public formatDate(date: any): any {
        let d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [day, month, year].join('/');
    }

    public infoData(data: any): void {
        this.messageService.emitMessage({
            title: data.data.text,
            msg: data.data.toolTip
        });
    }
}
