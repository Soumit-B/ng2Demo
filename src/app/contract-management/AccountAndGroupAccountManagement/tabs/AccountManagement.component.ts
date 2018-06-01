import { InternalMaintenanceApplicationModuleRoutes } from './../../../base/PageRoutes';
import { EllipsisComponent } from './../../../../shared/components/ellipsis/ellipsis';
import { Utils } from './../../../../shared/services/utility';
import { AccountMaintenanceActionTypes } from './../../../actions/account-maintenance';
import { EmployeeSearchComponent } from './../../../internal/search/iCABSBEmployeeSearch';
import { PaginationComponent } from './../../../../shared/components/pagination/pagination';
import { GridComponent } from './../../../../shared/components/grid/grid';
import { Http, URLSearchParams } from '@angular/http';
import { LocaleTranslationService } from './../../../../shared/services/translation.service';
import { AuthService } from './../../../../shared/services/auth.service';
import { LocalStorageService } from 'ng2-webstorage';
import { ActivatedRoute, Router } from '@angular/router';
import { Logger } from '@nsalaun/ng2-logger';
import { AjaxObservableConstant } from './../../../../shared/constants/ajax-observable.constant';
import { PageDataService } from './../../../../shared/services/page-data.service';
import { TranslateService } from 'ng2-translate';
import { Title } from '@angular/platform-browser';
import { MessageService } from './../../../../shared/services/message.service';
import { ErrorService } from './../../../../shared/services/error.service';
import { ServiceConstants } from './../../../../shared/constants/service.constants';
import { HttpService } from './../../../../shared/services/http-service';
import { Component, NgZone, OnInit, OnDestroy, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { ContractManagementModuleRoutes } from '../../../base/PageRoutes';
import { ContractActionTypes } from '../../../../app/actions/contract';
import { AccountSearchComponent } from '../../../../app/internal/search/iCABSASAccountSearch';
import { PostCodeSearchComponent } from '../../../../app/internal/search/iCABSBPostcodeSearch.component';
import { MntConst } from '../../../../shared/services/riMaintenancehelper';
import { CustomerCategorySearchComponent } from './../../../internal/search/iCABSBCustomerCategorySearch.component';

@Component({
    selector: 'icabs-account-maintenance-account-management',
    templateUrl: 'AccountManagement.html'
})


export class AccountManagementComponent implements OnInit, OnDestroy {
    @ViewChild('accountReviewOwnerGrid') accountReviewOwnerGrid: GridComponent;
    @ViewChild('accountReviewOwnerPagination') accountReviewOwnerPagination: PaginationComponent;
    @ViewChild('employeeSearchEllipsis') zipCodeEllipsis: EllipsisComponent;
    public inputParamsTierSearch: any = {};
    public inputParamsEmployeeSearch: any = { 'parentMode': 'LookUp-AccountOwner', 'countryCode': '', 'businessCode': '', 'serviceBranchNumber': '' };
    public inputAccountOwner: any = { 'parentMode': 'LookUp-AccountOwner', 'ContractTypeCode': '' };
    public inputParams: any = {
        'parentMode': 'LookUp-Service',
        'businessCode': '',
        'countryCode': ''
    };
    public isEmployeeSearchEllipsisDisabled: boolean = true;
    public storeSubscription: Subscription;
    public accountManagementFormGroup: FormGroup;
    public employeeSearchComponent = EmployeeSearchComponent;
    public zipSearchComponent = PostCodeSearchComponent;
    public test = AccountSearchComponent;
    public isRefreshEnable: boolean = false;
    public selectedOwner: string = '';
    public autoOpen: boolean = false;
    public modalConfig: any = {
        backdrop: 'static',
        keyboard: true
    };

    public itemsPerPage: number = 10;
    public currentPage: number = 1;
    public totalRecords: number = 10;
    public maxColumn: number = 8;
    public gridSortHeaders: any[] = [];

    public TierSearch: any;
    public isTierCodeDisabled: boolean = true;

    public searchModalRoute: string = '';
    public showHeader: boolean = true;
    public showCloseButton: boolean = true;
    public isCountryCodeDisabled: boolean = true;
    public isZipCodeEllipsisDisabled: boolean = true;
    public countrySelected: Object = {
        id: '',
        text: ''
    };
    public currentMode: string;
    public params: Object;
    public query: URLSearchParams;
    public search: URLSearchParams = new URLSearchParams();
    public parentMode: string;
    public queryParams: any = {
        method: 'contract-management/maintenance',
        module: 'account',
        operation: 'Application/iCABSAAccountMaintenance',
        contentType: 'application/x-www-form-urlencoded'
    };

    public dropdown: any = {
        custCategory: {
            isDisabled: false,
            isTriggerValidate: true,
            params: {
                parentMode: 'LookUp'
            },
            active: {
                id: '',
                text: ''
            }
        }
    };

    public fieldDisabled: any = {
        'BtnSendToNAV': false,
        'cmdGetAddress': false,
        'cmdSetInvoiceGroupDefault': false,
        'cmdSetInvoiceGroupEDI': false,
        'selMandateTypeCode': false,
        'cmdGenerateNew': false,
        'cmdAddOwner': false
    };

    public fieldVisibility: any = {
        'TierCode': true,
        'TierDescription': true,
        'AccountOwner': true,
        'AccountOwnerSurname': true,
        'CategoryCode': true,
        'CategoryDesc': true,
        'cmdAddOwner': true
    };

    public fieldRequired: any = {
        'isAccountOwnerRequired': true,
        'isCategoryCodeRequired': true
    };

    public virtualTableField: any = {
        'CrossReferenceAccountName': '',
        'BankAccountTypeDesc': '',
        'GroupName': '',
        'AccountBusinessTypeDesc': '',
        'LogoTypeDesc': '',
        'EmployeeSurname': '',
        'AccountOwnerSurname': '',
        'TierSystemDescription': '',
        'TierDescription': '',
        'CategoryDesc': '',
        'riCountryDescription': ''
    };

    public otherParams: any = {
        'glAllowUserAuthUpdate': false,
        'cEmployeeLimitChildDrillOptions': ''
    };

    public defaultCode: any =
    {
        country: '',
        business: ''
    };

    public headerClicked: string = '';
    public sortType: string = 'ASC';

    public syschars: Object;
    public virtualTableData: Object;
    public mode: Object;
    public storeData: any;
    public sysCharParams: Object;
    public accountData: any;
    public validateProperties: Array<any> = [];
    public updateMode: boolean = false;
    public addMode: boolean = false;
    public searchMode: boolean = false;

    constructor(
        private httpService: HttpService,
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
        private translateService: LocaleTranslationService,
        private fb: FormBuilder,
        private logger: Logger,
        private activatedRoute: ActivatedRoute,
        private utilService: Utils
    ) {
        this.accountManagementFormGroup = this.fb.group({
            TierCode: [{ value: '', disabled: false }],
            TierDescription: [{ value: '', disabled: false }],
            AccountOwner: [{ value: '', disabled: false }, Validators.required],
            AccountOwnerSurname: [{ value: '', disabled: true }],
            CategoryCode: [{ value: '', disabled: false }, Validators.required],
            CategoryDesc: [{ value: '', disabled: true }],
            cmdAddOwner: [{ value: 'Add', disabled: false }]
        });

        this.storeSubscription = store.select('accountMaintenance').subscribe(data => {
            if (data && data['action']) {
                this.storeData = data;
                switch (data['action']) {
                    case AccountMaintenanceActionTypes.SAVE_DATA:
                        if (data['data'] && !(Object.keys(data['data']).length === 0 && data['data'].constructor === Object)) {
                            this.setFormData(data);
                        }
                        break;
                    case AccountMaintenanceActionTypes.SAVE_ACCOUNT:
                        if (data['data'] && !(Object.keys(data['data']).length === 0 && data['data'].constructor === Object)) {
                            this.accountData = data['data'];
                            this.setFormData(data);
                        }
                        break;
                    case AccountMaintenanceActionTypes.SAVE_MODE:
                        if (data['mode'] && !(Object.keys(data['mode']).length === 0 && data['mode'].constructor === Object)) {
                            this.mode = data['mode'];
                            this.addMode = data['mode'].addMode;
                            this.updateMode = data['mode'].updateMode;
                            this.searchMode = data['mode'].searchMode;
                            this.processForm();
                        }
                        break;
                    case AccountMaintenanceActionTypes.SAVE_SYSCHAR:
                        this.sysCharParams = data['syschars'];
                        break;
                    case AccountMaintenanceActionTypes.SAVE_PROCESSED_SYSCHAR:
                        this.sysCharParams = data['processedSysChar'];
                        break;
                    case AccountMaintenanceActionTypes.FORM_INIT:

                        break;
                    case AccountMaintenanceActionTypes.SAVE_VIRTUAL_TABLE_DATA:
                        this.virtualTableField = data['virtualTableData'];
                        this.accountManagementFormGroup.controls['AccountOwnerSurname'].setValue(this.virtualTableField.AccountOwnerSurname);
                        this.accountManagementFormGroup.controls['TierDescription'].setValue(this.virtualTableField.TierSystemDescription);
                        if (this.accountManagementFormGroup.controls['TierCode'].value) {
                            let tiercode = this.accountManagementFormGroup.controls['TierCode'].value;
                            let tierdesc = this.accountManagementFormGroup.controls['TierDescription'].value;
                            this.zone.run(() => {
                                this.TierSearch = {
                                    id: tiercode,
                                    text: (tierdesc) ? tiercode + ' - ' + tierdesc : tiercode
                                };
                            });
                        }
                        this.accountManagementFormGroup.controls['CategoryDesc'].setValue(this.virtualTableField.CategoryDesc);
                        if (this.accountManagementFormGroup.controls['CategoryCode'].value) {
                            let categoryCode = this.accountManagementFormGroup.controls['CategoryCode'].value;
                            let categoryDesc = this.accountManagementFormGroup.controls['CategoryDesc'].value;
                            this.zone.run(() => {
                                this.dropdown.custCategory.active = {
                                    id: categoryCode,
                                    text: categoryCode + ' - ' + categoryDesc
                                };
                            });
                        }
                        else {
                            this.dropdown.custCategory.active = {
                                id: '',
                                text: ''
                            };
                        }
                        break;
                    case AccountMaintenanceActionTypes.VALIDATE_FORMS:
                        if (typeof (data['validate'].accountManagement) !== 'undefined') {
                            this.validateForm();
                        }
                        break;
                    case AccountMaintenanceActionTypes.LOAD_FORM_GROUP:

                        break;
                    default:
                        break;
                }
            }

        });

        this.translateService.setUpTranslation();

    }

    ngOnInit(): void {
        String.prototype['capitalizeFirstLetter'] = function (): any {
            return this.charAt(0).toUpperCase() + this.slice(1);
        };
        this.defaultCode.country = this.utilService.getCountryCode();
        this.defaultCode.business = this.utilService.getBusinessCode();
        this.inputParamsEmployeeSearch.serviceBranchNumber = this.utilService.getBranchCode();
        this.inputParamsEmployeeSearch.BranchNumber = this.utilService.getBranchCode();
        //if (this.storeData && this.storeData['data'] && this.storeData['mode'] && this.storeData['mode'].updateMode && this.storeData['data'].AccountNumber) {
        this.setGridProperties();
        this.applyGridFilter();
        this.buildGrid();
        //}

        this.dispathFormGroup();
    }

    public dispathFormGroup(): void {
        this.store.dispatch({
            type: AccountMaintenanceActionTypes.FORM_GROUP, payload: {
                accountManagement: this.accountManagementFormGroup
            }
        });

        this.store.dispatch({
            type: AccountMaintenanceActionTypes.SAVE_REQUIRED_FIELD, payload: {
                accountManagement: this.fieldRequired
            }
        });
        this.store.dispatch({
            type: AccountMaintenanceActionTypes.SAVE_VISIBILITY_FIELD, payload: {
                accountManagement: this.fieldVisibility
            }
        });
    }

    private applyGridFilter(): void {
        let objEmployeeCode = {
            'fieldName': 'Employee',
            'index': 0,
            'colName': 'Employee',
            'sortType': 'ASC'
        };
        this.gridSortHeaders.push(objEmployeeCode);
        let objSuspendInd = {
            'fieldName': 'Suspended',
            'index': 1,
            'colName': 'Suspended',
            'sortType': 'ASC'
        };
        this.gridSortHeaders.push(objSuspendInd);
        let objTransLevel = {
            'fieldName': 'Level',
            'index': 2,
            'colName': 'Level',
            'sortType': 'ASC'
        };
        this.gridSortHeaders.push(objTransLevel);
        let objTransNumber = {
            'fieldName': 'Reference',
            'index': 3,
            'colName': 'Reference',
            'sortType': 'ASC'
        };
        this.gridSortHeaders.push(objTransNumber);

        let objReviewDate = {
            'fieldName': 'Next',
            'index': 6,
            'colName': 'Next',
            'sortType': 'ASC'
        };
        this.gridSortHeaders.push(objReviewDate);

    }


    ngOnDestroy(): void {
        if (this.storeSubscription)
            this.storeSubscription.unsubscribe();
    }


    public setFormData(data: any): void {
        if (data['data']) {
            this.accountManagementFormGroup.controls['TierCode'].setValue(data['data'].TierCode);
            this.accountManagementFormGroup.controls['AccountOwner'].setValue(data['data'].AccountOwner);
            this.accountManagementFormGroup.controls['CategoryCode'].setValue(data['data'].CategoryCode);
        }
        if (data['virtualTableData']) {
            this.accountManagementFormGroup.controls['TierDescription'].setValue(data['virtualTableData'].TierSystemDescription);
            this.accountManagementFormGroup.controls['AccountOwnerSurname'].setValue(data['virtualTableData'].AccountOwnerSurname);
            this.accountManagementFormGroup.controls['CategoryDesc'].setValue(data['virtualTableData'].CategoryDesc);
        }

        if (this.accountManagementFormGroup.controls['TierCode'].value) {
            let tiercode = this.accountManagementFormGroup.controls['TierCode'].value;
            let tierdesc = this.accountManagementFormGroup.controls['TierDescription'].value;
            this.zone.run(() => {
                //this.TierSearch = (tierdesc) ? tiercode + ' - ' + tierdesc : tiercode;
                this.TierSearch = {
                    id: tiercode,
                    text: (tierdesc) ? tiercode + ' - ' + tierdesc : tiercode
                };
            });
        }
        else {
            this.TierSearch = {
                id: '',
                text: ''
            };
        }

        if (this.accountManagementFormGroup.controls['CategoryCode'].value) {
            let categoryCode = this.accountManagementFormGroup.controls['CategoryCode'].value;
            let categoryDesc = this.accountManagementFormGroup.controls['CategoryDesc'].value;
            this.zone.run(() => {
                this.dropdown.custCategory.active = {
                    id: categoryCode,
                    text: categoryCode + ' - ' + categoryDesc
                };
            });
        }
        else {
            this.dropdown.custCategory.active = {
                id: '',
                text: ''
            };
        }

        if (this.storeData && this.storeData['data'] && this.storeData['mode'] && this.storeData['mode'].updateMode) {
            this.applyGridFilter();
            this.buildGrid();
        }
    }

    public validateForm(): void {
        for (let j in this.fieldVisibility) {
            if (j) {
                let key = j['capitalizeFirstLetter']();
                if (!this.fieldVisibility[j]) {
                    if (this.accountManagementFormGroup.controls[key]) {
                        this.accountManagementFormGroup.controls[key].clearValidators();
                    }
                }
            }
        }
        for (let i in this.accountManagementFormGroup.controls) {
            if (this.accountManagementFormGroup.controls[i].enabled) {
                this.accountManagementFormGroup.controls[i].markAsTouched();
            } else {
                this.accountManagementFormGroup.controls[i].clearValidators();
            }
        }
        this.accountManagementFormGroup.updateValueAndValidity();
        let formValid = null;
        if (!this.accountManagementFormGroup.enabled) {
            formValid = true;
        } else {
            formValid = this.accountManagementFormGroup.valid;
        }
        this.store.dispatch({
            type: AccountMaintenanceActionTypes.FORM_GROUP, payload: {
                accountManagement: this.accountManagementFormGroup
            }
        });
        this.store.dispatch({
            type: AccountMaintenanceActionTypes.SAVE_REQUIRED_FIELD, payload: {
                accountManagement: this.fieldRequired
            }
        });
        this.store.dispatch({
            type: AccountMaintenanceActionTypes.SAVE_VISIBILITY_FIELD, payload: {
                accountManagement: this.fieldVisibility
            }
        });
        this.store.dispatch({
            type: AccountMaintenanceActionTypes.FORM_VALIDITY, payload: {
                accountManagement: formValid
            }
        });
    }



    public processForm(): any {
        if (this.mode['updateMode'] && !this.mode['searchMode'] && !this.mode['addMode']) {
            //this.addressFormGroup.controls['AccountAddressLine1'].enable();
            this.accountManagementFormGroup.controls['TierCode'].enable();
            this.accountManagementFormGroup.controls['AccountOwner'].enable();
            this.accountManagementFormGroup.controls['CategoryCode'].enable();
            this.accountManagementFormGroup.controls['TierDescription'].enable();
            this.accountManagementFormGroup.controls['AccountOwnerSurname'].disable();
            this.accountManagementFormGroup.controls['CategoryDesc'].disable();
            this.fieldDisabled.isCmdAddOwnerDisabled = true;
            this.accountManagementFormGroup.controls['cmdAddOwner'].disable();
            this.isRefreshEnable = true;
            this.isEmployeeSearchEllipsisDisabled = false;
            this.isTierCodeDisabled = false;
            this.dropdown.custCategory.isDisabled = false;
        }

        if (this.mode['searchMode'] && !this.mode['updateMode'] && !this.mode['addMode']) {
            if (this.accountReviewOwnerGrid && typeof this.accountReviewOwnerGrid !== undefined) {
                this.accountReviewOwnerGrid.clearGridData();
            }

            this.accountManagementFormGroup.controls['TierCode'].disable();
            this.accountManagementFormGroup.controls['AccountOwner'].disable();
            this.accountManagementFormGroup.controls['CategoryCode'].disable();
            this.accountManagementFormGroup.controls['TierDescription'].disable();
            this.accountManagementFormGroup.controls['AccountOwnerSurname'].disable();
            this.accountManagementFormGroup.controls['CategoryDesc'].disable();
            this.fieldDisabled.isCmdAddOwnerDisabled = true;
            this.accountManagementFormGroup.controls['cmdAddOwner'].disable();
            this.isRefreshEnable = true;
            this.isEmployeeSearchEllipsisDisabled = true;
            this.isTierCodeDisabled = true;
            this.dropdown.custCategory.isDisabled = true;
        }


        if (this.mode['addMode'] && !this.mode['updateMode'] && !this.mode['searchMode']) {
            this.fieldDisabled.isCmdAddOwnerDisabled = false;
            this.accountManagementFormGroup.controls['TierCode'].enable();
            this.accountManagementFormGroup.controls['AccountOwner'].enable();
            this.accountManagementFormGroup.controls['CategoryCode'].enable();
            this.accountManagementFormGroup.controls['TierDescription'].enable();
            this.accountManagementFormGroup.controls['AccountOwnerSurname'].disable();
            this.accountManagementFormGroup.controls['CategoryDesc'].disable();
            this.accountManagementFormGroup.controls['TierCode'].setValue('');
            this.accountManagementFormGroup.controls['AccountOwner'].setValue('');
            this.accountManagementFormGroup.controls['CategoryCode'].setValue('');
            this.accountManagementFormGroup.controls['TierDescription'].setValue('');
            this.accountManagementFormGroup.controls['AccountOwnerSurname'].setValue('');
            this.accountManagementFormGroup.controls['CategoryDesc'].setValue('');
            this.accountManagementFormGroup.controls['cmdAddOwner'].enable();
            if (this.accountReviewOwnerGrid && typeof this.accountReviewOwnerGrid !== undefined) {
                this.accountReviewOwnerGrid.clearGridData();
            }
            this.isRefreshEnable = true;
            this.isEmployeeSearchEllipsisDisabled = false;
            this.isTierCodeDisabled = false;
            this.dropdown.custCategory.isDisabled = false;
            this.dropdown.custCategory.active = {
                id: '',
                text: ''
            };
        }

        if (this.mode['addMode'] || this.mode['updateMode']) {
            this.inputParams = Object.assign({}, this.inputParams, {
                'countryCode': this.storeData['code'].country,
                'businessCode': this.storeData['code'].business
            });
            this.inputParamsEmployeeSearch = Object.assign({}, this.inputParamsEmployeeSearch, {
                'countryCode': this.storeData['code'].country,
                'businessCode': this.storeData['code'].business
            });
        }
        this.accountManagementFormGroup.updateValueAndValidity();
    }

    public modalHidden(): void {
        //TODO:
    }

    public onEmployeeDataReceived(data: any): void {
        //console.log('-----', data);
        if (data && data.AccountOwner) {
            this.accountManagementFormGroup.controls['AccountOwner'].setValue(data.AccountOwner);
        }
        if (data && data.AccountOwnerSurname) {
            this.accountManagementFormGroup.controls['AccountOwnerSurname'].setValue(data.AccountOwnerSurname);
        }
        this.accountManagementFormGroup.updateValueAndValidity();
    }

    public getGridInfo(info: any): void {
        if (info.totalRows && this.accountReviewOwnerPagination) {
            this.accountReviewOwnerPagination.totalItems = info.totalRows;
        }
    }
    public getCurrentPage(data: any): void {
        this.currentPage = data.value;
        this.applyGridFilter();
        this.buildGrid();
    }

    public buildGrid(): void {
        this.search = new URLSearchParams();
        this.inputParams.module = this.queryParams.module;
        this.inputParams.method = this.queryParams.method;
        this.inputParams.operation = this.queryParams.operation;
        this.search.set(this.serviceConstants.Action, '0');
        if (this.storeData && this.storeData['code'] && this.storeData['code'].business) {
            this.search.set(this.serviceConstants.BusinessCode, this.storeData['code'].business);
            this.search.set(this.serviceConstants.CountryCode, this.storeData['code'].country);
        } else {
            this.search.set(this.serviceConstants.BusinessCode, this.defaultCode.business);
            this.search.set(this.serviceConstants.CountryCode, this.defaultCode.country);
        }

        if (this.storeData['formGroup'].main && this.storeData['formGroup'].main.controls['AccountNumber'] && this.storeData['formGroup'].main.controls['AccountNumber'].value) {
            this.search.set('AccountNumber', this.storeData['formGroup'].main.controls['AccountNumber'].value);
        }
        else {
            this.search.set('AccountNumber', '');
        }
        this.search.set('riGridMode', '0');
        this.search.set('riGridHandle', (Math.floor(Math.random() * 900000) + 100000).toString());
        this.search.set('PageSize', '10');
        this.search.set('PageCurrent', this.currentPage.toString());
        this.search.set(this.serviceConstants.GridHeaderClickedColumn, this.headerClicked);
        this.search.set(this.serviceConstants.GridSortOrder, this.sortType);
        this.inputParams.search = this.search;
        this.accountReviewOwnerGrid.showTick = true;
        this.accountReviewOwnerGrid.loadGridData(this.inputParams);
    }

    public onGridRowClick(event: any): void {
        //this.rowId = event.cellData.rowID;
        if (event.cellIndex === 0) {
            //this.router.navigate([ContractManagementModuleRoutes.ICABSAACCOUNTMAINTENANCE], { queryParams: { Mode: 'VisitToleranceGrid' } });
            if (!this.addMode && this.storeData['formGroup'].main.controls['AccountNumber'].value) {
                let cellData: any = this.accountReviewOwnerGrid.getCellInfoForSelectedRow(event.rowIndex, 0);
                this.selectedOwner = cellData.additionalData;
                this.callOwnerMaintenance('update');
            }
        }
    }

    public onChangeShow(event: any): void {
        this.refresh();
    }

    public refresh(): void {
        this.currentPage = 1;
        this.headerClicked = '';
        this.buildGrid();
    }

    public sortGrid(obj: any): void {
        this.headerClicked = obj.fieldname;
        this.sortType = obj.sort === 'DESC' ? 'Descending' : 'Ascending';
        this.buildGrid();
    }

    public onAccountOwnerDataReceived(data: any, route: any): void {
        //this.logger.log('onAccountOwnerDataReceived -- ', data);
    }

    private onKeyDown(event: any): void {
        if (event && event.target) {
            if (event.keyCode === 34) {
                if (event.target.id === 'TierCode') {
                    //TODO:
                }
                else if (event.target.id === 'AccountOwner') {
                    //TODO:
                }
                else if (event.target.id === 'CategoryCode') {
                    //TODO:
                }
            }
        }
    }

    public onCmdAddOwnerClick(): void {
        this.callOwnerMaintenance('add');
    }

    public callOwnerMaintenance(cUpdateMode: any): void {
        let accountName = '';
        let accountNumber = '';
        if (this.storeData && this.storeData['formGroup'] && this.storeData['formGroup'].main) {
            accountNumber = this.storeData['formGroup'].main.controls['AccountNumber'].value;
            accountName = this.storeData['formGroup'].main.controls['AccountName'].value;
        }

        this.router.navigate([InternalMaintenanceApplicationModuleRoutes.ICABSAACCOUNTOWNERMAINTENANCE], {
            queryParams: {
                parentMode: cUpdateMode,
                SelectedOwner: this.selectedOwner,
                AccountNumber: accountNumber,
                AccountName: accountName
            }
        });

    }

    public onTIERSearchReceived(obj: any): void {
        if (obj && obj.TierCode) {
            let desc = (obj.hasOwnProperty('TierSystemDescription') ? obj.TierSystemDescription : obj.Object.TierSystemDescription);
            //this.TierSearch = obj.TierCode + ' - ' + desc;
            this.TierSearch = {
                id: obj.TierCode,
                text: (desc) ? obj.TierCode + ' - ' + desc : obj.TierCode
            };
            this.accountManagementFormGroup.controls['TierCode'].setValue(obj.TierCode);
            this.accountManagementFormGroup.controls['TierDescription'].setValue(desc);
            this.accountManagementFormGroup.updateValueAndValidity();
        }
    }

    public setGridProperties(): any {
        this.validateProperties = [
            {
                'type': MntConst.eTypeTextFree,
                'index': 0,
                'align': 'center'
            },
            {
                'type': MntConst.eTypeImage,
                'index': 1,
                'align': 'center'
            },
            {
                'type': MntConst.eTypeTextFree,
                'index': 2,
                'align': 'center'
            },
            {
                'type': MntConst.eTypeTextFree,
                'index': 3,
                'align': 'center'
            },
            {
                'type': MntConst.eTypeTextFree,
                'index': 4,
                'align': 'center'
            },
            // {
            //     'type': MntConst.eTypeInteger,
            //     'index': 5,
            //     'align': 'center'
            // },
            {
                'type': MntConst.eTypeDate,
                'index': 6,
                'align': 'center'
            }
            // ,
            // {
            //     'type': MntConst.eTypeInteger,
            //     'index': 7,
            //     'align': 'center'
            // }
        ];
    }

    public onCategoryCodeDataReceived(data: any): void {
        if (data) {
            this.accountManagementFormGroup.controls['CategoryCode'].setValue(data['CategoryCode'] || '');
            this.accountManagementFormGroup.controls['CategoryDesc'].setValue(data['CategoryDesc'] || '');
        }
    }
}
