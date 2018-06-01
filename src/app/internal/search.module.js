import { ClosedTemplateSearchComponent } from './search/iCABSBClosedTemplateSearch.component';
import { HistoryTypeLanguageSearchComponent } from './search/iCABSSHistoryTypeLanguageSearch.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { CampaignSearchComponent } from './search/iCABSBCampaignSearch/iCABSBCampaignSearch';
import { BusinessOriginDetailLanguageSearchComponent } from './search/iCABSBBusinessOriginDetailLanguageSearch';
import { BusinessOriginLangSearchComponent } from './search/iCABSBBusinessOriginLanguageSearch';
import { BranchServiceAreaSearchComponent } from './search/iCABSBBranchServiceAreaSearch';
import { TaxcodeSearchComponent } from './search/iCABSSTaxCodeSearch';
import { PremiseSearchComponent } from './search/iCABSAPremiseSearch';
import { ContractDurationComponent } from './search/iCABSBContractDurationSearch';
import { BranchSearchComponent } from './search/iCABSBBranchSearch';
import { APICodeSearchComponent } from './search/iCABSBAPICodeSearch';
import { CountryCodeComponent } from './search/iCABSACountryCodeSearch';
import { EmployeeSearchComponent } from './search/iCABSBEmployeeSearch';
import { InvoiceChargeSearchComponent } from './search/iCABSAInvoiceChargeSearch.component';
import { SalesAreaSearchComponent } from './search/iCABSBSalesAreaSearch.component';
import { BatchProgramSearchComponent } from './search/iCABSMGBatchProgramSearch';
import { BusinessSearchComponent } from './search/iCABSSBusinessSearch.component';
import { AccountSearchComponent } from './search/iCABSASAccountSearch';
import { AccountGroupSearchComponent } from './search/iCABSAAccountGroupSearch';
import { InvoiceFeeSearchComponent } from './search/iCABSBInvoiceFeeSearch';
import { GroupAccountNumberComponent } from './search/iCABSSGroupAccountNumberSearch';
import { PaymentSearchComponent } from './search/iCABSBPaymentTypeSearch';
import { InvoiceFrequencySearchComponent } from './search/iCABSBBusinessInvoiceFrequencySearch';
import { PostCodeSearchComponent } from './search/iCABSBPostcodeSearch.component';
import { AccountHistoryDetailComponent } from './search/iCABSAAccountHistoryDetail';
import { ContractSearchComponent } from './search/iCABSAContractSearch';
import { CustomerTypeSearchComponent } from './search/iCABSSCustomerTypeSearch';
import { ServiceCoverLocationEffectDateSearchComponent } from './search/iCABSAServiceCoverLocationEffectDateSearch.component';
import { BCompanySearchComponent } from './search/iCABSBCompanySearch';
import { InvoiceHeaderAddressComponent } from './search/iCABSAInvoiceHeaderAddressDetails.component';
import { AccountBusinessTypeSearchComponent } from './search/iCABSSAccountBusinessTypeSearch/iCABSSAccountBusinessTypeSearch';
import { ICABSBAPICodeSearchComponent } from './search/iCABSBAPICodeSearchComponent';
import { ApiRateSearchComponent } from './search/iCABSBApiRateSearch';
import { ProductExpenseSearchComponent } from './search/iCABSBProductExpenseSearch';
import { ServiceCoverSearchComponent } from './search/iCABSAServiceCoverSearch';
import { BatchProgramScheduleSearchComponent } from './search/riMBatchProgramScheduleSearch';
import { TierSearchComponent } from './search/iCABSBTierSearch';
import { BusinessTierSearchComponent } from './search/iCABSBTierSearchComponent';
import { RegulatoryAuthoritySearchComponent } from './search/iCABSBRegulatoryAuthoritySearch.component';
import { JobServiceCoverSearchComponent } from './search/iCABSCMNatAxJobServiceCoverSearch';
import { InvoiceGroupSearchComponent } from './search/iCABSAInvoiceGroupSearch.component';
import { OccupationSearchComponent } from './search/iCABSSOccupationSearch.component';
import { PremiseLocationSearchComponent } from './search/iCABSAPremiseLocationSearch.component';
import { MaritalStatusSearchComponent } from './search/iCABSSMaritalStatusSearch.component';
import { DeportSearchComponent } from './search/iCABSBDepotSearch.component';
import { ProRataChargeStatusLanguageSearchComponent } from './search/iCABSSProRataChargeStatusLanguageSearch';
import { CalendarTemplateSearchComponent } from './search/iCABSBCalendarTemplateSearch.component';
import { LogoTypeSearchComponent } from './search/iCABSBLogoTypeSearch';
import { GenderSearchComponent } from './search/iCABSSGenderSearch.component';
import { InvoiceSearchComponent } from './search/iCABSInvoiceSearch.component';
import { DlRejectionSearchComponent } from './search/iCABSBdlRejectionSearch';
import { InternalSearchModuleRoutes } from './../base/PageRoutes';
import { PaymentTermSearchComponent } from './search/iCABSBPaymentTermSearch.component';
import { InvoiceRunDateSelectPrintComponent } from './search/iCABSBInvoiceRunDateSelectPrint.component';
import { AUPostcodeSearchComponent } from './grid-search/iCABSAAUPostcodeSearch';
import { AccountPremiseSearchComponent } from './grid-search/iCABSAAccountPremiseSearchGrid';
import { AccountHistoryGridComponent } from './grid-search/iCABSAAccountHistoryGrid';
import { ProductSearchGridComponent } from './search/iCABSBProductSearch';
import { InvoiceGroupGridComponent } from './grid-search/iCABSAInvoiceGroupGrid';
import { ScreenNotReadyComponent } from '../../shared/components/screenNotReady';
import { PremiseLocationAllocationGridComponent } from './grid-search/iCABSAPremiseLocationAllocationGrid';
import { ServiceCoverDetailsComponent } from './search/iCABSAServiceCoverDetailSearch.component';
import { ServiceSummaryDetailComponent } from './search/iCABSAServiceSummaryDetail';
import { MarktSelectSearchComponent } from './search/iCABSMarktSelectSearch.component';
import { PNOLPremiseSearchGridComponent } from './grid-search/iCABSAPNOLPremiseSearchGrid.component';
export var InternalSearchModule = (function () {
    function InternalSearchModule() {
    }
    InternalSearchModule.decorators = [
        { type: NgModule, args: [{
                    exports: [
                        BusinessSearchComponent,
                        PaymentSearchComponent,
                        InvoiceFrequencySearchComponent,
                        InvoiceChargeSearchComponent,
                        SalesAreaSearchComponent,
                        BatchProgramSearchComponent,
                        AccountSearchComponent,
                        AccountGroupSearchComponent,
                        GroupAccountNumberComponent,
                        InvoiceFeeSearchComponent,
                        PostCodeSearchComponent,
                        EmployeeSearchComponent,
                        AccountHistoryDetailComponent,
                        ContractSearchComponent,
                        CountryCodeComponent,
                        BranchSearchComponent,
                        APICodeSearchComponent,
                        BCompanySearchComponent,
                        PremiseSearchComponent,
                        TaxcodeSearchComponent,
                        BusinessOriginLangSearchComponent,
                        BusinessOriginDetailLanguageSearchComponent,
                        BranchServiceAreaSearchComponent,
                        InvoiceHeaderAddressComponent,
                        AccountBusinessTypeSearchComponent,
                        ICABSBAPICodeSearchComponent,
                        CampaignSearchComponent,
                        ApiRateSearchComponent,
                        ProductExpenseSearchComponent,
                        ServiceCoverSearchComponent,
                        TierSearchComponent,
                        BusinessTierSearchComponent,
                        MaritalStatusSearchComponent,
                        BatchProgramScheduleSearchComponent,
                        RegulatoryAuthoritySearchComponent,
                        JobServiceCoverSearchComponent,
                        ProRataChargeStatusLanguageSearchComponent,
                        InvoiceGroupSearchComponent,
                        ServiceCoverLocationEffectDateSearchComponent,
                        CustomerTypeSearchComponent,
                        OccupationSearchComponent,
                        RegulatoryAuthoritySearchComponent,
                        PremiseLocationSearchComponent,
                        DeportSearchComponent,
                        ProRataChargeStatusLanguageSearchComponent,
                        CalendarTemplateSearchComponent,
                        InvoiceSearchComponent,
                        DlRejectionSearchComponent,
                        HistoryTypeLanguageSearchComponent,
                        GenderSearchComponent,
                        LogoTypeSearchComponent,
                        ContractDurationComponent,
                        PaymentTermSearchComponent,
                        InvoiceRunDateSelectPrintComponent,
                        ClosedTemplateSearchComponent,
                        AUPostcodeSearchComponent,
                        AccountPremiseSearchComponent,
                        AccountHistoryGridComponent,
                        InvoiceGroupGridComponent,
                        ScreenNotReadyComponent,
                        PremiseLocationAllocationGridComponent,
                        ServiceCoverDetailsComponent,
                        ProductSearchGridComponent,
                        ServiceSummaryDetailComponent,
                        MarktSelectSearchComponent,
                        PNOLPremiseSearchGridComponent
                    ],
                    imports: [
                        SharedModule,
                        RouterModule.forChild([
                            { path: 'application/payment', component: PaymentSearchComponent },
                            { path: 'application/invoicefreqsearch', component: InvoiceFrequencySearchComponent },
                            { path: 'application/campaignsearchcomponent', component: CampaignSearchComponent },
                            { path: 'application/accountsearch', component: AccountSearchComponent },
                            { path: 'application/accountgroupsearch', component: AccountGroupSearchComponent },
                            { path: 'application/groupaccountnumbersearch', component: GroupAccountNumberComponent },
                            { path: 'application/invoicefeesearch', component: InvoiceFeeSearchComponent },
                            { path: 'application/contractsearch', component: ContractSearchComponent },
                            { path: 'application/accountHistory/detail', component: AccountHistoryDetailComponent },
                            { path: 'application/accountbusinesstypesearch', component: AccountBusinessTypeSearchComponent },
                            { path: 'application/apiCodeSearch', component: ICABSBAPICodeSearchComponent },
                            { path: 'application/apiRateSearch', component: ApiRateSearchComponent },
                            { path: 'application/maritalStatusSearch', component: MaritalStatusSearchComponent },
                            { path: 'application/productExpenseSearch', component: ProductExpenseSearchComponent },
                            { path: 'application/serviceCoverSearch', component: ServiceCoverSearchComponent },
                            { path: 'application/productExpenseSearch', component: ProductExpenseSearchComponent },
                            { path: InternalSearchModuleRoutes.ICABSACMNATAXJOBSERVICECOVERSEARCH, component: JobServiceCoverSearchComponent },
                            { path: 'application/ProRataChargeStatusLanguageSearch', component: ProRataChargeStatusLanguageSearchComponent },
                            { path: 'application/invoiceGroupSearch', component: InvoiceGroupSearchComponent },
                            { path: 'application/ServiceCoverLocationEffectDateSearchComponent', component: ServiceCoverLocationEffectDateSearchComponent },
                            { path: 'application/occupationSearch', component: OccupationSearchComponent },
                            { path: 'application/ProRataChargeStatusLanguageSearch', component: ProRataChargeStatusLanguageSearchComponent },
                            { path: 'application/CustomerTypeSearch', component: CustomerTypeSearchComponent },
                            { path: 'application/PremiseLocationSearch', component: PremiseLocationSearchComponent },
                            { path: 'application/depotSearch', component: DeportSearchComponent },
                            { path: 'application/ProRataChargeStatusLanguageSearch', component: ProRataChargeStatusLanguageSearchComponent },
                            { path: 'application/CalendarTemplateSearch', component: CalendarTemplateSearchComponent },
                            { path: 'application/InvoiceSearch', component: InvoiceSearchComponent },
                            { path: InternalSearchModuleRoutes.ICABSBDLREJECTIONSEARCH, component: DlRejectionSearchComponent },
                            { path: InternalSearchModuleRoutes.ICABSSHISTORYTYPELANGUAGESEARCH, component: HistoryTypeLanguageSearchComponent },
                            { path: 'contractmanagement/account/invoiceCharge', component: InvoiceChargeSearchComponent },
                            { path: 'contractmanagement/account/employeeSearch', component: EmployeeSearchComponent },
                            { path: 'application/invoiceRunDate/print', component: InvoiceRunDateSelectPrintComponent },
                            { path: InternalSearchModuleRoutes.ICABSBCLOSEDTEMPLATESEARCH, component: ClosedTemplateSearchComponent },
                            { path: InternalSearchModuleRoutes.ICABSBRANCHSERVICEAREASEARCH, component: BranchServiceAreaSearchComponent },
                            { path: 'application/aupostcode/search', component: AUPostcodeSearchComponent },
                            { path: 'application/accountpremise', component: AccountPremiseSearchComponent },
                            { path: 'application/accounthistorygrid', component: AccountHistoryGridComponent },
                            { path: 'application/invoicegroupgrid', component: InvoiceGroupGridComponent },
                            { path: 'application/premiseLocationAllocation', component: PremiseLocationAllocationGridComponent },
                            { path: 'application/ServiceCoverDetails', component: ServiceCoverDetailsComponent },
                            { path: InternalSearchModuleRoutes.ICABSBPRODUCTSEARCH, component: ProductSearchGridComponent },
                            { path: InternalSearchModuleRoutes.ICABSASERVICESUMMARYDETAIL, component: ServiceSummaryDetailComponent },
                            { path: 'application/premiseSearchGrid', component: PNOLPremiseSearchGridComponent }
                        ])
                    ],
                    declarations: [
                        BusinessSearchComponent,
                        PaymentSearchComponent,
                        InvoiceFrequencySearchComponent,
                        InvoiceChargeSearchComponent,
                        SalesAreaSearchComponent,
                        BatchProgramSearchComponent,
                        AccountSearchComponent,
                        AccountGroupSearchComponent,
                        GroupAccountNumberComponent,
                        InvoiceFeeSearchComponent,
                        PostCodeSearchComponent,
                        EmployeeSearchComponent,
                        AccountHistoryDetailComponent,
                        ContractSearchComponent,
                        CountryCodeComponent,
                        BranchSearchComponent,
                        APICodeSearchComponent,
                        BCompanySearchComponent,
                        PremiseSearchComponent,
                        TaxcodeSearchComponent,
                        BusinessOriginLangSearchComponent,
                        BusinessOriginDetailLanguageSearchComponent,
                        BranchServiceAreaSearchComponent,
                        InvoiceHeaderAddressComponent,
                        AccountBusinessTypeSearchComponent,
                        ICABSBAPICodeSearchComponent,
                        CampaignSearchComponent,
                        ApiRateSearchComponent,
                        ProductExpenseSearchComponent,
                        ServiceCoverSearchComponent,
                        TierSearchComponent,
                        BusinessTierSearchComponent,
                        MaritalStatusSearchComponent,
                        BatchProgramScheduleSearchComponent,
                        RegulatoryAuthoritySearchComponent,
                        JobServiceCoverSearchComponent,
                        ProRataChargeStatusLanguageSearchComponent,
                        InvoiceGroupSearchComponent,
                        ServiceCoverLocationEffectDateSearchComponent,
                        CustomerTypeSearchComponent,
                        OccupationSearchComponent,
                        RegulatoryAuthoritySearchComponent,
                        PremiseLocationSearchComponent,
                        DeportSearchComponent,
                        ProRataChargeStatusLanguageSearchComponent,
                        CalendarTemplateSearchComponent,
                        InvoiceSearchComponent,
                        DlRejectionSearchComponent,
                        HistoryTypeLanguageSearchComponent,
                        GenderSearchComponent,
                        LogoTypeSearchComponent,
                        ContractDurationComponent,
                        PaymentTermSearchComponent,
                        InvoiceRunDateSelectPrintComponent,
                        ClosedTemplateSearchComponent,
                        AUPostcodeSearchComponent,
                        AccountPremiseSearchComponent,
                        AccountHistoryGridComponent,
                        InvoiceGroupGridComponent,
                        ScreenNotReadyComponent,
                        PremiseLocationAllocationGridComponent,
                        ServiceCoverDetailsComponent,
                        ProductSearchGridComponent,
                        ServiceSummaryDetailComponent,
                        MarktSelectSearchComponent,
                        PNOLPremiseSearchGridComponent
                    ],
                    entryComponents: [
                        BusinessSearchComponent,
                        PaymentSearchComponent,
                        InvoiceFrequencySearchComponent,
                        InvoiceChargeSearchComponent,
                        SalesAreaSearchComponent,
                        BatchProgramSearchComponent,
                        AccountSearchComponent,
                        GroupAccountNumberComponent,
                        InvoiceFeeSearchComponent,
                        PostCodeSearchComponent,
                        EmployeeSearchComponent,
                        AccountHistoryDetailComponent,
                        ContractSearchComponent,
                        CountryCodeComponent,
                        BranchSearchComponent,
                        APICodeSearchComponent,
                        BCompanySearchComponent,
                        PremiseSearchComponent,
                        TaxcodeSearchComponent,
                        BusinessOriginLangSearchComponent,
                        BusinessOriginDetailLanguageSearchComponent,
                        BranchServiceAreaSearchComponent,
                        InvoiceHeaderAddressComponent,
                        AccountBusinessTypeSearchComponent,
                        ICABSBAPICodeSearchComponent,
                        ApiRateSearchComponent,
                        ProductExpenseSearchComponent,
                        ServiceCoverSearchComponent,
                        TierSearchComponent,
                        BusinessTierSearchComponent,
                        MaritalStatusSearchComponent,
                        BatchProgramScheduleSearchComponent,
                        RegulatoryAuthoritySearchComponent,
                        JobServiceCoverSearchComponent,
                        ProRataChargeStatusLanguageSearchComponent,
                        InvoiceGroupSearchComponent,
                        ServiceCoverLocationEffectDateSearchComponent,
                        RegulatoryAuthoritySearchComponent,
                        CustomerTypeSearchComponent,
                        OccupationSearchComponent,
                        PremiseLocationSearchComponent,
                        DeportSearchComponent,
                        ProRataChargeStatusLanguageSearchComponent,
                        CalendarTemplateSearchComponent,
                        InvoiceSearchComponent,
                        HistoryTypeLanguageSearchComponent,
                        GenderSearchComponent,
                        LogoTypeSearchComponent,
                        ContractDurationComponent,
                        PaymentTermSearchComponent,
                        InvoiceRunDateSelectPrintComponent,
                        ClosedTemplateSearchComponent,
                        AUPostcodeSearchComponent,
                        AccountPremiseSearchComponent,
                        AccountHistoryGridComponent,
                        InvoiceGroupGridComponent,
                        ScreenNotReadyComponent,
                        PremiseLocationAllocationGridComponent,
                        ServiceCoverDetailsComponent,
                        ProductSearchGridComponent,
                        MarktSelectSearchComponent,
                        PNOLPremiseSearchGridComponent
                    ]
                },] },
    ];
    InternalSearchModule.ctorParameters = [];
    return InternalSearchModule;
}());
