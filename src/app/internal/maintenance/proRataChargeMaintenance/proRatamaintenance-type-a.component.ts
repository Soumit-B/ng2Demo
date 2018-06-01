import * as moment from 'moment';
import { InvoiceGroupSearchComponent } from './../../search/iCABSAInvoiceGroupSearch.component';
import { MessageConstant } from './../../../../shared/constants/message.constant';
import { AjaxObservableConstant } from './../../../../shared/constants/ajax-observable.constant';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { DatepickerComponent } from './../../../../shared/components/datepicker/datepicker';
import { RiExchange } from './../../../../shared/services/riExchange';
import { ProRataChargeStatusLanguageSearchComponent } from './../../search/iCABSSProRataChargeStatusLanguageSearch';
import { EllipsisComponent } from './../../../../shared/components/ellipsis/ellipsis';
import { AuthService } from './../../../../shared/services/auth.service';
import { HttpService } from './../../../../shared/services/http-service';
import { ErrorService } from './../../../../shared/services/error.service';
import { GridComponent } from './../../../../shared/components/grid/grid';
import { PaginationComponent } from './../../../../shared/components/pagination/pagination';
import { ServiceConstants } from './../../../../shared/constants/service.constants';
import { Utils } from './../../../../shared/services/utility';
import { Subscription, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { URLSearchParams } from '@angular/http';
import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ContractActionTypes } from '../../../../app/actions/contract';
import { EmployeeSearchComponent } from '../../../../app/internal/search/iCABSBEmployeeSearch';
import { BCompanySearchComponent } from '../../../../app/internal/search/iCABSBCompanySearch';
import { InvoiceSearchComponent } from './../../../internal/search/iCABSInvoiceSearch.component';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'icabs-proratamaintenance-type-a',
    templateUrl: 'proRatamaintenance-type-a.html'
})

export class ProRataMaintenanceTypeAComponent implements OnInit, OnDestroy {

    @ViewChild('riGridContactRole') riGridContactRole: GridComponent;
    @ViewChild('riGridContactRolePagination') riGridContactRolePagination: PaginationComponent;
    @ViewChild('proRataChargeStatusLanguageSearchEllipsis') public proRataChargeStatusLanguageSearchEllipsis: EllipsisComponent;
    @ViewChild('proRataExtractDatePicker') proRataExtractDatePicker: DatepickerComponent;
    @ViewChild('proRataStartDatePicker') proRataStartDatePicker: DatepickerComponent;
    @ViewChild('messageModal') public messageModal;
    @ViewChild('InvoiceSearchEllipsis') InvoiceSearchEllipsis: EllipsisComponent;

