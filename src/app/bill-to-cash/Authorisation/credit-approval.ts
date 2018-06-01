import { InternalGridSearchApplicationModuleRoutes } from './../../base/PageRoutes';
import { SetupComponent } from './../../setup/setup';
import { BusinessOriginDetailLanguageSearchComponent } from './../../internal/search/iCABSBBusinessOriginDetailLanguageSearch';
import { CampaignSearchComponent } from './../../internal/search/iCABSBCampaignSearch/iCABSBCampaignSearch';
import { URLSearchParams } from '@angular/http';
import { AUPostcodeSearchComponent } from './../../internal/grid-search/iCABSAAUPostcodeSearch';
import { EmployeeSearchComponent } from './../../internal/search/iCABSBEmployeeSearch';
import { HttpService } from '../../../shared/services/http-service';
import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ComponentInteractionService } from '../../../shared/services/component-interaction.service';
import { EllipsisComponent } from '../../../shared/components/ellipsis/ellipsis';
import { PaymentSearchComponent } from '../../internal/search/iCABSBPaymentTypeSearch';
import { InvoiceFrequencySearchComponent } from '../../internal/search/iCABSBBusinessInvoiceFrequencySearch';
import { AccountSearchComponent } from '../../internal/search/iCABSASAccountSearch';
import { AccountGroupSearchComponent } from '../../internal/search/iCABSAAccountGroupSearch';
import { GroupAccountNumberComponent } from '../../internal/search/iCABSSGroupAccountNumberSearch';
import { InvoiceFeeSearchComponent } from '../../internal/search/iCABSBInvoiceFeeSearch';
import { BranchServiceAreaSearchComponent } from './../../internal/search/iCABSBBranchServiceAreaSearch';
import { AccountHistoryDetailComponent } from '../../internal/search/iCABSAAccountHistoryDetail';
import { ApplyApiGridComponent } from '../../bill-to-cash/InvoiceProductionAndAPI/iCABSAApplyApiGrid';
import { ContractSearchComponent } from '../../internal/search/iCABSAContractSearch';
import { AccountPremiseSearchComponent } from '../../internal/grid-search/iCABSAAccountPremiseSearchGrid';
import { AccountHistoryGridComponent } from '../../internal/grid-search/iCABSAAccountHistoryGrid';
import { InvoiceChargeSearchComponent } from '../../internal/search/iCABSAInvoiceChargeSearch.component';
import { SalesAreaSearchComponent } from '../../internal/search/iCABSBSalesAreaSearch.component';
import { OccupationSearchComponent } from '../../internal/search/iCABSSOccupationSearch.component';
import { CustomerTypeSearchComponent } from '../../internal/search/iCABSSCustomerTypeSearch';
import { BatchProgramSearchComponent } from '../../internal/search/iCABSMGBatchProgramSearch';
import { BusinessTierSearchComponent } from '../../internal/search/iCABSBTierSearchComponent';
import { BCompanySearchComponent } from '../../internal/search/iCABSBCompanySearch';
import { BusinessSearchComponent } from './../../internal/search/iCABSSBusinessSearch.component';
import { InvoiceHeaderAddressComponent } from './../../internal/search/iCABSAInvoiceHeaderAddressDetails.component';
import { DeportSearchComponent } from './../../internal/search/iCABSBDepotSearch.component';
import { Utils } from '../../../shared/services/utility';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { RiExchange } from './../../../shared/services/riExchange';
import { Logger } from '@nsalaun/ng2-logger';
import { TranslateService } from 'ng2-translate/ng2-translate';
import { ProductExpenseSearchComponent } from './../../internal/search/iCABSBProductExpenseSearch';
import { BatchProgramScheduleSearchComponent } from './../../internal/search/riMBatchProgramScheduleSearch';
import { InvoiceSearchComponent } from './../../internal/search/iCABSInvoiceSearch.component';
import { DlRejectionSearchComponent } from './../../internal/search/iCABSBdlRejectionSearch';
import { MaritalStatusSearchComponent } from './../../internal/search/iCABSSMaritalStatusSearch.component';
import { ServiceCoverSearchComponent } from './../../internal/search/iCABSAServiceCoverSearch';
import { LocaleTranslationService } from '../../../shared/services/translation.service';
import { ContractManagementModuleRoutes } from '../../base/PageRoutes';

