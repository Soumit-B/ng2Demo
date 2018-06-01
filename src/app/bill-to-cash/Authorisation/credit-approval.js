import { BusinessOriginDetailLanguageSearchComponent } from './../../internal/search/iCABSBBusinessOriginDetailLanguageSearch';
import { CampaignSearchComponent } from './../../internal/search/iCABSBCampaignSearch/iCABSBCampaignSearch';
import { AUPostcodeSearchComponent } from './../../internal/grid-search/iCABSAAUPostcodeSearch';
import { EmployeeSearchComponent } from './../../internal/search/iCABSBEmployeeSearch';
import { HttpService } from '../../../shared/services/http-service';
import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ComponentInteractionService } from '../../../shared/services/component-interaction.service';
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
import { InvoiceHeaderAddressComponent } from './../../internal/search/iCABSAInvoiceHeaderAddressDetails.component';
import { DeportSearchComponent } from './../../internal/search/iCABSBDepotSearch.component';
import { Utils } from '../../../shared/services/utility';
import { FormBuilder, Validators } from '@angular/forms';
import { RiExchange } from './../../../shared/services/riExchange';
import { Logger } from '@nsalaun/ng2-logger';
import { TranslateService } from 'ng2-translate/ng2-translate';
import { ProductExpenseSearchComponent } from './../../internal/search/iCABSBProductExpenseSearch';
import { BatchProgramScheduleSearchComponent } from './../../internal/search/riMBatchProgramScheduleSearch';
import { InvoiceSearchComponent } from './../../internal/search/iCABSInvoiceSearch.component';
import { DlRejectionSearchComponent } from './../../internal/search/iCABSBdlRejectionSearch';
import { ServiceCoverSearchComponent } from './../../internal/search/iCABSAServiceCoverSearch';
import { LocaleTranslationService } from '../../../shared/services/translation.service';
import { ContractManagementModuleRoutes } from '../../base/PageRoutes';
export var CreditApprovalComponent = (function () {
    function CreditApprovalComponent(_componentInteractionService, _router, _httpService, utils, fb, riExchange, logger, translate, localeTranslateService) {
        var _this = this;
        this._componentInteractionService = _componentInteractionService;
        this._router = _router;
        this._httpService = _httpService;
        this.utils = utils;
        this.fb = fb;
        this.riExchange = riExchange;
        this.logger = logger;
        this.translate = translate;
        this.localeTranslateService = localeTranslateService;
        this.invoiceFreqComponent = InvoiceFrequencySearchComponent;
        this.dynamicComponent = PaymentSearchComponent;
        this.ReadOnlyComponent = AccountHistoryDetailComponent;
        this.DeportSearchComponent = DeportSearchComponent;
        this.InvChargeSearchComponent = InvoiceChargeSearchComponent;
        this.SalesAreaSearchComponent = SalesAreaSearchComponent;
        this.OccupationSearchComponent = OccupationSearchComponent;
        this.CustomerTypeSearchComponent = CustomerTypeSearchComponent;
        this.BatchProgramSearchComponent = BatchProgramSearchComponent;
        this.BranchServiceAreaSearchComponent = BranchServiceAreaSearchComponent;
        this.BusinessTierSearchComponent = BusinessTierSearchComponent;
        this.empSearchComponent = EmployeeSearchComponent;
        this.auPostCodeSearch = AUPostcodeSearchComponent;
        this.dynamicInvoiceHeaderAddressComponent = InvoiceHeaderAddressComponent;
        this.campaignSearchComponent = CampaignSearchComponent;
        this.dynamicBusinessOriginDetailLanguageSearchComponent = BusinessOriginDetailLanguageSearchComponent;
        this.InvoiceSearchComponent = InvoiceSearchComponent;
        this.DlRejectionSearchComponent = DlRejectionSearchComponent;
        this.dynamicServiceCoverSearchComponent = ServiceCoverSearchComponent;
        this.inputParamsfreqSearch = { 'parentMode': 'LookUp', action: 0 };
        this.inputParamsEmployeeSearch = {
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
        this.inputParamsServiceCover = {
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
        this.inputParamsInvoiceSearch = {
            'parentMode': 'CreditReInvoice',
            'companyCode': '01'
        };
        this.inputParamsContractSearch = {
            'parentMode': 'Contract-Search',
            'currentContractType': 'C', 'businessCode': 'D',
            action: 0
        };
        this.contractType = '';
        this.productCode = '';
        this.expenseCode = '';
        this.modalConfig = {
            backdrop: 'static',
            keyboard: true
        };
        this.autoOpenSearch = false;
        this.currentContractType = '';
        this.productCodeSearchParams = {
            'productCode': ''
        };
        this.searchModalRoute = '';
        this.searchPageRoute = '';
        this.showCloseButton = true;
        this.producSearchComponent = ProductExpenseSearchComponent;
        this.scheduleNumber = '';
        this.scheduleSearchComponent = BatchProgramScheduleSearchComponent;
        this.scheduleSearchParams = {};
        this.inputParamsAUPostCode = {
            'parentMode': 'Contract',
            'Postcode': '',
            'Town': '',
            'State': '',
            action: 0
        };
        this.inputParamsBranchServiceAreaSearch = {
            'parentMode': 'LookUp-All',
            'BranchNumberServiceBranchNumber': 3,
            'BranchName': 'BATSA',
            'ContractNumber': '00105679',
            'PremiseNumber': '1'
        };
        this.inputParamsRejectionSearch = {};
        this.inputParamsSalesAreaSearch = { 'parentMode': 'Search', 'businessCode': this.utils.getBusinessCode(), 'countryCode': this.utils.getCountryCode(), action: 0 };
        this.inputParamsOccupationSearch = { 'parentMode': 'LookUp' };
        this.inputParamsCustomerTypeSearch = { 'parentMode': 'LookUp-PremiseIncSIC', 'CWIExcludeCustomerTypes': '7' };
        this.inputParamsDepotSearch = { 'parentMode': 'LookUp' };
        this.inputParamsBatchProgramSearch = { 'parentMode': 'LookUp', 'businessCode': this.utils.getBusinessCode(), 'countryCode': this.utils.getCountryCode(), action: 0 };
        this.inputParamsTierSearch = { 'parentMode': 'LookUp', 'businessCode': this.utils.getBusinessCode(), 'countryCode': this.utils.getCountryCode(), action: 0 };
        this.inputParamsPaymentSearch = { 'parentMode': 'LookUp', 'businessCode': 'D', action: 0 };
        this.inputParamsContractInvoiceSearch = { 'parentMode': 'Contract-Search', 'businessCode': this.utils.getBusinessCode(), 'countryCode': this.utils.getCountryCode(), action: 0 };
        this.inputParams = { 'parentMode': 'Contract-Search', 'ContractTypeCode': 'J', 'businessCode': 'D', 'countryCode': 'ZA', action: 0 };
        this.inputParamsCampaignSearch = { 'parentMode': 'LookUp' };
        this.inputParamsBusinessOrigin = {
            'parentMode': 'Contract-Search',
            'ContractTypeCode': 'J',
            'businessCode': 'D',
            'countryCode': 'ZA',
            action: 0,
            'LanguageCode': '',
            'BusinessOriginCode': ''
        };
        this.bcompanyInputParams = {
            'parentMode': 'LookUp',
            'countryCode': 'UK',
            'businessCode': 'D',
            action: 0
        };
        this.groupAccNum = GroupAccountNumberComponent;
        this.inputParamsGrpAccNumber = {
            'parentMode': 'LookUp',
            'businessCode': 'D',
            'countryCode': 'UK',
            'Action': '2'
        };
        this.autoOpen = false;
        this.showHeader = true;
        this.modalTitle = '';
        this.inputParamsAccSearch = { 'parentMode': 'LookUp-Search', 'accountName': 'JET', action: 0 };
        this.accountObject = {
            businessCode: 'D',
            countryCode: 'UK',
            AccountNumber: '000246160',
            AccountHistoryNumber: '79',
            InvoiceGroupNumber: '6',
            RowID: '0x0000000000405558',
            action: 0
        };
        this.DataBlockfromparent = {
            'GroupAccountNumber': '2',
            'GroupName': ''
        };
        this.AccountGroupComponent = AccountGroupSearchComponent;
        this.dynamicComponent1 = AccountSearchComponent;
        this.accountGrpSearch = AccountGroupSearchComponent;
        this.invoiceFee = InvoiceFeeSearchComponent;
        this.applyApiGrid = ApplyApiGridComponent;
        this.contrctSearch = ContractSearchComponent;
        this.accountPremise = AccountPremiseSearchComponent;
        this.accounthistorygrid = AccountHistoryGridComponent;
        this.branchSearchUrl = 'http://localhost:3030/api/branchSearch';
        this.contractDurationSearchUrl = 'http://localhost:3030/api/contractDurationSearch';
        this.proRataSearchUrl = 'http://localhost:3030/api/proRataChargeStatusLang';
        this.dropDownFields = ['BranchNumber', 'BranchName'];
        this.dropDownFieldsForConDur = ['ContractDurationCode', 'ContractDurationDesc'];
        this.dropDownFieldsForProRata = ['ProRataChargeStatusCode', 'ProRataChargeStatusDesc'];
        this.moveBranchMessage = 'Move Branch By Postcode';
        this._router.events.subscribe(function (event) {
            if (event.url === '/billtocash/creditapproval/payment/search') {
                _this.autoOpen = true;
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
    CreditApprovalComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.accountFormGroup = this.fb.group({
            AccountNumber: [{ value: '', disabled: false }, Validators.required],
            AccountName: [{ value: '', disabled: false }]
        });
        this.localeTranslateService.setUpTranslation();
        this.inputParamsAUPostCode['Town'] = this.suburb;
        this.inputParamsAUPostCode['State'] = this.state;
        this.translate.get('Move Branch by Postcode').subscribe(function (res) {
            if (res) {
                _this.moveBranchMessage = res;
            }
        });
        ;
    };
    CreditApprovalComponent.prototype.ngAfterViewInit = function () {
    };
    CreditApprovalComponent.prototype.ngOnDestroy = function () {
    };
    CreditApprovalComponent.prototype.onMaritalSearch = function (obj) {
        this.maritalResp = obj.MaritalStatusCode + ' : ' + (obj.hasOwnProperty('MaritalStatusDesc') ? obj.MaritalStatusDesc : obj.Object.MaritalStatusDesc);
    };
    CreditApprovalComponent.prototype.onInvoiceFreq = function (data) {
        this.frequencyType = data.InvoiceFrequencyCode + ' - ' + data.InvoiceFrequencyDesc;
    };
    CreditApprovalComponent.prototype.onEmployeeDataReturn = function (data) {
        if (data.EmployeeSurName) {
            this.employeeData = data.EmployeeCode + ' - ' + data.EmployeeSurName;
        }
        else {
            this.employeeData = data.EmployeeCode;
        }
    };
    CreditApprovalComponent.prototype.onInvoiceSearchDataReturn = function (data) {
        if (data) {
            this.InvoiceSearchData = data;
        }
    };
    CreditApprovalComponent.prototype.GetDisplayFieldList = function (data) {
        data = document.getElementById('InvoiceSearchInput')['value'];
        this.inputParamsInvoiceSearch['CompanyInvoiceNumber'] = data;
        if (this.inputParamsInvoiceSearch.CompanyInvoiceNumber) {
            this.InvoiceSearchEllipsis.openModal();
        }
    };
    CreditApprovalComponent.prototype.onPaymentType = function (data) {
        if (data.PaymentDesc)
            this.paymentType = data.PaymentTypeCode + ' - ' + data.PaymentDesc;
        else
            this.paymentType = data.PaymentTypeCode;
    };
    CreditApprovalComponent.prototype.onCampaignSearch = function (data) {
        this.campaignSearch = data.CampaignID + '-' + data.CampaignDesc;
    };
    CreditApprovalComponent.prototype.setAccountNumber = function (data) {
        this.accountSearchField = data.AccountNumber;
    };
    CreditApprovalComponent.prototype.onDepotSearch = function (data) {
        this.DepotType = data.DepotNumber + '-' + data.Depotname;
    };
    CreditApprovalComponent.prototype.onInvoiceChargeTypeCode = function (data) {
    };
    CreditApprovalComponent.prototype.onSalesAreaSearch = function (data) {
        this.salesAreaType = data.SalesAreaCode + ' - ' + data.SalesAreaDesc;
    };
    CreditApprovalComponent.prototype.onOccupationSearch = function (data) {
        if (this.inputParamsOccupationSearch.parentMode === 'LookUp')
            this.OccupationType = data.OccupationCode + ' - ' + data.OccupationDesc;
        else
            this.OccupationType = data;
    };
    CreditApprovalComponent.prototype.onRejectionSearch = function (data) {
        this.dlRejectionValue = data.dlRejectionCode + ' - ' + data.dlRejectionDesc;
    };
    CreditApprovalComponent.prototype.onCustomerTypeSearch = function (data) {
        if (Object.keys(data).length === 1)
            this.CustomerType = data[Object.keys(data)[0]];
        if (Object.keys(data).length === 2)
            this.CustomerType = data[Object.keys(data)[0]] + ' ' + data[Object.keys(data)[1]];
        if (Object.keys(data).length === 3)
            this.CustomerType = data[Object.keys(data)[0]] + ' ' + data[Object.keys(data)[1]] + ' ' + data[Object.keys(data)[2]];
    };
    CreditApprovalComponent.prototype.onBatchProgramSearch = function (data) {
        this.batchProgramSearch = data.riBatchProgramName + ' - ' + data.riBatchProgramDescription;
    };
    CreditApprovalComponent.prototype.onTierCodeSearch = function (data) {
        if (data.TierSystemDescription)
            this.tierCodeSearch = data.TierCode + ' - ' + data.TierSystemDescription;
        else
            this.tierCodeSearch = data.TierCode;
    };
    CreditApprovalComponent.prototype.onGroupAccount = function (data) {
        if (data.GroupName) {
            this.GroupAccount = data.GroupAccountNumber + ' - ' + data.GroupName;
        }
        else {
            this.GroupAccount = data.GroupAccountNumber;
        }
    };
    CreditApprovalComponent.prototype.onBranchDataReceived = function (obj) {
        this.BranchSearch = obj.BranchNumber + ' : ' + (obj.hasOwnProperty('BranchName') ? obj.BranchName : obj.Object.BranchName);
    };
    CreditApprovalComponent.prototype.onAPICodeSearchReceived = function (obj) {
        this.APICodeSearch = obj.APICode + ' : ' + (obj.hasOwnProperty('APICodeDesc') ? obj.APICodeDesc : obj.Object.APICodeDesc);
    };
    CreditApprovalComponent.prototype.onTierSearchReceived = function (obj) {
        this.TierSearch = obj.TierCode + ' : ' + (obj.hasOwnProperty('TierSystemDescription') ? obj.TierSystemDescription : obj.Object.TierSystemDescription);
    };
    CreditApprovalComponent.prototype.onDurationReceived = function (obj) {
        this.duration = obj.ContractDurationCode + ' : ' + (obj.hasOwnProperty('ContractDurationDesc') ? obj.ContractDurationDesc : obj.Object.ContractDurationDesc);
    };
    CreditApprovalComponent.prototype.onProRataReceived = function (obj) {
        this.proRataCode = obj.value.ProRataChargeStatusCode;
        this.proRataDesc = obj.value.ProRataChargeStatusDesc;
    };
    CreditApprovalComponent.prototype.onCountryCodeReceived = function (obj) {
        this.countryResp = obj.riCountryCode + ' : ' + (obj.hasOwnProperty('riCountryDescription') ? obj.riCountryDescription : obj.Object.riCountryDescription);
    };
    CreditApprovalComponent.prototype.onBusinessCodeReceived = function (obj) {
        this.selectedBusiness = obj.businessCode + ' - ' + obj.businessDesc;
    };
    CreditApprovalComponent.prototype.onBCompanySearchReceived = function (obj) {
        this.bcompanyResp = obj.CompanyCode + obj.CompanyDesc;
    };
    CreditApprovalComponent.prototype.onLogoTypeSearch = function (obj) {
        console.log(obj);
        this.logotypesearch = obj.GenderCode + ' : ' + (obj.hasOwnProperty('GenderDesc') ? obj.GenderDesc : obj.Object.GenderDesc);
    };
    CreditApprovalComponent.prototype.onGenderSearch = function (obj) {
        this.gendersearch = obj.GenderCode + ' : ' + (obj.hasOwnProperty('GenderDesc') ? obj.GenderDesc : obj.Object.GenderDesc);
    };
    CreditApprovalComponent.prototype.onServiceCoverSearch = function (obj) {
        this.ServiceCoverType = obj.row.ProductCode + '-' + obj.row.ProductDesc + '-' + obj.row.ttServiceCover;
    };
    CreditApprovalComponent.prototype.onAUPostCode = function (obj) {
        this.suburb = obj[0].text;
        this.postcode = obj[1].text;
        this.state = obj[2].text;
    };
    CreditApprovalComponent.prototype.onInvoiceHeaderAddress = function (obj) {
        this.invoiceAddress = obj;
    };
    CreditApprovalComponent.prototype.onBranchServiceArea = function (obj) {
        this.branchServiceData = obj.BranchServiceAreaCode + ' : ' + obj.BranchServiceAreaDesc;
    };
    CreditApprovalComponent.prototype.onBusinessOriginDetailLanguageSearch = function (obj) {
        this.businessOrigin = obj.BusinessOriginDetailCode;
    };
    CreditApprovalComponent.prototype.onExpenseProductDataReceived = function (event) {
        this.productCode = event.ProductCode;
        this.expenseCode = event.ExpenseCode;
        this.contractType = event.ContractTypeCode;
    };
    CreditApprovalComponent.prototype.productChange = function (pcode) {
        this.productCodeSearchParams['productCode'] = this.productCode;
        this.productExpenseEllipsis.childConfigParams = this.productCodeSearchParams;
        this.productExpenseEllipsis.updateComponent();
    };
    CreditApprovalComponent.prototype.onProgramScheduleDataReceived = function (obj) {
        this.scheduleNumber = obj.riBPSUniqueNumber;
    };
    CreditApprovalComponent.prototype.onAccountGrpSearch = function (data) {
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
    };
    CreditApprovalComponent.prototype.onClickPostCode = function () {
        this.childModal.show();
    };
    CreditApprovalComponent.prototype.postCodeMessageClose = function () {
        this.childModal.hide();
    };
    CreditApprovalComponent.prototype.onClickServiceCoverCalenderGrid = function () {
        this._router.navigate(['grid/application/ServiceCoverCalendarDate'], { queryParams: { SCRowID: '0x0000000000055ae5', ServiceVisitFrequency: '9' } });
    };
    CreditApprovalComponent.prototype.onListGroupSearchClick = function () {
        this._router.navigate(['grid/application/ListGroupSearch']);
    };
    CreditApprovalComponent.prototype.onPNOLLevelHistoryClick = function () {
        this._router.navigate(['/application/PNOLLevelHistory'], { queryParams: { ContractNumber: '00105679', PremiseNumber: '1' } });
    };
    CreditApprovalComponent.decorators = [
        { type: Component, args: [{
                    selector: 'icabs-creditapproval',
                    templateUrl: 'credit-approval.html'
                },] },
    ];
    CreditApprovalComponent.ctorParameters = [
        { type: ComponentInteractionService, },
        { type: Router, },
        { type: HttpService, },
        { type: Utils, },
        { type: FormBuilder, },
        { type: RiExchange, },
        { type: Logger, },
        { type: TranslateService, },
        { type: LocaleTranslationService, },
    ];
    CreditApprovalComponent.propDecorators = {
        'productExpenseEllipsis': [{ type: ViewChild, args: ['productExpenseEllipsis',] },],
        'InvoiceSearchEllipsis': [{ type: ViewChild, args: ['InvoiceSearchEllipsis',] },],
        'childModal': [{ type: ViewChild, args: ['childModal',] },],
    };
    return CreditApprovalComponent;
}());