    private routeParams: any;
    public invoiceSearchComponent = InvoiceSearchComponent;
    public ellipseConfig = {
        bCompanySearchComponent: {
            inputParamsCompanySearch: {
                parentMode: 'LookUp',
                businessCode: this.utils.getBusinessCode(),
                countryCode: this.utils.getCountryCode()
            },
            isDisabled: false,
            isRequired: false,
            active: { id: '', text: '' }
        },
        invoiceSearchComponent: {
            inputParams: {
                parentMode: 'CreditReInvoice',
                businessCode: this.utils.getBusinessCode(),
                countryCode: this.utils.getCountryCode(),
                companyCode: '',
                CompanyInvoiceNumber: ''
            },
            showCloseButton: true,
            config: {
                ignoreBackdropClick: true
            },
            showHeader: true,
            disabled: false
        }
    };
    public messageModalConfig = {
        showMessageHeader: true,
        config: {
            ignoreBackdropClick: true
        },
        title: '',
        content: '',
        showCloseButton: true
    };
    public ajaxconstant: AjaxObservableConstant;
    public ajaxSource = new BehaviorSubject<any>(0);
    public ajaxSource$;
    public ajaxSubscription: Subscription;
    public pageVariables = {
        isRequesting: false
    };
    public invoiceGrp = InvoiceGroupSearchComponent;
    public invoiceGroupSearchParams: any;
    public inputParams: any = {};
    public proRataChargeStatusLanguageSearchComponent: any;
    public storeSubscription: Subscription;
    public search: URLSearchParams = new URLSearchParams();
    public isProducedInvoiceNumber: boolean = false;
    public headerParams: any = {
        method: 'ccm/maintenance',
        module: 'customer',
        operation: 'ContactManagement/iCABSCMContactPersonMaintenance'
    };
    public negBranchNumberSelected: Object = {
        id: '',
        text: ''
    };
    public statusSelected: Object = {
        id: '',
        text: ''
    };
    public negCompanyNumberSelected: Object = {
        id: '',
        text: ''
    };
    //public selectedItem: string;
    public childConfigParamsCommissionEmployee: any = {
        'mode': 'LookUp-ServiceCoverCommissionEmployee'
    };
    public childConfigParamsOriginalCompanyCode: any = {
        'mode': 'LookUp-ProRata-Original'
    };
    //to do after implementation of iCABSAInvoiceGroupSearch.htm
    // public childConfigParamsInvoiceGroupNumber: any = {
    //     'mode': 'LookUp'
    // }
    public employeeSearchComponent = EmployeeSearchComponent;
    //Branch search
    public inputParamsBranch: any = { 'parentMode': 'Contract-Search', 'ContractTypeCode': 'J', 'businessCode': this.utils.getBusinessCode(), 'countryCode': this.utils.getCountryCode() };
    public languageSearchInputParams: any = { 'parentMode': 'ProRataChargeMaintenance' };
    public BranchSearch: string;
    public branch: string;
    public BranchEmail: string;
    public Branch: string;
    public branchTable: string;
    public viewLevels: Array<Object> = [];
    //Business company search
    public bcompanyResp: string;
    public businessCode;
    public companyCode: string;
    public companyDesc;
    public bcompanyInputParams: any = {
        'parentMode': 'LookUp-ProRata-Original',
        'countryCode': this.utils.getCountryCode(),
        'businessCode': this.utils.getBusinessCode()
    };
    private addMode: boolean = false;
    public startDate: string = '';
    public endDate: string = '';
    public extractDate: string = '';
    public extractDateDt: Date;
    public taxPointDate: string = '';
    public paidDate: string = '';
    public branchNumber: string = '';
    public originalCompanyCode: string = '';
    public action: any = '2';
    public UserCode: string;
    public pageSizeContact: number;
    public maxColumnsContact: number;
    public currentPageContact: number;
    public storeData: any;
    public parentToChildComponent: any;
    public isCreditMissedServiceInd: boolean = false;
    public isCreditNumberOfVisits: boolean = false;
    public isDisableTaxPointDate: boolean = false;
    public isTaxPointDate: boolean = false;
    public isInvoiceCreditDesc: boolean = true;
    public isDisableProRataChargeStatusCode: boolean = false;
    private proRataChargeStatusCode: string = '';
    public showEndDate: boolean = true;
    public isServiceSalesEmployee: boolean = true;
    public isRequiredOriginalCompanyCode: boolean = false;
    public isDiscountCode: boolean = true;
    public isProducedInvoiveCompany: boolean = false;
    public vSCEnableTaxInvoiceRanges: boolean = false;
    public vSCEnableUseProRataNarrative: boolean = false;
    public vSCEnableCompanyCode: boolean = false;

