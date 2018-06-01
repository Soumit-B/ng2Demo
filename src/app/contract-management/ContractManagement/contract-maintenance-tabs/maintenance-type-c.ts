import { Component, NgZone, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { URLSearchParams } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import * as moment from 'moment';
import { HttpService } from '../../../../shared/services/http-service';
import { ContractActionTypes } from '../../../actions/contract';
import { ServiceConstants } from '../../../../shared/constants/service.constants';
import { EmployeeSearchComponent } from '../../../internal/search/iCABSBEmployeeSearch';
import { GlobalConstant } from '../../../../shared/constants/global.constant';
import { ErrorConstant } from '../../../../shared/constants/error.constant';
import { AuthService } from '../../../../shared/services/auth.service';
import { Utils } from '../../../../shared/services/utility';
import { GlobalizeService } from '../../../../shared/services/globalize.service';

@Component({
    selector: 'icabs-maintenance-type-c',
    templateUrl: 'maintenance-type-c.html'
})

export class MaintenanceTypeCComponent implements OnInit, AfterViewInit, OnDestroy {
    public inputParams: any = { 'parentMode': 'Contract-Search', 'ContractTypeCode': '', 'countryCode': '', 'businessCode': '' };
    public inputParamsEmployeeSearch: any = { 'parentMode': 'LookUp-ContractSalesEmployeeReturn', 'countryCode': '', 'businessCode': '', 'negativeBranchNumber': '' };
    public inputParamsContractOwner: any = { 'parentMode': 'LookUp-ContractOwner1', 'countryCode': '', 'businessCode': '' };
    public storeSubscription: Subscription;
    public querySubscription: Subscription;
    public translateSubscription: Subscription;
    public maintenanceCFormGroup: FormGroup;
    public fieldVisibility: any = {
        'companyCode' : true,
        'companyDesc' : true,
        'salesEmployee' : true,
        'salesEmploeeSurname' : true,
        'contractOwner' : true,
        'contractOwnerSurname' : true,
        'companyVatNumber' : true,
        'companyVatNumber2' : true,
        'limitedCompany' : true,
        'companyRegistrationNumber' : true,
        'noticePeriod' : true,
        'externalReference' : true,
        'interCompanyPortfolio' : true,
        'contractReference': true,
        'agreementNumber' : true,
        'renewalAgreementNumber' : true,
        'contractResignDate' : true,
        'telesales' : true,
        'groupAccountPriceGroupID' : true,
        'groupAccountPriceGroupDesc' : true
    };
    public fieldRequired: any = {
        'companyCode' : true,
        'companyDesc' : false,
        'salesEmployee' : true,
        'salesEmploeeSurname' : false,
        'contractOwner' : false,
        'contractOwnerSurname' : false,
        'companyVatNumber' : false,
        'companyVatNumber2' : false,
        'limitedCompany' : false,
        'companyRegistrationNumber' : false,
        'noticePeriod' : false,
        'externalReference' : false,
        'interCompanyPortfolio' : false,
        'contractReference': false,
        'agreementNumber': false,
        'renewalAgreementNumber': false,
        'contractResignDate': false,
        'telesales': false,
        'groupAccountPriceGroupID': false,
        'groupAccountPriceGroupDesc': false
    };
    public companyList: Array<any> = [];

    public isCompanyDropdownDisabled: boolean = true;
    public contractResignDateDisplay: string = '';
    public companyItemsToDisplay: Array<any> = ['code', 'desc'];
    public contractResignDate: Date = void 0;
    public dateObjectsEnabled: Object = {
        contractResignDate: false
    };
    public dateObjectsValidate: Object = {
        contractResignDate: false
    };
    public clearDate: Object = {
        contractResignDate: false
    };
    public employeeSearchComponent: any = '';//EmployeeSearchComponent;
    public contractOwnerComponent = EmployeeSearchComponent; //EmployeeSearchComponent;
    public groupAccountPriceComponent = ''; //EmployeeSearchComponent;
    public autoOpen: boolean = false;
    public modalConfig: any = {
        backdrop: 'static',
        keyboard: true
    };
    public mode: Object;
    public params: Object;
    public otherParams: Object;
    public sysCharParams: Object;
    public searchModalRoute: string = '';
    public showHeader: boolean = true;
    public showCloseButton: boolean = true;
    public isEmployeeSearchEllipsisDisabled: boolean = true;
    public isContractOwnerEllipsisDisabled: boolean = true;
    public isGroupAccountPriceSearchEllipsisDisabled: boolean = true;
    public companySelected: Object = {
        id: '',
        text: ''
    };
    public parentQueryParams: any;
    public storeData: any;
    public queryLookUp: URLSearchParams = new URLSearchParams();
    public vCompanyVATNumberLabel: string = '';
    public fieldRequiredClone: Object = {};
    public fieldVisibilityClone: Object = {};
    public queryParamsContract: any = {
        action: '0',
        operation: 'Application/iCABSAContractMaintenance',
        module: 'contract',
        method: 'contract-management/maintenance',
        contentType: 'application/x-www-form-urlencoded',
        branchNumber: '',
        branchName: ''
    };

    constructor(
        private zone: NgZone,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private store: Store<any>,
        private serviceConstants: ServiceConstants,
        private httpService: HttpService,
        private utils: Utils,
        private authService: AuthService,
        private globalize: GlobalizeService
        ) {
        this.maintenanceCFormGroup = this.fb.group({
            CompanyCode: [{ value: '', disabled: true }, Validators.required],
            CompanyDesc: [{ value: '', disabled: true }],
            SalesEmployee: [{ value: '', disabled: true }, Validators.required],
            SalesEmployeeSurname: [{ value: '', disabled: true }],
            ContractOwner: [{ value: '', disabled: true }],
            ContractOwnerSurname: [{ value: '', disabled: true }],
            CompanyVatNumber: [{ value: '', disabled: true }],
            CompanyVatNumber2: [{ value: '', disabled: true }],
            LimitedCompany: [{ value: false, disabled: true }],
            CompanyRegistrationNumber: [{ value: '', disabled: true }],
            NoticePeriod: [{ value: '', disabled: true }],
            ContractReference: [{ value: '', disabled: true }],
            ExternalReference: [{ value: '', disabled: true }],
            InterCompanyPortfolio: [{ value: '', disabled: true }],
            AgreementNumber: [{ value: '', disabled: true }],
            RenewalAgreementNumber: [{ value: '', disabled: true }],
            ContractResignDate: [{ value: '', disabled: true }],
            Telesales: [{ value: '', disabled: true }],
            GroupAccountPriceGroupID: [{ value: '', disabled: true }],
            GroupAccountPriceGroupDesc: [{ value: '', disabled: true }]
        });
        this.storeSubscription = store.select('contract').subscribe(data => {
            if (data && data['action']) {
                this.storeData = data;
                this.sysCharParams = data['syschars'];
                switch (data['action']) {
                    case ContractActionTypes.SAVE_DATA:
                    if (data['data'] && !(Object.keys(data['data']).length === 0 && data['data'].constructor === Object)) {
                        this.setFormData(data);
                    }
                    break;
                    case ContractActionTypes.SAVE_ACCOUNT:
                    if (data['data'] && !(Object.keys(data['data']).length === 0 && data['data'].constructor === Object)) {
                        if (data['data'].GroupAccountNumber) {
                            this.fieldVisibility.groupAccountPriceGroupID = true;
                            this.isGroupAccountPriceSearchEllipsisDisabled = false;
                        } else {
                            this.fieldVisibility.groupAccountPriceGroupID = false;
                            this.isGroupAccountPriceSearchEllipsisDisabled = true;
                        }
                    }
                    break;
                    case ContractActionTypes.SAVE_MODE:
                    this.mode = data['mode'];
                    this.processForm();
                    break;
                    case ContractActionTypes.SAVE_SYSCHAR:
                    if (data['syschars']) {
                        this.sysCharParams = data['syschars'];
                        this.processSysChar();
                    }
                    break;
                    case ContractActionTypes.SAVE_PARAMS:
                    this.params = data['params'];
                    this.inputParams = data['params'];
                    break;
                    case ContractActionTypes.SAVE_OTHER_PARAMS:
                    this.otherParams = data['otherParams'];
                    this.companyList = this.otherParams['companyList'] ? this.otherParams['companyList'] : [];
                    if (this.otherParams['vDisableFields'].indexOf('CompanyCode') > -1) {
                        this.fieldVisibility.companyCode = false;
                    } else {
                        this.fieldVisibility.companyCode = true;
                    }
                    setTimeout(() => {
                        if (this.storeData['mode'].updateMode === false) {
                            if (data['otherParams']['defaultCompanyCode']) {
                                this.companySelected = {
                                    id: '',
                                    text: this.otherParams['defaultCompanyCode'] + ' - ' + this.otherParams['defaultCompanyDesc']
                                };
                                this.maintenanceCFormGroup.controls['CompanyCode'].setValue(this.otherParams['defaultCompanyCode']);
                            } else {
                                if (data['data'].CompanyCode) {
                                    this.companySelected = JSON.parse(JSON.stringify({
                                        id: '',
                                        text: data['data'].CompanyCode + ' - ' + this.fetchCompanyDesc(data['data'].CompanyCode)
                                    }));
                                    this.maintenanceCFormGroup.controls['CompanyCode'].setValue(data['data'].CompanyCode);
                                }
                            }
                        } else {
                            if (this.maintenanceCFormGroup.controls['CompanyCode'].value) {
                                this.companySelected = JSON.parse(JSON.stringify({
                                    id: '',
                                    text: this.maintenanceCFormGroup.controls['CompanyCode'].value + ' - ' + this.fetchCompanyDesc(this.maintenanceCFormGroup.controls['CompanyCode'].value)
                                }));
                            }
                        }
                    }, 0);

                    break;
                    case ContractActionTypes.SAVE_CODE:

                    break;
                    case ContractActionTypes.SAVE_FIELD:

                    break;
                    case ContractActionTypes.SAVE_SERVICE:
                    //this.storeData['services'].localeTranslateService.setUpTranslation();
                    this.translateSubscription = this.storeData['services'].localeTranslateService.ajaxSource$.subscribe(event => {
                        if (event !== 0) {
                            this.fetchTranslationContent();
                        }
                    });
                    break;
                    case ContractActionTypes.SAVE_SENT_FROM_PARENT:

                    break;
                    case ContractActionTypes.LOOKUP:
                    break;
                    case ContractActionTypes.FORM_RESET:
                    this.fieldRequired = JSON.parse(JSON.stringify(this.fieldRequiredClone));
                    this.fieldVisibility = JSON.parse(JSON.stringify(this.fieldVisibilityClone));
                    this.storeData['fieldRequired'].typeC = this.fieldRequired;
                    this.storeData['fieldVisibility'].typeC = this.fieldVisibility;
                    for (let i in this.maintenanceCFormGroup.controls) {
                        if (this.maintenanceCFormGroup.controls.hasOwnProperty(i)) {
                          this.maintenanceCFormGroup.controls[i].clearValidators();
                        }
                    }
                    this.maintenanceCFormGroup.controls['CompanyCode'].setValidators(Validators.required);
                    this.maintenanceCFormGroup.controls['SalesEmployee'].setValidators(Validators.required);
                    this.maintenanceCFormGroup.reset();
                    break;
                    case ContractActionTypes.VALIDATE_FORMS:
                    if (data['validate'].typeC) {
                        this.validateForm();
                    }
                    break;
                    case ContractActionTypes.SET_EMPLOYEE_ON_BRANCH_CHANGE:
                    this.setEmployeeOnBranchChange({});
                    break;
                    default:
                    break;
                }
            }
        });
    }

    ngOnInit(): void {
        this.fieldRequiredClone = JSON.parse(JSON.stringify(this.fieldRequired));
        this.fieldVisibilityClone = JSON.parse(JSON.stringify(this.fieldVisibility));
        this.employeeSearchComponent = EmployeeSearchComponent;
    }

    ngAfterViewInit(): void {
        this.store.dispatch({
            type: ContractActionTypes.FORM_GROUP, payload: {
                typeC: this.maintenanceCFormGroup
            }
        });
        this.store.dispatch({
            type: ContractActionTypes.SAVE_REQUIRED_FIELD, payload: {
                typeC: this.fieldRequired
            }
        });
        this.store.dispatch({
            type: ContractActionTypes.SAVE_VISIBILITY_FIELD, payload: {
                typeC: this.fieldVisibility
            }
        });
        this.store.dispatch({
          type: ContractActionTypes.INITIALIZATION, payload: {
            typeC: true
          }
        });
        setTimeout(() => {
            if (this.storeData && this.storeData['data'] && !(Object.keys(this.storeData['data']).length === 0 && this.storeData['data'].constructor === Object)) {
                this.setFormData(this.storeData);
            }
        }, 0);

    }

    ngOnDestroy(): void {
        this.storeSubscription.unsubscribe();
        if (this.querySubscription)
            this.querySubscription.unsubscribe();
        if (this.translateSubscription)
            this.translateSubscription.unsubscribe();
    }

    public fetchTranslationContent(): void {
        // translation content
    }

    public toUpperCase(control: string): void {
        this.maintenanceCFormGroup.controls[control].setValue(this.maintenanceCFormGroup.controls[control].value.toUpperCase());
    }

    public getTranslatedValue(key: any, params: any): any {
        if (params) {
            return this.storeData['services'].translate.get(key, { value: params });
        } else {
            return this.storeData['services'].translate.get(key);
        }
    }

    public lookUpRecord(data: any, maxresults: number): any {
        this.queryLookUp.set(this.serviceConstants.Action, '0');
        this.queryLookUp.set(this.serviceConstants.BusinessCode, this.storeData['code'].business);
        this.queryLookUp.set(this.serviceConstants.CountryCode, this.storeData['code'].country);
        if (maxresults) {
            this.queryLookUp.set(this.serviceConstants.MaxResults, maxresults.toString());
        }
        return this.httpService.lookUpRequest(this.queryLookUp, data);
    }

    public onSalesEmployeeBlur(event: any): void {
        if (this.maintenanceCFormGroup.controls['SalesEmployee'] && this.maintenanceCFormGroup.controls['SalesEmployee'].value !== '') {
            let data = [{
                'table': 'Employee',
                'query': { 'EmployeeCode': this.maintenanceCFormGroup.controls['SalesEmployee'] ? this.maintenanceCFormGroup.controls['SalesEmployee'].value : '', BusinessCode: this.utils.getBusinessCode() },
                'fields': ['EmployeeCode', 'EmployeeSurname']
            }];
            this.lookUpRecord(data, 5).subscribe(
                (e) => {
                    if (e['results'] && e['results'].length > 0) {
                        if (e['results'][0].length > 0) {
                            this.maintenanceCFormGroup.controls['SalesEmployeeSurname'].setValue(e['results'][0][0]['EmployeeSurname']);
                        } else {
                            this.maintenanceCFormGroup.controls['SalesEmployeeSurname'].setValue('');
                            this.maintenanceCFormGroup.controls['SalesEmployee'].setErrors({});
                        }
                    } else {
                      //this.maintenanceCFormGroup.controls['SalesEmployee'].setErrors({});
                    }
                },
                (error) => {
                    // error statement
                }
                );
        }
    }

    public onContractOwnerBlur(event: any): void {
        if (this.maintenanceCFormGroup.controls['ContractOwner'] && this.maintenanceCFormGroup.controls['ContractOwner'].value !== '') {
            let data = [{
                'table': 'Employee',
                'query': { 'EmployeeCode': this.maintenanceCFormGroup.controls['ContractOwner'] ? this.maintenanceCFormGroup.controls['ContractOwner'].value : '', BusinessCode: this.utils.getBusinessCode() },
                'fields': ['EmployeeCode', 'EmployeeSurname']
            }];
            this.lookUpRecord(data, 5).subscribe(
                (e) => {
                    if (e['results'] && e['results'].length > 0) {
                        if (e['results'][0].length > 0) {
                            this.maintenanceCFormGroup.controls['ContractOwnerSurname'].setValue(e['results'][0][0]['EmployeeSurname']);
                        } else {
                            this.maintenanceCFormGroup.controls['ContractOwnerSurname'].setValue('');
                            this.maintenanceCFormGroup.controls['ContractOwner'].setErrors({});
                        }
                    } else {
                      //this.maintenanceCFormGroup.controls['SalesEmployee'].setErrors({});
                    }
                },
                (error) => {
                    // error statement
                }
                );
        }
    }

    public onGroupAccountPriceBlur(event: any): void {
        if (this.storeData['formGroup'].main.controls['GroupAccountNumber'].value !== '') {
            if (this.maintenanceCFormGroup.controls['GroupAccountPriceGroupID'] && this.maintenanceCFormGroup.controls['GroupAccountPriceGroupID'].value !== '') {
                let data = [{
                    'table': 'GroupAccountPriceGroup',
                    'query': {
                        'GroupAccountPriceGroupID': this.maintenanceCFormGroup.controls['GroupAccountPriceGroupID'] ? this.maintenanceCFormGroup.controls['GroupAccountPriceGroupID'].value : '',
                        'GroupAccountNumber': this.storeData['formGroup'].main.controls['GroupAccountNumber'].value
                    },
                    'fields': ['GroupAccountPriceGroupID', 'GroupAccountPriceGroupDesc']
                }];
                this.lookUpRecord(data, 5).subscribe(
                    (e) => {
                        if (e['results'] && e['results'].length > 0) {
                            if (e['results'][0].length > 0) {
                                this.maintenanceCFormGroup.controls['GroupAccountPriceGroupDesc'].setValue(e['results'][0][0]['GroupAccountPriceGroupDesc']);
                            } else {
                                this.maintenanceCFormGroup.controls['GroupAccountPriceGroupDesc'].setValue('');
                                this.maintenanceCFormGroup.controls['GroupAccountPriceGroupID'].setErrors({});
                            }
                        } else {
                            this.maintenanceCFormGroup.controls['GroupAccountPriceGroupID'].setErrors({});
                        }
                    },
                    (error) => {
                        // error statement
                    }
                    );
            } else {
                this.maintenanceCFormGroup.controls['GroupAccountPriceGroupDesc'].setValue('');
            }
        } else if (this.maintenanceCFormGroup.controls['GroupAccountPriceGroupID'] && this.maintenanceCFormGroup.controls['GroupAccountPriceGroupID'].value !== '') {
            let data = [{
                'table': 'GroupAccountPriceGroup',
                'query': {
                    'GroupAccountPriceGroupID': this.maintenanceCFormGroup.controls['GroupAccountPriceGroupID'] ? this.maintenanceCFormGroup.controls['GroupAccountPriceGroupID'].value : '',
                    'GroupAccountNumber': this.storeData['formGroup'].main.controls['GroupAccountNumber'].value
                },
                'fields': ['GroupAccountPriceGroupID', 'GroupAccountPriceGroupDesc']
            }];
            this.lookUpRecord(data, 5).subscribe(
                (e) => {
                    if (e['results'] && e['results'].length > 0) {
                        if (e['results'][0].length > 0) {
                            this.maintenanceCFormGroup.controls['GroupAccountPriceGroupDesc'].setValue(e['results'][0][0]['GroupAccountPriceGroupDesc']);
                        } else {
                            this.maintenanceCFormGroup.controls['GroupAccountPriceGroupDesc'].setValue('');
                        }
                    }
                },
                (error) => {
                    // error statement
                }
                );
        } else {
            this.maintenanceCFormGroup.controls['GroupAccountPriceGroupDesc'].setValue('');
        }
    }

    public processSysChar(): void {
        if (this.storeData['params']) {
            if (this.storeData['params']['currentContractType'] === 'P' || this.storeData['params']['currentContractType'] === 'J') {
                this.fieldVisibility['contractResignDate'] = false;
                this.fieldVisibility['noticePeriod'] = false;
            }
        }
        if (!this.sysCharParams['vSCEnableExternalRefNotUsed']) {
            this.fieldVisibility.externalReference = false;
        } else {
            this.fieldVisibility.externalReference = true;
        }

        if (this.sysCharParams['vSCDisplayContractOwner']) {
            this.fieldVisibility.contractOwnerSurname = true;
        } else {
            this.fieldVisibility.contractOwnerSurname = false;
        }
        if (!this.sysCharParams['vSCGroupAccount']) {
            this.fieldVisibility.groupAccountPriceGroupID = false;
        }

        if (this.sysCharParams['vSCEnableMonthsNotice'] && this.storeData['params']['currentContractType'] === 'C') {
            this.fieldVisibility.noticePeriod = true;
        } else {
            this.fieldVisibility.noticePeriod = false;
        }

        if (this.sysCharParams['vSCEnableLtdCompanyAndReg']) {
            this.fieldVisibility.limitedCompany = true;
            this.fieldVisibility.companyRegistrationNumber = true;
        } else {
            this.fieldVisibility.limitedCompany = false;
            this.fieldVisibility.companyRegistrationNumber = false;
        }

        if (this.sysCharParams['vSCEnableTaxRegistrationNumber2']) {
            this.fieldVisibility.companyVatNumber2 = true;
            this.vCompanyVATNumberLabel = 'Tax Registration Number 1';
        } else {
            this.fieldVisibility.companyVatNumber2 = false;
            this.vCompanyVATNumberLabel = 'Tax Registration Number';
        }

        if (this.sysCharParams['vSCEnableExternalReference']) {
            this.maintenanceCFormGroup.controls['ExternalReference'].enable();
        } else {
            this.maintenanceCFormGroup.controls['ExternalReference'].disable();
        }

        if (this.sysCharParams['vSCDisplayContractOwner'] === true && this.sysCharParams['vSCContractOwnerRequired'] === true) {
            this.fieldRequired.contractOwnerSurname = true;
            this.maintenanceCFormGroup.controls['ContractOwner'].setValidators(Validators.required);
            this.isContractOwnerEllipsisDisabled = false;
        } else {
            this.fieldRequired.contractOwnerSurname = false;
            if (this.maintenanceCFormGroup.controls['ContractOwner'])
                this.maintenanceCFormGroup.controls['ContractOwner'].clearValidators();
            this.isContractOwnerEllipsisDisabled = true;
        }

        if (this.sysCharParams['vSCTaxRegNumber'] === true) {
            this.fieldRequired.companyVatNumber = true;
            this.maintenanceCFormGroup.controls['CompanyVatNumber'].setValidators(Validators.required);
        } else {
            this.fieldRequired.companyVatNumber = false;
            if (this.maintenanceCFormGroup.controls['CompanyVatNumber'])
                this.maintenanceCFormGroup.controls['CompanyVatNumber'].clearValidators();
        }

        this.maintenanceCFormGroup.controls['Telesales'].disable();
        if (this.storeData && this.storeData['params']['currentContractType'] === 'C') {
            if (this.sysCharParams['vSCNoticePeriod'] === true) {
                this.fieldRequired.noticePeriod = true;
                this.maintenanceCFormGroup.controls['NoticePeriod'].setValidators(Validators.required);
            } else {
                this.fieldRequired.noticePeriod = false;
                if (this.maintenanceCFormGroup.controls['NoticePeriod'])
                    this.maintenanceCFormGroup.controls['NoticePeriod'].clearValidators();
            }
        }

        if (this.sysCharParams['vSCEnableCompanyCode'] === true) {
            this.isCompanyDropdownDisabled = false;
        } else {
            this.isCompanyDropdownDisabled = true;
        }
        this.maintenanceCFormGroup.controls['ContractReference'].enable();
        this.maintenanceCFormGroup.controls['AgreementNumber'].enable();
        this.maintenanceCFormGroup.controls['RenewalAgreementNumber'].enable();
        this.maintenanceCFormGroup.updateValueAndValidity();
    }

    public setFormData(data: Object): void {
        if (!this.storeData['data']['isCopyClicked']) {
            if (data['data'].ContractResignDate) {
                this.clearDate['contractResignDate'] = false;
                let parsedDate: any = this.globalize.parseDateStringToDate(data['data'].ContractResignDate);
                if (parsedDate instanceof Date) {
                  this.contractResignDate = parsedDate;
                } else {
                  this.contractResignDate = null;
                }
                this.contractResignDateDisplay = this.globalize.parseDateToFixedFormat(data['data'].ContractResignDate) as string;
                this.maintenanceCFormGroup.controls['ContractResignDate'].setValue(this.contractResignDateDisplay);
            }

            this.maintenanceCFormGroup.controls['SalesEmployee'].setValue(data['data'].ContractSalesEmployee);
            this.maintenanceCFormGroup.controls['SalesEmployeeSurname'].setValue('');
            this.maintenanceCFormGroup.controls['ContractOwner'].setValue(data['data'].ContractOwner);
            this.maintenanceCFormGroup.controls['ContractOwnerSurname'].setValue('');
        }
        if (data['data'].CompanyCode) {
            this.companySelected = JSON.parse(JSON.stringify({
                id: '',
                text: data['data'].CompanyCode + ' - ' + this.fetchCompanyDesc(data['data'].CompanyCode)
            }));
            this.maintenanceCFormGroup.controls['CompanyCode'].setValue(data['data'].CompanyCode);
        }

        this.maintenanceCFormGroup.controls['CompanyVatNumber'].setValue(this.checkFalsy(data['data'].CompanyVATNumber));
        this.maintenanceCFormGroup.controls['CompanyVatNumber2'].setValue(this.checkFalsy(data['data'].CompanyVATNumber2));
        if (data['data'].LimitedCompanyInd) {
            if (data['data'].LimitedCompanyInd.toUpperCase() === GlobalConstant.Configuration.Yes) {
                this.maintenanceCFormGroup.controls['LimitedCompany'].setValue(true);
            } else {
                this.maintenanceCFormGroup.controls['LimitedCompany'].setValue(false);
            }
        } else {
            this.maintenanceCFormGroup.controls['LimitedCompany'].setValue(false);
        }
        this.maintenanceCFormGroup.controls['CompanyRegistrationNumber'].setValue(this.checkFalsy(data['data'].CompanyRegistrationNumber));
        this.maintenanceCFormGroup.controls['NoticePeriod'].setValue(data['data'].LostBusinessNoticePeriod);
        this.maintenanceCFormGroup.controls['ContractReference'].setValue(this.checkFalsy(data['data'].ContractReference));
        this.maintenanceCFormGroup.controls['ExternalReference'].setValue(this.checkFalsy(data['data'].ExternalReference));
        if (data['data'].InterCompanyPortfolioInd) {
            if (data['data'].InterCompanyPortfolioInd.toUpperCase() === GlobalConstant.Configuration.Yes) {
                this.maintenanceCFormGroup.controls['InterCompanyPortfolio'].setValue(true);
            } else {
                this.maintenanceCFormGroup.controls['InterCompanyPortfolio'].setValue(false);
            }
        } else {
            this.maintenanceCFormGroup.controls['InterCompanyPortfolio'].setValue(false);
        }
        this.maintenanceCFormGroup.controls['AgreementNumber'].setValue(this.checkFalsy(data['data'].AgreementNumber));
        this.maintenanceCFormGroup.controls['RenewalAgreementNumber'].setValue(this.checkFalsy(data['data'].RenewalAgreementNumber));
        //this.maintenanceCFormGroup.controls['ContractResignDate'].setValue(data.ContractResignDate);
        if (data['data'].TelesalesInd) {
            if (data['data'].TelesalesInd.toUpperCase() === GlobalConstant.Configuration.Yes) {
                this.maintenanceCFormGroup.controls['Telesales'].setValue(true);
            } else {
                this.maintenanceCFormGroup.controls['Telesales'].setValue(false);
            }
        } else {
            this.maintenanceCFormGroup.controls['Telesales'].setValue(false);
        }
        if (data['data'].GroupAccountPriceGroupID && this.checkFalsy(data['data'].GroupAccountPriceGroupID) !== '') {
            this.maintenanceCFormGroup.controls['GroupAccountPriceGroupID'].setValue(data['data'].GroupAccountPriceGroupID.toString().trim());
            this.maintenanceCFormGroup.controls['GroupAccountPriceGroupDesc'].setValue('');
        } else {
            this.fieldVisibility.groupAccountPriceGroupID = false;
        }

    }

    public checkFalsy(value: any): string {
        if (value === null || value === undefined) {
          return '';
        } else {
          return value.toString().trim();
        }
    }

    public fetchCompanyDesc(val: string): string {
      let found: boolean = false;
      if (this.companyList === null || this.companyList === undefined) {
          this.companyList = [];
      }
      this.companyList = this.storeData['otherParams'] ? this.storeData['otherParams'].companyList : [];
      if (this.companyList) {
          if (val !== null && val !== undefined) {
              for (let i = 0; i < this.companyList.length; i++) {
                if (val.trim() === this.companyList[i].code.toString()) {
                  return this.companyList[i].desc;
                }
              }
              if (!found) {
                return '';
              }
          }
      }
    }

    public fetchCompanyDetails(companyCode: string): any {
        let userCode = this.authService.getSavedUserCode();
        let data = [{
          'table': 'Company',
          'query': { 'BusinessCode': this.storeData['code'].business, 'UserCode': userCode.UserCode, 'CompanyCode': companyCode },
          'fields': [ 'CompanyCode', 'CompanyDesc' ]
        }];
        this.lookUpRecord(data, 5).subscribe((e) => {
              if (e.status === GlobalConstant.Configuration.Failure) {
                //this.errorService.emitError(e.oResponse);
              } else {
                if (!e.errorMessage) {
                    if (e['results'] && e['results'].length > 0) {
                        this.companySelected = JSON.parse(JSON.stringify({
                            id: '',
                            text: companyCode
                        }));
                        this.maintenanceCFormGroup.controls['CompanyCode'].setValue(companyCode);
                    } else {
                        this.companySelected = JSON.parse(JSON.stringify({
                            id: '',
                            text: companyCode
                        }));
                        this.maintenanceCFormGroup.controls['CompanyCode'].setValue(companyCode);
                    }

                }
              }
            },
            (error) => {
              //this.errorService.emitError(error);
            });
      }

    public onEmployeeDataReceived(data: any): void {
        if (data) {
            this.maintenanceCFormGroup.controls['SalesEmployee'].setValue(data.ContractSalesEmployee || data.EmployeeCode);
            this.onSalesEmployeeBlur({});
        }
    }

    public onContractOwnerDataReceived(data: any): void {
        if (data) {
            this.maintenanceCFormGroup.controls['ContractOwner'].setValue(data.ContractSalesEmployee || data.EmployeeCode);
            this.onContractOwnerBlur({});
        }
    }

    public onGroupAccountPriceDataReceived(data: any): void {
        //  to be added
    }

    public onCompanySelected(data: any): void {
        if (this.sysCharParams['vSCEnableBankDetailEntry'] && this.sysCharParams['vSCEnableSEPAFinanceMandate'] && !this.sysCharParams['vSCEnableSEPAFinanceMandateLog']) {
            this.httpService.riGetErrorMessage(3201, this.utils.getCountryCode(), this.utils.getBusinessCode()).subscribe((res: any) => {
                if (res !== 0) {
                    if (res === ErrorConstant.Message.ErrorMessageNotFound) {
                        this.getTranslatedValue(res, null).subscribe((msg: string) => {
                            if (msg) {
                                this.storeData['services'].errorService.emitError({
                                    errorMessage: msg
                                });
                            } else {
                                this.storeData['services'].errorService.emitError({
                                    errorMessage: res
                                });
                            }
                        });
                    } else {
                        this.storeData['services'].errorService.emitError({
                            errorMessage: res
                        });
                    }
                    this.maintenanceCFormGroup.controls['CompanyCode'].setValue(data.companyCode);
                    this.validateCompanyCode();
                } else {
                    this.maintenanceCFormGroup.controls['CompanyCode'].setValue(data.companyCode);
                }
            });

        } else {
            this.maintenanceCFormGroup.controls['CompanyCode'].setValue(data.companyCode);
            this.validateCompanyCode();
        }
        this.maintenanceCFormGroup.controls['CompanyCode'].markAsDirty();
    }

    public validateCompanyCode(): void {
        if (this.storeData['formGroup'].main.controls['AccountNumber'].value !== '') {
            this.fetchContractData('CompanyCodeChange,GetPaymentTypeDetails,GetNoticePeriod', {
                'AccountNumber': this.storeData['formGroup'].main.controls['AccountNumber'].value,
                'CompanyCode': this.storeData['formGroup'].typeC.controls['CompanyCode'] ? this.storeData['formGroup'].typeC.controls['CompanyCode'].value : '',
                'ContractTypeCode': this.inputParams.currentContractType,
                'PaymentTypeCode': this.storeData['formGroup'].typeB.controls['PaymentTypeCode'] ? this.storeData['formGroup'].typeB.controls['PaymentTypeCode'].value : '',
                'ContractNumber': this.storeData['formGroup'].main.controls['ContractNumber'] ? this.storeData['formGroup'].main.controls['ContractNumber'].value : '',
                'BranchNumber': this.storeData['formGroup'].main.controls['NegBranchNumber'] ? this.storeData['formGroup'].main.controls['NegBranchNumber'].value : '',
                'action': '6'
            }).subscribe((data) => {
                if (data && !data.fullError) {
                    this.storeData['formGroup'].main.controls['AccountNumber'].clearValidators();
                    this.storeData['formGroup'].main.controls['AccountNumber'].updateValueAndValidity();
                    this.lookUpRecord([{
                      'table': 'Account',
                      'query': { 'BusinessCode': this.storeData['code'].business ? this.storeData['code'].business : this.utils.getBusinessCode(), 'AccountNumber': this.storeData['formGroup'].main.controls['AccountNumber'] ? this.storeData['formGroup'].main.controls['AccountNumber'].value : '' },
                      'fields': ['AccountName', 'AccountNumber', 'AccountBalance']
                    }], 5).subscribe((account) => {
                      if (account['results'] && account['results'].length > 0) {
                        if (account['results'][0].length > 0) {
                          this.storeData['formGroup'].main.controls['AccountName'].setValue(account['results'][0][0]['AccountName']);
                          this.storeData['formGroup'].main.controls['AccountBalance'].setValue(account['results'][0][0]['AccountBalance']);
                        }
                      }
                    }
                    );
                } else {
                    this.storeData['services'].errorService.emitError(data);
                }
            }, (error) => {
                // statement
            });
        }
    }

    public validateForm(): void {
        for (let j in this.fieldVisibility) {
            if (this.fieldVisibility.hasOwnProperty(j)) {
                let key = j['capitalizeFirstLetter']();
                if (!this.fieldVisibility[j]) {
                    if (this.maintenanceCFormGroup.controls[key]) {
                        this.maintenanceCFormGroup.controls[key].clearValidators();
                    }
                }
            }
        }
        for (let i in this.maintenanceCFormGroup.controls) {
            if (this.maintenanceCFormGroup.controls.hasOwnProperty(i)) {
                this.maintenanceCFormGroup.controls[i].markAsTouched();
            }
        }
        this.dateObjectsValidate['contractResignDate'] = true;
        setTimeout(() => {
            this.dateObjectsValidate['contractResignDate'] = false;
        }, 100);
        this.maintenanceCFormGroup.updateValueAndValidity();
        let formValid = null;
        if (!this.maintenanceCFormGroup.enabled) {
            formValid = true;
        } else {
            formValid = this.maintenanceCFormGroup.valid;
        }
        this.store.dispatch({
            type: ContractActionTypes.FORM_GROUP, payload: {
                typeC: this.maintenanceCFormGroup
            }
        });
        this.store.dispatch({
            type: ContractActionTypes.SAVE_REQUIRED_FIELD, payload: {
                typeC: this.fieldRequired
            }
        });
        this.store.dispatch({
            type: ContractActionTypes.SAVE_VISIBILITY_FIELD, payload: {
                typeC: this.fieldVisibility
            }
        });
        this.store.dispatch({
            type: ContractActionTypes.FORM_VALIDITY, payload: {
                typeC: formValid
            }
        });
    }

    public processForm(): void {
        if (this.mode['updateMode'] && !this.mode['searchMode'] && !this.mode['addMode']) {
            this.maintenanceCFormGroup.controls['SalesEmployee'].enable();
            this.maintenanceCFormGroup.controls['ContractOwner'].enable();
            this.maintenanceCFormGroup.controls['CompanyVatNumber'].enable();
            this.maintenanceCFormGroup.controls['CompanyVatNumber2'].enable();
            this.maintenanceCFormGroup.controls['LimitedCompany'].enable();
            this.maintenanceCFormGroup.controls['CompanyRegistrationNumber'].enable();
            this.maintenanceCFormGroup.controls['NoticePeriod'].enable();
            this.maintenanceCFormGroup.controls['ContractReference'].enable();
            this.maintenanceCFormGroup.controls['InterCompanyPortfolio'].enable();
            this.maintenanceCFormGroup.controls['AgreementNumber'].enable();
            this.maintenanceCFormGroup.controls['RenewalAgreementNumber'].enable();
            this.maintenanceCFormGroup.controls['GroupAccountPriceGroupID'].enable();
            this.dateObjectsEnabled['contractResignDate'] = true;
            this.isEmployeeSearchEllipsisDisabled = false;
            this.isCompanyDropdownDisabled = false;
        }

        if (this.mode['searchMode'] && !this.mode['updateMode'] && !this.mode['addMode']) {
            this.maintenanceCFormGroup.controls['SalesEmployee'].disable();
            this.maintenanceCFormGroup.controls['ContractOwner'].disable();
            this.maintenanceCFormGroup.controls['CompanyVatNumber'].disable();
            this.maintenanceCFormGroup.controls['CompanyVatNumber2'].disable();
            this.maintenanceCFormGroup.controls['LimitedCompany'].disable();
            this.maintenanceCFormGroup.controls['CompanyRegistrationNumber'].disable();
            this.maintenanceCFormGroup.controls['NoticePeriod'].disable();
            this.maintenanceCFormGroup.controls['ContractReference'].disable();
            this.maintenanceCFormGroup.controls['InterCompanyPortfolio'].disable();
            this.maintenanceCFormGroup.controls['AgreementNumber'].disable();
            this.maintenanceCFormGroup.controls['RenewalAgreementNumber'].disable();
            this.maintenanceCFormGroup.controls['GroupAccountPriceGroupID'].disable();
            if (this.mode && this.mode['prevMode'] === 'Add') {
                this.contractResignDate = void 0;
                this.contractResignDateDisplay = '';
                this.maintenanceCFormGroup.controls['ContractResignDate'].setValue(this.contractResignDateDisplay);

            }
            this.dateObjectsEnabled['contractResignDate'] = false;
            this.isEmployeeSearchEllipsisDisabled = true;
            this.isCompanyDropdownDisabled = true;

            if (this.storeData['data'] && (Object.keys(this.storeData['data']).length === 0 && this.storeData['data'].constructor === Object)) {
              this.companySelected = {
                id: '',
                text: ''
              };
            }
        }

        if (this.mode['addMode'] && !this.mode['updateMode'] && !this.mode['searchMode']) {
            this.maintenanceCFormGroup.controls['SalesEmployee'].enable();
            this.maintenanceCFormGroup.controls['ContractOwner'].enable();
            this.maintenanceCFormGroup.controls['CompanyVatNumber'].enable();
            this.maintenanceCFormGroup.controls['CompanyVatNumber2'].enable();
            this.maintenanceCFormGroup.controls['LimitedCompany'].enable();
            this.maintenanceCFormGroup.controls['CompanyRegistrationNumber'].enable();
            this.maintenanceCFormGroup.controls['NoticePeriod'].enable();
            this.maintenanceCFormGroup.controls['ContractReference'].enable();
            this.maintenanceCFormGroup.controls['InterCompanyPortfolio'].enable();
            this.maintenanceCFormGroup.controls['AgreementNumber'].enable();
            this.maintenanceCFormGroup.controls['RenewalAgreementNumber'].enable();
            this.maintenanceCFormGroup.controls['GroupAccountPriceGroupID'].enable();

            this.maintenanceCFormGroup.controls['SalesEmployee'].setValue('');
            this.maintenanceCFormGroup.controls['SalesEmployeeSurname'].setValue('');
            this.maintenanceCFormGroup.controls['ContractOwner'].setValue('');
            this.maintenanceCFormGroup.controls['CompanyVatNumber'].setValue('');
            this.maintenanceCFormGroup.controls['CompanyVatNumber2'].setValue('');
            this.maintenanceCFormGroup.controls['LimitedCompany'].setValue(false);
            this.maintenanceCFormGroup.controls['CompanyRegistrationNumber'].setValue('');
            this.maintenanceCFormGroup.controls['NoticePeriod'].setValue('');
            this.maintenanceCFormGroup.controls['ContractReference'].setValue('');
            this.maintenanceCFormGroup.controls['ExternalReference'].setValue('');
            this.maintenanceCFormGroup.controls['InterCompanyPortfolio'].setValue('');
            this.maintenanceCFormGroup.controls['AgreementNumber'].setValue('');
            this.maintenanceCFormGroup.controls['RenewalAgreementNumber'].setValue('');
            this.maintenanceCFormGroup.controls['GroupAccountPriceGroupID'].setValue('');
            this.maintenanceCFormGroup.controls['Telesales'].setValue(false);

            this.dateObjectsEnabled['contractResignDate'] = true;
            this.isEmployeeSearchEllipsisDisabled = false;
            this.isCompanyDropdownDisabled = false;
            if (this.sysCharParams['vSCEnableMonthsNotice'] && this.storeData['params']['currentContractType'] === 'C') {
                this.fieldVisibility.noticePeriod = true;
                this.fieldRequired.noticePeriod = true;
                this.maintenanceCFormGroup.controls['NoticePeriod'].setValidators(Validators.required);
                this.maintenanceCFormGroup.controls['NoticePeriod'].setValue(this.sysCharParams['vSCMonthsNotice']);
            } else {
                this.maintenanceCFormGroup.controls['NoticePeriod'].clearValidators();
                this.maintenanceCFormGroup.controls['NoticePeriod'].setValue('');
                this.fieldVisibility.noticePeriod = false;
                this.fieldRequired.noticePeriod = false;
            }

            this.contractResignDate = null;
            this.contractResignDateDisplay = '';
            this.maintenanceCFormGroup.controls['ContractResignDate'].setValue(this.contractResignDateDisplay);
            this.store.dispatch({
                type: ContractActionTypes.FORM_GROUP, payload: {
                    typeC: this.maintenanceCFormGroup
                }
            });

        }
        this.maintenanceCFormGroup.updateValueAndValidity();
        if (this.mode['addMode'] || this.mode['updateMode']) {
            this.inputParams = Object.assign({}, this.inputParams, {
                'countryCode': this.storeData['code'].country,
                'businessCode': this.storeData['code'].business
            });
            this.inputParamsEmployeeSearch = Object.assign({}, this.inputParamsEmployeeSearch, {
                'countryCode': this.storeData['code'].country,
                'businessCode': this.storeData['code'].business,
                'negativeBranchNumber': this.storeData['formGroup'].main.controls['NegBranchNumber'].value
            });
            this.inputParamsContractOwner = Object.assign({}, this.inputParamsContractOwner, {
                'countryCode': this.storeData['code'].country,
                'businessCode': this.storeData['code'].business
            });
            if (this.sysCharParams['vSCDisplayContractOwner'] === true) {
                this.isContractOwnerEllipsisDisabled = false;
            } else {
                this.isContractOwnerEllipsisDisabled = true;
            }
        }
    }

    public setEmployeeOnBranchChange(event: any): void {
        this.inputParamsEmployeeSearch = Object.assign({}, this.inputParamsEmployeeSearch, {
            'countryCode': this.storeData['code'].country,
            'businessCode': this.storeData['code'].business,
            'negativeBranchNumber': this.storeData['formGroup'].main.controls['NegBranchNumber'].value
        });
    }

    public onLimitedIndClick(event: any): void {
        if (this.maintenanceCFormGroup.controls['LimitedCompany'] && this.maintenanceCFormGroup.controls['LimitedCompany'].value) {
            this.fieldRequired.companyRegistrationNumber = true;
            this.maintenanceCFormGroup.controls['CompanyRegistrationNumber'].setValidators(Validators.required);
        } else {
            this.fieldRequired.companyRegistrationNumber = false;
            this.maintenanceCFormGroup.controls['CompanyRegistrationNumber'].clearValidators();
        }
        this.maintenanceCFormGroup.controls['CompanyRegistrationNumber'].updateValueAndValidity();
        this.maintenanceCFormGroup.updateValueAndValidity();
    }

    public onNoticePeriodChange(event: any): void {
        if (this.maintenanceCFormGroup.controls['NoticePeriod'] && this.maintenanceCFormGroup.controls['NoticePeriod'].value !== '') {
            if (/^\d+$/.test(this.maintenanceCFormGroup.controls['NoticePeriod'].value)) {
                this.maintenanceCFormGroup.controls['NoticePeriod'].clearValidators();
                this.maintenanceCFormGroup.controls['NoticePeriod'].setValidators(Validators.required);
            } else {
                this.maintenanceCFormGroup.controls['NoticePeriod'].setValue('');
            }
            this.maintenanceCFormGroup.controls['NoticePeriod'].updateValueAndValidity();
            this.maintenanceCFormGroup.updateValueAndValidity();
        }
    }

    public contractResignDateSelectedValue(value: any): void {
        if (value && value.value) {
            if (value.value !== this.contractResignDateDisplay) {
                this.contractResignDateDisplay = value.value;
                this.maintenanceCFormGroup.controls['ContractResignDate'].setValue(this.contractResignDateDisplay);
                this.maintenanceCFormGroup.controls['ContractResignDate'].markAsDirty();
            }
        } else {
            this.contractResignDateDisplay = '';
            this.maintenanceCFormGroup.controls['ContractResignDate'].setValue('');
        }
    }

    public fetchContractData(functionName: string, params: Object): any {
        let queryContract = new URLSearchParams();
        queryContract.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        queryContract.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        queryContract.set(this.serviceConstants.Action, this.queryParamsContract.action);
        if (functionName !== '') {
          queryContract.set(this.serviceConstants.Action, '6');
          queryContract.set('Function', functionName);
        }
        for (let key in params) {
          if (key) {
            queryContract.set(key, params[key]);
          }
        }
        return this.httpService.makeGetRequest(this.queryParamsContract.method, this.queryParamsContract.module, this.queryParamsContract.operation, queryContract);
    }

    public onCapitalize(control: any): void {
        if (!this.sysCharParams['vSCCapitalFirstLtr']) {
          this.maintenanceCFormGroup.controls[control].setValue(this.maintenanceCFormGroup.controls[control].value.toString().capitalizeFirstLetter());
        }
    }
}