@Component({
    selector: 'icabs-creditapproval',
    templateUrl: 'credit-approval.html'
})

export class CreditApprovalComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('productExpenseEllipsis') productExpenseEllipsis: EllipsisComponent;
    @ViewChild('InvoiceSearchEllipsis') InvoiceSearchEllipsis: EllipsisComponent;
    @ViewChild('childModal') public childModal;
    public accountFormGroup: FormGroup;
    public invoiceFreqComponent = InvoiceFrequencySearchComponent;
    public dynamicComponent = PaymentSearchComponent;
    public ReadOnlyComponent = AccountHistoryDetailComponent;
    public DeportSearchComponent = DeportSearchComponent;
    public InvChargeSearchComponent = InvoiceChargeSearchComponent;
    public SalesAreaSearchComponent = SalesAreaSearchComponent;
    public OccupationSearchComponent = OccupationSearchComponent;
    public CustomerTypeSearchComponent = CustomerTypeSearchComponent;
    public BatchProgramSearchComponent = BatchProgramSearchComponent;
    public BranchServiceAreaSearchComponent = BranchServiceAreaSearchComponent;
    public BusinessTierSearchComponent = BusinessTierSearchComponent;
    public empSearchComponent = EmployeeSearchComponent;
    public auPostCodeSearch = AUPostcodeSearchComponent;
    public dynamicInvoiceHeaderAddressComponent = InvoiceHeaderAddressComponent;
    public campaignSearchComponent = CampaignSearchComponent;
    public dynamicBusinessOriginDetailLanguageSearchComponent = BusinessOriginDetailLanguageSearchComponent;
    public InvoiceSearchComponent = InvoiceSearchComponent;
    public DlRejectionSearchComponent = DlRejectionSearchComponent;
    public dynamicServiceCoverSearchComponent = ServiceCoverSearchComponent;

    //Marital Status Search
    public maritalCode: string;
    public maritalDesc: string;
    public maritalResp: string;

    //Invoice Frequency Search
    public inputParamsfreqSearch: any = { 'parentMode': 'LookUp', action: 0 };
    public frequencyType: string;
    public ServiceCoverType: string;
    // Employee URLSearchParams
    public employeeData: string;
    //Employee Surname Search
    public inputParamsEmployeeSearch: any = {
        'parentMode': 'LookUp-ProspectAssignTo',
        'ContractTypeCode': 'J',
        'negBranchNumber': '',
        'serviceBranchNumber': '93',
        'branchNumber': '93',
        'salesBranchNumber': '1222',
        'OccupationCode': '',
        'NewServiceBranchNumber': '',
        'NewNegBranchNumber': '',
        action: 0
    };

    // Service Cover Search
    public inputParamsServiceCover: any = {
        'parentMode': 'CallCentreSearch',
        'ContractTypeCode': 'J',
        'negBranchNumber': '',
        'serviceBranchNumber': '',
        'branchNumber': '',
        'salesBranchNumber': '1222',
        'OccupationCode': '',
        'NewServiceBranchNumber': '',
        'NewNegBranchNumber': '',
        action: 0,
        'ContractNumber': '00168576',
        'ContractName': '',
        'PremiseNumber': '1',
        'PremiseName': '',
        'ProductCode': '',
        'SCProductCode': ''
    };
    public InvoiceSearchData: string;

    public inputParamsInvoiceSearch: any = {
        'parentMode': 'CreditReInvoice',
        'companyCode': '01'
    };

    //Contract Search
    public inputParamsContractSearch: any = {
        'parentMode': 'Contract-Search',
        'currentContractType': 'C', 'businessCode': 'D',
        action: 0
    };
    //ProductExpenseSearch
    public contractType: string = '';
    public productCode: string = '';
    public expenseCode: string = '';
    public modalConfig: any = {
        backdrop: 'static',
        keyboard: true
    };
    public autoOpenSearch: boolean = false;
    public currentContractType: string = '';
    public productCodeSearchParams: any = {
        'productCode': ''
    };
    //Waste transfer type code search
    public wasteTransferTypeSearchParams: any = {
        parentMode: 'LookUp'

    };
    public WasteTransferTypeCode: string = '';
    public WasteTransferTypeDesc: string = '';
    public searchModalRoute: string = '';
    public searchPageRoute: string = '';
    public showCloseButton: boolean = true;
    public producSearchComponent = ProductExpenseSearchComponent;
    // Program Schedule search
    public scheduleNumber: string = '';
    public scheduleSearchComponent = BatchProgramScheduleSearchComponent;
    public scheduleSearchParams: any = {

    };

    //AUPostCode Search
    public inputParamsAUPostCode: any = {
        'parentMode': 'Contract',
        'Postcode': '',
        'Town': '',
        'State': '',
        action: 0
    };

    //BranchServiceArea Search
    public inputParamsBranchServiceAreaSearch: any = {
        'parentMode': 'LookUp-All',
        'BranchNumberServiceBranchNumber': 3,
        'BranchName': 'BATSA',
        'ContractNumber': '00105679',
        'PremiseNumber': '1'
    };

    public suburb: string;
    public state: string;
    public postcode: string;
    public invoiceAddress: string;
    public branchServiceData: string;
    public inputParamsRejectionSearch: any = {};
    public inputParamsSalesAreaSearch: any = { 'parentMode': 'Search', 'businessCode': this.utils.getBusinessCode(), 'countryCode': this.utils.getCountryCode(), action: 0 };
    public inputParamsOccupationSearch: any = { 'parentMode': 'LookUp' };
    public inputParamsCustomerTypeSearch: any = { 'parentMode': 'LookUp-PremiseIncSIC', 'CWIExcludeCustomerTypes': '7' };
    public inputParamsDepotSearch: any = { 'parentMode': 'LookUp' };
    public inputParamsBatchProgramSearch: any = { 'parentMode': 'LookUp', 'businessCode': this.utils.getBusinessCode(), 'countryCode': this.utils.getCountryCode(), action: 0 };
    public inputParamsTierSearch: any = { 'parentMode': 'LookUp', 'businessCode': this.utils.getBusinessCode(), 'countryCode': this.utils.getCountryCode(), action: 0 };
    public inputParamsPaymentSearch: any = { 'parentMode': 'LookUp', 'businessCode': 'D', action: 0 };
    public inputParamsContractInvoiceSearch: any = { 'parentMode': 'Contract-Search', 'businessCode': this.utils.getBusinessCode(), 'countryCode': this.utils.getCountryCode(), action: 0 };
    public inputParams: any = { 'parentMode': 'Contract-Search', 'ContractTypeCode': 'J', 'businessCode': 'D', 'countryCode': 'ZA', action: 0 };
    public inputParamsCampaignSearch: any = { 'parentMode': 'LookUp' };
    public inputParamsBusinessOrigin: any = {
        'parentMode': 'Contract-Search',
        'ContractTypeCode': 'J',
        'businessCode': 'D',
        'countryCode': 'ZA',
        action: 0,
        'LanguageCode': '',
        'BusinessOriginCode': ''
    };
    public businessOrigin: string;
    public paymentType: string;
    public DepotType: string;
    public accountSearchField: string;
    public invoiceType: string;
    public salesAreaType: string;
    public OccupationType: string;
    public CustomerType: string;
    public dlRejectionValue: string;
    public batchProgramSearch: string;
    public tierCodeSearch: string;
    //Branch search
    public BranchSearch: string;
    //API Code Search
    public APICodeSearch: string;
    //TIER Code Search
    public TierSearch: string;
    public branch: string;
    public BranchEmail: string;
    public Branch: string;
    public branchTable: string;

    //Contract Duration search
    public duration: string;

    //proRataChargeStatus
    public proRataCode;
    public proRataDesc;

    //Country Code Search
    public countryResp;
    public countryCode;
    public countryDesc;
    public selectedBusiness: string;

    public campaignSearch: string;

    //Business Company Search
    public bcompanyResp;
    public businessCode;
    public companyCode;
    public companyDesc;
    public bcompanyInputParams: any = {
        'parentMode': 'LookUp',
        'countryCode': 'UK',
        'businessCode': 'D',
        action: 0
    };
    //Gender search
    public Gcode;
    public Gdesc;
    public gendersearch;
    public logotypesearch;
    //Group Account Number URLSearchParams
    //Group Account Number URLSearchParams
    public groupAccNum = GroupAccountNumberComponent;
    public GroupAccount: string;
    public GroupAccountNumber: string;
    public inputParamsGrpAccNumber: any = {
        'parentMode': 'LookUp',
        'businessCode': 'D',
        'countryCode': 'UK',
        'Action': '2'
    };

    public autoOpen: boolean = false;
    public showHeader: boolean = true;
    public modalTitle: string = '';

    // Account number search
    public inputParamsAccSearch: any = { 'parentMode': 'LookUp-Search', 'accountName': 'JET', action: 0 };

    //Account History AccountHistoryDetailComponent
    public accountObject: Object = {
        businessCode: 'D',
        countryCode: 'UK',
        AccountNumber: '000246160',
        AccountHistoryNumber: '79',
        InvoiceGroupNumber: '6',
        RowID: '0x0000000000405558',
        action: 0
    };

    //account group search
    public accgrpsearch: string;
    public DataBlockfromparent: any = {
        'GroupAccountNumber': '2',
        'GroupName': ''
    };
    public AccountGroupComponent = AccountGroupSearchComponent;

    requestdata: Array<any>;
    // private dynamicComponent = PaymentSearchComponent;
    public dynamicComponent1 = AccountSearchComponent;
    public accountGrpSearch = AccountGroupSearchComponent;
    public invoiceFee = InvoiceFeeSearchComponent;
    public applyApiGrid = ApplyApiGridComponent;
    public contrctSearch = ContractSearchComponent;
    public accountPremise = AccountPremiseSearchComponent;
    public accounthistorygrid = AccountHistoryGridComponent;
    public errorMessage;

    //Set URL for service call
    public branchSearchUrl: string = 'http://localhost:3030/api/branchSearch';
    public contractDurationSearchUrl: string = 'http://localhost:3030/api/contractDurationSearch';
    public proRataSearchUrl: string = 'http://localhost:3030/api/proRataChargeStatusLang';

    //Set Dropdown component input param
    public dropDownFields: Array<string> = ['BranchNumber', 'BranchName'];
    public dropDownFieldsForConDur: Array<string> = ['ContractDurationCode', 'ContractDurationDesc'];
    public dropDownFieldsForProRata: Array<string> = ['ProRataChargeStatusCode', 'ProRataChargeStatusDesc'];
    public moveBranchMessage = 'Move Branch By Postcode';
    constructor(private _componentInteractionService: ComponentInteractionService,
        private _router: Router,
        private _httpService: HttpService,
        private utils: Utils,
        private fb: FormBuilder,
        private riExchange: RiExchange,
        private logger: Logger,
        private translate: TranslateService,
        private localeTranslateService: LocaleTranslationService) {

        this._router.events.subscribe(event => {
            if (event.url === '/billtocash/creditapproval/payment/search') {
                this.autoOpen = true;
            }
        });
        this.countryCode = this.utils.getCountryCode();
        this.businessCode = this.utils.getBusinessCode();
        this.inputParamsfreqSearch['countryCode'] = this.countryCode;
        this.inputParamsfreqSearch['businessCode'] = this.businessCode;
        this.inputParamsEmployeeSearch['countryCode'] = this.countryCode;
        this.inputParamsEmployeeSearch['businessCode'] = this.businessCode;
        this.inputParamsContractSearch['countryCode'] = this.countryCode;
        this.inputParamsContractSearch['businessCode'] = this.businessCode;
        this.inputParamsAUPostCode['countryCode'] = this.countryCode;
        this.inputParamsAUPostCode['businessCode'] = this.businessCode;
        this.inputParamsPaymentSearch['countryCode'] = this.countryCode;
        this.inputParamsPaymentSearch['businessCode'] = this.businessCode;
        this.inputParamsContractInvoiceSearch['countryCode'] = this.countryCode;
        this.inputParamsContractInvoiceSearch['businessCode'] = this.businessCode;
        this.inputParams['countryCode'] = this.countryCode;
        this.inputParams['businessCode'] = this.businessCode;
        this.bcompanyInputParams['countryCode'] = this.countryCode;
        this.bcompanyInputParams['businessCode'] = this.businessCode;
        this.inputParamsGrpAccNumber['countryCode'] = this.countryCode;
        this.inputParamsGrpAccNumber['businessCode'] = this.businessCode;
        this.inputParamsAccSearch['countryCode'] = this.countryCode;
        this.inputParamsAccSearch['businessCode'] = this.businessCode;
        this.accountObject['countryCode'] = this.countryCode;
        this.accountObject['businessCode'] = this.businessCode;

        this.inputParamsBusinessOrigin['countryCode'] = this.countryCode;
        this.inputParamsBusinessOrigin['businessCode'] = this.businessCode;
        this.inputParamsBusinessOrigin['LanguageCode'] = this.riExchange.LanguageCode();
        this.inputParamsServiceCover['countryCode'] = this.countryCode;
        this.inputParamsServiceCover['businessCode'] = this.businessCode;
        this.inputParamsServiceCover['serviceBranchNumber'] = this.utils.getBranchCode();
        this.inputParamsServiceCover['branchNumber'] = this.utils.getBranchCode();
    }

    ngOnInit(): void {
        // TODO - do something here or delete this block
        this.accountFormGroup = this.fb.group({
            AccountNumber: [{ value: '', disabled: false }, Validators.required],
            AccountName: [{ value: '', disabled: false }]
        });
        this.localeTranslateService.setUpTranslation();
        this.inputParamsAUPostCode['Town'] = this.suburb;
        this.inputParamsAUPostCode['State'] = this.state;
        this.translate.get('Move Branch by Postcode').subscribe((res: string) => {
            if (res) {
                this.moveBranchMessage = res;
            }
        });;
    }

    ngAfterViewInit(): void {
        //this._componentInteractionService.emitMessage(false);
    }

    ngOnDestroy(): void {
        // prevent memory leak when component is destroyed
        //this.subscription.dispose();
        //this._authService.unsubscribe();
    }

    public onMaritalSearch(obj: any): void {
        this.maritalResp = obj.MaritalStatusCode + ' : ' + (obj.hasOwnProperty('MaritalStatusDesc') ? obj.MaritalStatusDesc : obj.Object.MaritalStatusDesc);
    }

    public onInvoiceFreq(data: any): void {
        this.frequencyType = data.InvoiceFrequencyCode + ' - ' + data.InvoiceFrequencyDesc;
    }

    public onEmployeeDataReturn(data: any): void {
        // In case where parentMode = 'LookUp-ProspectAssignTo'
        if (data.EmployeeSurName) {
            this.employeeData = data.EmployeeCode + ' - ' + data.EmployeeSurName;
        } else {
            this.employeeData = data.EmployeeCode;
        }
    }

    public onInvoiceSearchDataReturn(data: any): void {
        if (data) {
            this.InvoiceSearchData = data;
        }
    }
    public GetDisplayFieldList(data: any): void {
        // console.log((<HTMLInputElement>document.getElementById('InvoiceSearchInput')).value);
        data = document.getElementById('InvoiceSearchInput')['value'];

        this.inputParamsInvoiceSearch['CompanyInvoiceNumber'] = data;
        if (this.inputParamsInvoiceSearch.CompanyInvoiceNumber) {
            this.InvoiceSearchEllipsis.openModal();
        }
    }

    public onPaymentType(data: any): void {
        if (data.PaymentDesc)
            this.paymentType = data.PaymentTypeCode + ' - ' + data.PaymentDesc;
        else
            this.paymentType = data.PaymentTypeCode;
    }

    public onCampaignSearch(data: any): void {
        this.campaignSearch = data.CampaignID + '-' + data.CampaignDesc;
    }

    public setAccountNumber(data: any): void {

        this.accountSearchField = data.AccountNumber;
    }

    public onDepotSearch(data: any): void {
        this.DepotType = data.DepotNumber + '-' + data.Depotname;
    }

    public onInvoiceChargeTypeCode(data: any): void {
        //this.invoiceType = data.CurrentContractTypeURLParameter;
        //this._router.navigate(['Application/iCABSAInvoiceChargeMaintenance'], { queryParams: { CurrentContractTypeURLParameter: this.invoiceType } });
    }

    public onSalesAreaSearch(data: any): void {
        this.salesAreaType = data.SalesAreaCode + ' - ' + data.SalesAreaDesc;
    }
    public onOccupationSearch(data: any): void {
        if (this.inputParamsOccupationSearch.parentMode === 'LookUp')
            this.OccupationType = data.OccupationCode + ' - ' + data.OccupationDesc;
        else
            this.OccupationType = data;
    }
    public onRejectionSearch(data: any): void {
        this.dlRejectionValue = data.dlRejectionCode + ' - ' + data.dlRejectionDesc;
    }
    public onCustomerTypeSearch(data: any): void {
        if (Object.keys(data).length === 1)
            this.CustomerType = data[Object.keys(data)[0]];
        if (Object.keys(data).length === 2)
            this.CustomerType = data[Object.keys(data)[0]] + ' ' + data[Object.keys(data)[1]];
        if (Object.keys(data).length === 3)
            this.CustomerType = data[Object.keys(data)[0]] + ' ' + data[Object.keys(data)[1]] + ' ' + data[Object.keys(data)[2]];
    }
    public onBatchProgramSearch(data: any): void {
        this.batchProgramSearch = data.riBatchProgramName + ' - ' + data.riBatchProgramDescription;
    }
    public onTierCodeSearch(data: any): void {
        if (data.TierSystemDescription)
            this.tierCodeSearch = data.TierCode + ' - ' + data.TierSystemDescription;
        else
            this.tierCodeSearch = data.TierCode;
    }
    public onGroupAccount(data: any): void {
        if (data.GroupName) {
            this.GroupAccount = data.GroupAccountNumber + ' - ' + data.GroupName;
        }
        else {
            this.GroupAccount = data.GroupAccountNumber;
        }
    }

    public onBranchDataReceived(obj: any): void {
        this.BranchSearch = obj.BranchNumber + ' : ' + (obj.hasOwnProperty('BranchName') ? obj.BranchName : obj.Object.BranchName);
    }

    public onAPICodeSearchReceived(obj: any): void {
        this.APICodeSearch = obj.APICode + ' : ' + (obj.hasOwnProperty('APICodeDesc') ? obj.APICodeDesc : obj.Object.APICodeDesc);
    }
    public onTierSearchReceived(obj: any): void {
        this.TierSearch = obj.TierCode + ' : ' + (obj.hasOwnProperty('TierSystemDescription') ? obj.TierSystemDescription : obj.Object.TierSystemDescription);
    }
    public onDurationReceived(obj: any): void {

        this.duration = obj.ContractDurationCode + ' : ' + (obj.hasOwnProperty('ContractDurationDesc') ? obj.ContractDurationDesc : obj.Object.ContractDurationDesc);
    }

    public onProRataReceived(obj: any): void {
        this.proRataCode = obj.value.ProRataChargeStatusCode;
        this.proRataDesc = obj.value.ProRataChargeStatusDesc;
    }
    public onCountryCodeReceived(obj: any): void {
        this.countryResp = obj.riCountryCode + ' : ' + (obj.hasOwnProperty('riCountryDescription') ? obj.riCountryDescription : obj.Object.riCountryDescription);
    }
    public onBusinessCodeReceived(obj: any): void {
        this.selectedBusiness = obj.businessCode + ' - ' + obj.businessDesc;
    }
    public onBCompanySearchReceived(obj: any): void {
        this.bcompanyResp = obj.CompanyCode + obj.CompanyDesc;
    }
    public onLogoTypeSearch(obj: any): void {
        console.log(obj);
        this.logotypesearch = obj.GenderCode + ' : ' + (obj.hasOwnProperty('GenderDesc') ? obj.GenderDesc : obj.Object.GenderDesc);
    }
    public onGenderSearch(obj: any): void {
        this.gendersearch = obj.GenderCode + ' : ' + (obj.hasOwnProperty('GenderDesc') ? obj.GenderDesc : obj.Object.GenderDesc);
    }

    public onServiceCoverSearch(obj: any): void {
        this.ServiceCoverType = obj.row.ProductCode + '-' + obj.row.ProductDesc + '-' + obj.row.ttServiceCover;
    }
    public onAUPostCode(obj: any): void {
        this.suburb = obj[0].text;
        this.postcode = obj[1].text;
        this.state = obj[2].text;
    }

    public onInvoiceHeaderAddress(obj: any): void {
        this.invoiceAddress = obj;
    }

    public onBranchServiceArea(obj: any): void {
        this.branchServiceData = obj.BranchServiceAreaCode + ' : ' + obj.BranchServiceAreaDesc;
    }

    public onBusinessOriginDetailLanguageSearch(obj: any): void {
        this.businessOrigin = obj.BusinessOriginDetailCode;
    }

    public onExpenseProductDataReceived(event: any): void {
        this.productCode = event.ProductCode;
        this.expenseCode = event.ExpenseCode;
        this.contractType = event.ContractTypeCode;
    }

    public productChange(pcode: any): void {
        this.productCodeSearchParams['productCode'] = this.productCode;
        this.productExpenseEllipsis.childConfigParams = this.productCodeSearchParams;
        this.productExpenseEllipsis.updateComponent();
    }

    public onProgramScheduleDataReceived(obj: any): void {
        this.scheduleNumber = obj.riBPSUniqueNumber;
    }
    public onWasteTypeDataReceived(obj: any): void {
        this.WasteTransferTypeCode = obj.WasteTransferTypeCode;
        this.WasteTransferTypeDesc = obj.WasteTransferTypeDesc;
    }
    public onAccountGrpSearch(data: any): void {
        if (data.CurrentColumnName === 'AccountNumber') {
            this.accgrpsearch = data.AccountNumber;
            this._router.navigate([ContractManagementModuleRoutes.ICABSAACCOUNTMAINTENANCE], { queryParams: { AccountNumber: data.AccountNumber } });
        }
        if (data.CurrentColumnName === 'ContractNumber') {
            if (data.SelectedContractTypeCode === 'C') {
                this.accgrpsearch = data.ContractNumber + data.URLParameterType;
                this._router.navigate([ContractManagementModuleRoutes.ICABSACONTRACTMAINTENANCE], { queryParams: { ContractNumber: data.ContractNumber, URLParameterType: data.URLParameterType } });
            }
            if (data.SelectedContractTypeCode === 'P') {
                this.accgrpsearch = data.ContractNumber + data.URLParameterType;
                this._router.navigate([ContractManagementModuleRoutes.ICABSAPRODUCTSALEMAINTENANCE], { queryParams: { ContractNumber: data.ContractNumber, URLParameterType: data.URLParameterType } });
            }
            if (data.SelectedContractTypeCode === 'J') {
                this.accgrpsearch = data.ContractNumber + data.URLParameterType;
                this._router.navigate([ContractManagementModuleRoutes.ICABSAJOBMAINTENANCE], { queryParams: { ContractNumber: data.ContractNumber, URLParameterType: data.URLParameterType } });
            }
        }
    }

    public onClickPostCode(): void {
        this.childModal.show();
    }
    public postCodeMessageClose(): void {
        this.childModal.hide();
    }
    public onClickServiceCoverCalenderGrid(): void {
        this._router.navigate(['grid/application/ServiceCoverCalendarDate'], { queryParams: { SCRowID: '0x0000000000055ae5', ServiceVisitFrequency: '9' } });
    }
    public onListGroupSearchClick(): void {
        this._router.navigate([InternalGridSearchApplicationModuleRoutes.ICABSBLISTGROUPSEARCH]);
    }
    public onPNOLLevelHistoryClick(): void {
        this._router.navigate([InternalGridSearchApplicationModuleRoutes.ICABSAPNOLLEVELHISTORY], { queryParams: { ContractNumber: '00105679', PremiseNumber: '1' } });
    }
}