    public showHeader: boolean = true;
    public showCloseButton: boolean = true;
    public pageSizeContactRole: number;
    public maxColumnsContactRole: number;
    public currentPageContactRole: number;
    public contractGeneralFormGroup: FormGroup;
    public isShownInContractMode: boolean = true;
    public sysCharParams: any = {};
    constructor(
        public store: Store<any>,
        public _formBuilder: FormBuilder,
        public utils: Utils,
        public errorService: ErrorService,
        public httpService: HttpService,
        public authService: AuthService,
        public serviceConstants: ServiceConstants,
        public riExchange: RiExchange,
        private activatedRoute: ActivatedRoute
    ) {
        this.storeSubscription = store.select('contract').subscribe((data) => {
            switch (data['action']) {
                case ContractActionTypes.PARENT_TO_CHILD_COMPONENT:
                    this.parentToChildComponent = data['parentToChildComponent'];
                    this.setValuesToFormGroup();
                    if (this.parentToChildComponent['ProRataChargeStatusCode'] && this.parentToChildComponent['ProRataChargeStatusCode'] !== '') {
                        this.proRataChargeStatusCode = this.parentToChildComponent['ProRataChargeStatusCode'];
                        this.fetchStatusData(this.proRataChargeStatusCode);
                    }
                    if (this.parentToChildComponent['Mode'] && this.parentToChildComponent['Mode'] === 'AdditionalCredit')
                        this.setDefaultExtractDate();
                    break;
                case ContractActionTypes.SAVE_SYSCHAR:
                    if (data['syschars']) {
                        this.sysCharParams = data['syschars'];
                        this.isDiscountCode = this.sysCharParams['vEnableDiscountCode'];
                        this.isProducedInvoiveCompany = this.sysCharParams['vSCEnableCompanyCode'];
                        this.vSCEnableTaxInvoiceRanges = this.sysCharParams['vSCEnableTaxInvoiceRanges'];
                        this.vSCEnableUseProRataNarrative = this.sysCharParams['vSCEnableUseProRataNarrative'];
                        this.vSCEnableCompanyCode = this.sysCharParams['vSCEnableCompanyCode'];
                    }
                    break;
                case ContractActionTypes.FORM_GROUP_PRORATA:
                    let formGroup = data['formGroup'];
                    this.isCreditNumberOfVisits = formGroup['isCreditNumberOfVisits'] ? formGroup['isCreditNumberOfVisits'] : false;
                    this.isCreditMissedServiceInd = formGroup['isCreditMissedServiceInd'] ? formGroup['isCreditMissedServiceInd'] : false;
                    this.isDisableTaxPointDate = formGroup['isDisableTaxPointDate'] ? formGroup['isDisableTaxPointDate'] : false;
                    this.isTaxPointDate = formGroup['isTaxPointDate'] ? formGroup['isTaxPointDate'] : false;
                    this.showEndDate = formGroup['showEndDate'] ? formGroup['showEndDate'] : true;
                    this.isServiceSalesEmployee = formGroup['isServiceSalesEmployee'] !== null && formGroup['isServiceSalesEmployee'] !== undefined ? formGroup['isServiceSalesEmployee'] : true;// to do syschar
                    this.branchNumber = formGroup['branchNumber'] ? formGroup['branchNumber'] : this.branchNumber;
                    this.companyCode = formGroup['companyCode'] ? formGroup['companyCode'] : this.companyCode;
                    this.originalCompanyCode = formGroup['originalCompanyCode'] ? formGroup['originalCompanyCode'] : this.originalCompanyCode;
                    this.addMode = formGroup['addMode'];
                    if (this.branchNumber && this.branchNumber !== '')
                        this.fetchBranchData(this.branchNumber);
                    else if (this.addMode)
                        this.fetchBranchData(this.utils.getBranchCode());
                    if (this.companyCode && this.companyCode !== '')
                        this.fetchCompanyData(this.companyCode);
                    if (formGroup['proRataChargeStatusCode'] && formGroup['proRataChargeStatusCode'] !== '') {
                        this.proRataChargeStatusCode = formGroup['proRataChargeStatusCode'];
                        this.fetchStatusData(this.proRataChargeStatusCode);
                    }
                    break;
                default:
                    this.storeData = data;

            }
        });
        this.proRataChargeStatusLanguageSearchComponent = ProRataChargeStatusLanguageSearchComponent;
        this.storeSubscription = activatedRoute.queryParams.subscribe(
            (param: any) => {
                this.routeParams = param;
            });
    }

    ngOnInit(): void {
        this.contractGeneralFormGroup = this._formBuilder.group({
            InvoiceGroupNumber: [{ value: '', disabled: false }],
            InvoiceGroupDesc: [{ value: '', disabled: true }],
            InvoiceCreditCode: [{ value: '', disabled: true }],
            InvoiceCreditDesc: [{ value: '', disabled: true }],
            ProRataChargeStatusCode: [{ value: '', disabled: this.isDisableProRataChargeStatusCode }],
            ProRataChargeStatusDesc: [{ value: '', disabled: false }],
            ServiceQuantity: [{ value: '', disabled: false }],
            ProRataChargeValue: [{ value: '', disabled: false }],
            ProducedCompanyCode: [{ value: '', disabled: true }],
            ProducedCompanyDesc: [{ value: '', disabled: true }],
            CostValue: [{ value: '', disabled: false }],
            ProducedCompanyInvoiceNumber: [{ value: '', disabled: true }],
            ProducedInvoiceNumber: [{ value: '', disabled: true }],/*to do-- added disabled:true as ProRataChargeStatus page is not available*/
            ServiceSalesEmployee: [{ value: '', disabled: true }],
            EmployeeSurname: [{ value: '', disabled: true }],
            ProducedInvoiceRun: [{ value: '', disabled: true }],
            OriginalInvoiceNumber: [{ value: '', disabled: false }],
            TaxCode: [{ value: '', disabled: false }],
            TaxCodeDesc: [{ value: '', disabled: true }],
            OriginalInvoiceItemNumber: [{ value: '', disabled: false }],
            InvoiceCreditReasonCode: [{ value: '', disabled: false }],
            InvoiceCreditReasonDesc: [{ value: '', disabled: true }],
            PurchaseOrderNo: [{ value: '', disabled: false }],
            TaxInvoiceNumber: [{ value: '', disabled: false }],
            DiscountCode: [{ value: '', disabled: false }],
            DiscountDesc: [{ value: '', disabled: true }],
            CreditMissedServiceInd: [{ value: '', disabled: false }],
            OutsortInvoice: [{ value: '', disabled: false }],
            CreditNumberOfVisits: [{ value: '', disabled: false }]
        });
        this.invoiceGroupSearchParams = { parentMode: this.ellipseConfig.invoiceSearchComponent.inputParams.parentMode, AccountNumber: this.routeParams.AccountNumber, isEllipsis: true };
        this.proRataExtractDatePicker.isRequired = true;
        this.proRataStartDatePicker.isRequired = true;
        this.setValuesToFormGroup();
        this.setupGridContactRole();
        if (this.inputParamsBranch.parentMode === 'Contract-Search') {
            this.isShownInContractMode = false;
        }
        this.setFormGroupToStore();
    }
    private setDefaultExtractDate(): void {
        if ((!this.extractDate || this.extractDate === '') && this.parentToChildComponent.AddMode) {
            this.extractDateDt = new Date();
            this.extractDate = this.extractDateDt.toString();
        }
    }
    //set foem group values
    public setValuesToFormGroup(): void {
        if (this.parentToChildComponent) {
            if (this.parentToChildComponent['StartDate'] !== null) {
                if (moment(this.storeData.sentFromParent['Start Date'], 'DD/MM/YYYY', true).isValid()) {
                    this.startDate = this.parentToChildComponent['StartDate'];//this.utils.convertDate(this.parentToChildComponent['StartDate']);
                } else {
                    this.startDate = this.parentToChildComponent['StartDate'];
                }
            }
            if (this.parentToChildComponent['EndDate'] !== null) {
                if (moment(this.storeData.sentFromParent['End Date'], 'DD/MM/YYYY', true).isValid()) {
                    this.endDate = this.parentToChildComponent['EndDate'];// this.utils.convertDate(this.parentToChildComponent['EndDate']);
                } else {
                    this.endDate = this.parentToChildComponent['EndDate'];
                }
            }
            if (this.parentToChildComponent['ExtractDate'] !== null) {
                if (moment(this.storeData.sentFromParent['Extract Date'], 'DD/MM/YYYY', true).isValid()) {
                    this.extractDate = this.parentToChildComponent['ExtractDate'];// this.utils.convertDate(this.parentToChildComponent['ExtractDate']);
                } else {
                    this.extractDate = this.parentToChildComponent['ExtractDate'];
                }
            }
            if (this.parentToChildComponent['PaidDate'] !== null) {
                if (moment(this.storeData.sentFromParent['Paid Date'], 'DD/MM/YYYY', true).isValid()) {
                    this.paidDate = this.parentToChildComponent['PaidDate'];//this.utils.convertDate(this.parentToChildComponent['PaidDate']);
                } else {
                    this.paidDate = this.parentToChildComponent['PaidDate'];
                }
            }
            if (this.parentToChildComponent['TaxPointDate'] !== null) {
                if (moment(this.storeData.sentFromParent['Tax Point Date'], 'DD/MM/YYYY', true).isValid()) {
                    this.taxPointDate = this.parentToChildComponent['TaxPointDate'];//this.utils.convertDate(this.parentToChildComponent['TaxPointDate']);
                } else {
                    this.taxPointDate = this.parentToChildComponent['TaxPointDate'];
                }
            }
            this.contractGeneralFormGroup.controls['InvoiceGroupNumber'].setValidators(Validators.required);
            this.contractGeneralFormGroup.controls['TaxCode'].setValidators(Validators.required);
            this.contractGeneralFormGroup.controls['InvoiceCreditReasonCode'].setValidators(Validators.required);
        }
        this.setFormGroupToStore();

    }
    //set from group to store
    public setFormGroupToStore(): void {
        this.store.dispatch({
            type: ContractActionTypes.FORM_GROUP_PRORATA,
            payload: {
                typeA: this.contractGeneralFormGroup,
                isCreditNumberOfVisits: this.isCreditNumberOfVisits,
                isCreditMissedServiceInd: this.isCreditMissedServiceInd,
                isDisableTaxPointDate: this.isDisableTaxPointDate,
                isTaxPointDate: this.isTaxPointDate,
                isInvoiceCreditDesc: this.isInvoiceCreditDesc,
                isDisableProRataChargeStatusCode: this.isDisableProRataChargeStatusCode,
                showEndDate: this.showEndDate,
                isServiceSalesEmployee: this.isServiceSalesEmployee,
                isRequiredOriginalCompanyCode: this.isRequiredOriginalCompanyCode,
                isDiscountCode: this.isDiscountCode,
                branchNumber: this.branchNumber,
                originalCompanyCode: this.originalCompanyCode,
                negBranchNumberSelected: this.negBranchNumberSelected,
                negCompanyNumberSelected: this.negCompanyNumberSelected,
                proRataChargeStatusCode: this.proRataChargeStatusCode,
                addMode: this.addMode,
                proRataStartDatePicker: this.proRataStartDatePicker,
                proRataExtractDatePicker: this.proRataExtractDatePicker,
                allDate: {
                    startDate: this.startDate,
                    endDate: this.endDate,
                    extractDate: this.extractDate,
                    taxPointDate: this.taxPointDate,
                    paidDate: this.paidDate
                }
            }
        });
    }

    public setupGridContactRole(): void {
        this.pageSizeContactRole = 6;
        this.currentPageContactRole = 1;
        this.maxColumnsContactRole = 10;
    }

    public onReceivingEmployeeResult(event: any): void {
        this.contractGeneralFormGroup.controls['ServiceSalesEmployee'].setValue(event['EmployeeCode']);
        this.contractGeneralFormGroup.controls['EmployeeSurname'].setValue(event['EmployeeSurName']);
    }
    public onBCompanySearchReceived(obj: any): void {
        if (obj) {
            this.originalCompanyCode = obj.OriginalCompanyCode;
            this.bcompanyResp = obj.CompanyCode + ' : ' + (obj.hasOwnProperty('CompanyDesc') ? obj.CompanyDesc : obj.CompanyDesc);
            this.ellipseConfig.invoiceSearchComponent.inputParams.companyCode = obj.OriginalCompanyCode;
            this.setFormGroupToStore();
        }
    }
    public onBranchDataReceived(obj: any): void {
        if (obj) {
            this.branchNumber = obj.BranchNumber;
            this.BranchSearch = obj.BranchNumber + ' : ' + (obj.hasOwnProperty('BranchName') ? obj.BranchName : obj.Object.BranchName);
            this.setFormGroupToStore();
        }
    }

    public startDateSelectedValue(value: Object): void {
        if (this.parentToChildComponent && this.parentToChildComponent.UpdateMode) {
            if (moment(value['value'], 'DD/MM/YYYY', true).isValid()) {
                this.startDate = this.utils.convertDate(value['value']);
                if (this.extractDate === '')
                    this.extractDate = this.utils.convertDate(value['value']);
            } else {
                this.startDate = value['value'];
                if (this.extractDate === '')
                    this.extractDate = value['value'];
            }
        }
        else {
            if (moment(value['value'], 'DD/MM/YYYY', true).isValid()) {
                this.startDate = this.utils.convertDate(value['value']);
            } else {
                this.startDate = value['value'];
            }
        }
        this.setFormGroupToStore();
    }
    public endDateSelectedValue(value: Object): void {
        if (moment(value['value'], 'DD/MM/YYYY', true).isValid()) {
            this.endDate = this.utils.convertDate(value['value']);
        } else {
            this.endDate = value['value'];
        }
        this.setFormGroupToStore();
    }
    public extractDateSelectedValue(value: Object): void {
        if (moment(value['value'], 'DD/MM/YYYY', true).isValid()) {
            this.extractDate = this.utils.convertDate(value['value']);
        } else {
            this.extractDate = value['value'];
        }
        this.setFormGroupToStore();
    }
    public taxPointDateSelectedValue(value: Object): void {
        if (moment(value['value'], 'DD/MM/YYYY', true).isValid()) {
            this.taxPointDate = this.utils.convertDate(value['value']);
        } else {
            this.taxPointDate = value['value'];
        }
        this.setFormGroupToStore();
    }
    public paidDateSelectedValue(value: Object): void {
        if (moment(value['value'], 'DD/MM/YYYY', true).isValid()) {
            this.paidDate = this.utils.convertDate(value['value']);
        } else {
            this.paidDate = value['value'];
        }
        this.setFormGroupToStore();
    }

    // tslint:disable-next-line:eofline
    //Fetching Current Branch Name
    public fetchBranchData(branchCode: any): any {
        let data = [{
            'table': 'Branch',
            'query': { 'BusinessCode': this.businessCode, 'BranchNumber': branchCode },
            'fields': ['BranchNumber', 'BranchName']
        }];
        this.lookUpRecord(data, 5).subscribe(
            (e) => {
                if (e['results'] && e['results'].length > 0) {
                    if (e['results'][0].length > 0) {
                        this.negBranchNumberSelected = {
                            id: e['results'][0][0].BranchNumber,
                            text: e['results'][0][0].BranchNumber + ' - ' + e['results'][0][0].BranchName
                        };
                    }
                }
            },
            (error) => {
                this.errorService.emitError(error);
            }
        );
    }
    //Fetching Current Company details
    public fetchCompanyData(companyCode: any): any {
        let data = [
            {
                'table': 'Company',
                'query': { 'BusinessCode': this.storeData['code'].business, 'CompanyCode': companyCode },
                'fields': ['CompanyCode', 'CompanyDesc']
            }];
        this.lookUpRecord(data, 5).subscribe(
            (e) => {
                if (e['results'] && e['results'].length > 0) {
                    if (e['results'][0].length > 0) {
                        this.negCompanyNumberSelected = {
                            id: e['results'][0][0].CompanyCode,
                            text: e['results'][0][0].CompanyCode + ' - ' + e['results'][0][0].CompanyDesc
                        };
                    }
                }
            },
            (error) => {
                this.errorService.emitError(error);
            }
        );
    }
    //Fetching Discount details
    public fetchDiscountData(): any {
        let data = [
            {
                'table': 'Discount',
                'query': {
                    'BusinessCode': this.utils.getBusinessCode(),
                    'DiscountCode': this.contractGeneralFormGroup.controls['DiscountCode'].value
                },
                'fields': ['DiscountDesc']
            }];
        this.lookUpRecord(data, 5).subscribe(
            (e) => {
                if (e['results'] && e['results'].length > 0) {
                    let resultDiscount = e.results[0] ? e.results[0] : '';
                    if (resultDiscount[0])
                        this.contractGeneralFormGroup.controls['DiscountDesc'].setValue(resultDiscount[0].DiscountDesc);
                    else
                        this.contractGeneralFormGroup.controls['DiscountDesc'].setValue('');
                }
            },
            (error) => {
                this.errorService.emitError(error);
            }
        );
    }
    //Fetching Vat details
    public fetchVatData(): any {
        let data = [
            {
                'table': 'TaxCode',
                'query': {
                    'TaxCode': this.contractGeneralFormGroup.controls['TaxCode'].value
                },
                'fields': ['TaxCodeDesc']
            }];
        this.lookUpRecord(data, 5).subscribe(
            (e) => {
                if (e['results'] && e['results'].length > 0) {
                    let result = e.results[0] ? e.results[0] : '';
                    if (result.length === 0) {
                        this.contractGeneralFormGroup.controls['TaxCode'].setErrors({ 'incorrect': true });
                    }
                    if (result[0]) {
                        this.riExchange.riInputElement.isCorrect(this.contractGeneralFormGroup, 'TaxCode');
                        this.contractGeneralFormGroup.controls['TaxCodeDesc'].setValue(result[0].TaxCodeDesc);
                    }
                    else {
                        this.contractGeneralFormGroup.controls['TaxCode'].setErrors({ 'incorrect': true });
                        this.contractGeneralFormGroup.controls['TaxCodeDesc'].setValue('');
                    }
                }
            },
            (error) => {
                this.errorService.emitError(error);
            }
        );
    }

    //Fetching Invoice group details
    public fetchInvoiceGroupData(): any {
        let data = [
            {
                'table': 'InvoiceGroup',
                'query': {
                    'BusinessCode': this.utils.getBusinessCode(),
                    'AccountNumber': this.parentToChildComponent.AccountNumber,
                    'InvoiceGroupNumber': this.contractGeneralFormGroup.controls['InvoiceGroupNumber'].value
                },
                'fields': ['InvoiceGroupDesc']
            }];
        this.lookUpRecord(data, 5).subscribe(
            (e) => {
                if (e['results'] && e['results'].length > 0) {
                    let result = e.results[0] ? e.results[0] : '';
                    if (result.length === 0) {
                        this.contractGeneralFormGroup.controls['InvoiceGroupNumber'].setErrors({ 'incorrect': true });
                    }
                    if (result[0]) {
                        this.riExchange.riInputElement.isCorrect(this.contractGeneralFormGroup, 'InvoiceGroupNumber');
                        this.contractGeneralFormGroup.controls['InvoiceGroupDesc'].setValue(result[0].InvoiceGroupDesc);
                    }

                    else {
                        this.contractGeneralFormGroup.controls['InvoiceGroupNumber'].setErrors({ 'incorrect': true });
                        this.contractGeneralFormGroup.controls['InvoiceGroupDesc'].setValue('');
                    }

                }
            },
            (error) => {
                this.errorService.emitError(error);
            }
        );
    }
    //Fetching Reason code details
    public fetchReasonData(): any {
        let data = [
            {
                'table': 'InvoiceCreditReasonLang',
                'query': {
                    'LanguageCode': this.riExchange.LanguageCode(),
                    'InvoiceCreditReasonCode': this.contractGeneralFormGroup.controls['InvoiceCreditReasonCode'].value
                },
                'fields': ['InvoiceCreditReasonDesc']
            }];
        this.lookUpRecord(data, 5).subscribe(
            (e) => {
                if (e['results'] && e['results'].length > 0) {
                    let result = e.results[0] ? e.results[0] : '';
                    if (result.length === 0) {
                        this.contractGeneralFormGroup.controls['InvoiceCreditReasonCode'].setErrors({ 'incorrect': true });
                    }
                    if (result[0]) {
                        this.riExchange.riInputElement.isCorrect(this.contractGeneralFormGroup, 'InvoiceCreditReasonCode');;
                        this.contractGeneralFormGroup.controls['InvoiceCreditReasonDesc'].setValue(result[0].InvoiceCreditReasonDesc);
                    }
                    else {
                        this.contractGeneralFormGroup.controls['InvoiceCreditReasonCode'].setErrors({ 'incorrect': true });
                        this.contractGeneralFormGroup.controls['InvoiceCreditReasonDesc'].setValue('');
                    }
                }
            },
            (error) => {
                this.errorService.emitError(error);
            }
        );
    }


    public lookUpRecord(data: any, maxresults: number): any {
        this.search.set(this.serviceConstants.Action, '0');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        if (maxresults) {
            this.search.set(this.serviceConstants.MaxResults, maxresults.toString());
        }
        return this.httpService.lookUpRequest(this.search, data);
    }


    public lookupSearch(key: string): void {
        switch (key) {
            case 'CompanyInvoiceNumber':
                let queryParams = new URLSearchParams();
                queryParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
                queryParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
                queryParams.set(this.serviceConstants.MethodType, 'maintenance');
                let lookupQuery: any;
                queryParams.set(this.serviceConstants.Action, '5');
                lookupQuery = [{
                    'table': 'InvoiceHeader',
                    'query': { 'BusinessCode': this.utils.getBusinessCode(), 'Companycode': this.ellipseConfig.invoiceSearchComponent.inputParams.companyCode, 'CompanyInvoiceNumber': this.riExchange.riInputElement.GetValue(this.contractGeneralFormGroup, 'OriginalInvoiceNumber') },
                    'fields': ['InvoiceNumber']
                }];
                this.pageVariables.isRequesting = true;
                //this.ajaxSource.next(this.ajaxconstant.START);
                this.invokeLookupSearch(queryParams, lookupQuery).subscribe(
                    value => {
                        this.pageVariables.isRequesting = false;
                        let returnDataLength = value.results[0].length;
                        if (returnDataLength === 0) {
                            this.messageModalConfig.content = MessageConstant.Message.RecordNotFound;
                            this.messageModal.show();
                        }
                        else if (returnDataLength > 1) {
                            this.ellipseConfig.invoiceSearchComponent.inputParams.CompanyInvoiceNumber = this.contractGeneralFormGroup.controls['OriginalInvoiceNumber'].value;
                            this.InvoiceSearchEllipsis.openModal();
                        }
                        else {
                            this.pageVariables.isRequesting = false;
                        }
                    },
                    error => {
                        //this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                        this.pageVariables.isRequesting = false;
                    },
                    () => {
                        //this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                        this.pageVariables.isRequesting = false;
                    }
                );

                break;
            default:
                break;
        }
    }

    /**
     * Making the lookup API call
     */
    public invokeLookupSearch(queryParams: any, data: any): Observable<any> {
        //this.ajaxSource.next(this.ajaxconstant.START);
        return this.httpService.lookUpRequest(queryParams, data);
    }
    public invoiceSearchComponentDataReceived(eventObj: any): any {
        //this.riExchange.riInputElement.SetValue(this.contractGeneralFormGroup, 'InvoiceNumber', eventObj);
        this.lookupSearch('InvoiceNumberReceived');
    }

    public fetchStatusData(statusCode: any): any {
        if (statusCode === 'W')
            this.contractGeneralFormGroup.controls['ProRataChargeStatusDesc'].setValue('Waiting');
        else if (statusCode === 'C')
            this.contractGeneralFormGroup.controls['ProRataChargeStatusDesc'].setValue('Cancelled');
        else if (statusCode === 'P')
            this.contractGeneralFormGroup.controls['ProRataChargeStatusDesc'].setValue('Produced');
        else if (statusCode === 'A')
            this.contractGeneralFormGroup.controls['ProRataChargeStatusDesc'].setValue('Awaiting Approval');
        this.statusSelected = {
            id: statusCode,
            text: statusCode + ' - ' + this.contractGeneralFormGroup.controls['ProRataChargeStatusDesc'].value
        };
    }
    public onStatusChange(data: any): any {
        this.contractGeneralFormGroup.controls['ProRataChargeStatusCode'].setValue(data['ProRataChargeStatusLang.ProRataChargeStatusCode']);
        this.contractGeneralFormGroup.controls['ProRataChargeStatusDesc'].setValue(data['ProRataChargeStatusLang.ProRataChargeStatusDesc']);
    }
    public setInvoiceGroupSearch(data: any): void {
        //this.invoiceGroupNumber = data.InvoiceGroupNumber;
        //this.invoiceGroupDesc = data.InvoiceGroupDesc;
        this.contractGeneralFormGroup.controls['InvoiceGroupNumber'].setValue(data.InvoiceGroupNumber);
        this.contractGeneralFormGroup.controls['InvoiceGroupDesc'].setValue(data.InvoiceGroupDesc);
    }
    ngOnDestroy(): void {
        if (this.storeSubscription)
            this.storeSubscription.unsubscribe();
    }
}
