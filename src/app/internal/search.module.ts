import { NgModule, ModuleWithProviders } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../../shared/shared.module';
import { ProductDetailSearchComponent } from './search/iCABSBProductDetailSearch.component';
import { ClosedTemplateSearchComponent } from './search/iCABSBClosedTemplateSearch.component';
import { HistoryTypeLanguageSearchComponent } from './search/iCABSSHistoryTypeLanguageSearch.component';
import { CampaignSearchComponent } from './search/iCABSBCampaignSearch/iCABSBCampaignSearch';
import { BusinessOriginDetailLanguageSearchComponent } from './search/iCABSBBusinessOriginDetailLanguageSearch';
import { BranchServiceAreaSearchComponent } from './search/iCABSBBranchServiceAreaSearch';
import { TaxCodeSearchComponent } from './search/iCABSSTaxCodeSearch.component';
import { PremiseSearchComponent } from './search/iCABSAPremiseSearch';
import { ContractDurationComponent } from './search/iCABSBContractDurationSearch';
import { BranchSearchComponent } from './search/iCABSBBranchSearch';
import { APICodeSearchComponent } from './search/iCABSBAPICodeSearch';
import { ContactTypeSearchComponent } from './search/iCABSSContactTypeSearch';
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
import { ServicePlanSearchComponent } from './search/iCABSSeServicePlanSearch.component';
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
import { RouteAwayGuardService } from '../../shared/services/route-away-guard.service';
import { RouteAwayGlobals } from '../../shared/services/route-away-global.service';
import { ServiceCoverSearchComponent } from './search/iCABSAServiceCoverSearch';
import { BatchProgramScheduleSearchComponent } from './search/riMBatchProgramScheduleSearch';
import { TierSearchComponent } from './search/iCABSBTierSearch';
import { BusinessTierSearchComponent } from './search/iCABSBTierSearchComponent';
import { RegulatoryAuthoritySearchComponent } from './search/iCABSBRegulatoryAuthoritySearch.component';
import { JobServiceCoverSearchComponent } from './search/iCABSCMNatAxJobServiceCoverSearch';
import { InvoiceGroupSearchComponent } from './search/iCABSAInvoiceGroupSearch.component';
import { OccupationSearchComponent } from './search/iCABSSOccupationSearch.component';
import { PremiseLocationSearchComponent } from './search/iCABSAPremiseLocationSearch.component';
import { ProductCoverSearchComponent } from './search/iCABSBProductCoverSearch.component';
import { MaritalStatusSearchComponent } from './search/iCABSSMaritalStatusSearch.component';
import { DeportSearchComponent } from './search/iCABSBDepotSearch.component';
import { ProRataChargeStatusLanguageSearchComponent } from './search/iCABSSProRataChargeStatusLanguageSearch';
import { CalendarTemplateSearchComponent } from './search/iCABSBCalendarTemplateSearch.component';
import { LogoTypeSearchComponent } from './search/iCABSBLogoTypeSearch';
import { GenderSearchComponent } from './search/iCABSSGenderSearch.component';
import { InvoiceSearchComponent } from './search/iCABSInvoiceSearch.component';
import { DlRejectionSearchComponent } from './search/iCABSBdlRejectionSearch';
import { InternalSearchModuleRoutes, InternalGridSearchApplicationModuleRoutesConstant } from './../base/PageRoutes';
import { PaymentTermSearchComponent } from './search/iCABSBPaymentTermSearch.component';
import { InvoiceRunDateSelectPrintComponent } from './search/iCABSBInvoiceRunDateSelectPrint.component';
import { InvoiceRunDateSelectPrint2Component } from './search/iCABSBInvoiceRunDateSelectPrint2.component';
import { AUPostcodeSearchComponent } from './grid-search/iCABSAAUPostcodeSearch';
import { AccountPremiseSearchComponent } from './grid-search/iCABSAAccountPremiseSearchGrid';
import { AccountHistoryGridComponent } from './grid-search/iCABSAAccountHistoryGrid';
import { InvoiceGroupGridComponent } from './grid-search/iCABSAInvoiceGroupGrid';
import { ScreenNotReadyComponent } from '../../shared/components/screenNotReady';
import { LostBusinessContactSearchComponent } from './search/iCABSALostBusinessContactSearch.component';
import { ProductSearchGridComponent } from './search/iCABSBProductSearch';
import { ProspectSearchComponent } from './search/iCABSCMProspectSearch.component';
import { PremiseLocationAllocationGridComponent } from './search/iCABSAPremiseLocationAllocationGrid';
import { ServiceCoverDetailsComponent } from './search/iCABSAServiceCoverDetailSearch.component';
import { ServiceSummaryDetailComponent } from './search/iCABSAServiceSummaryDetail';
import { MarktSelectSearchComponent } from './search/iCABSMarktSelectSearch.component';
import { PlanVisitSearchComponent } from './search/iCABSSePlanVisitSearch.component';
import { PestNetOnLineLevelSearchComponent } from './search/iCABSBPestNetOnLineLevelSearch.component';
import { PNOLPremiseSearchGridComponent } from './grid-search/iCABSAPNOLPremiseSearchGrid.component';
import { ProspectStatusSearchComponent } from './search/iCABSCMProspectStatusSearch.component';
import { LostBusinessRequestSearchComponent } from './search/iCABSALostBusinessRequestSearch.component';
import { VisitTypeSearchComponent } from './search/iCABSBVisitTypeSearch.component';
import { BusinessOriginLangSearchComponent } from './search/iCABSBBusinessOriginLanguageSearch.component';
import { LostBusinessDetailSearchComponent } from './search/iCABSBLostBusinessDetailSearch.component';
import { ContactTypeDetailSearchComponent, ContactTypeDetailSearchDropDownComponent } from './search/iCABSSContactTypeDetailSearch.component';
import { ExpenseCodeSearchDropDownComponent, ExpenseCodeSearchComponent } from './search/iCABSBExpenseCodeSearch.component';
import { LostBusinessRequestOriginLanguageSearchComponent } from './search/iCABSSLostBusinessRequestOriginLanguageSearch.component';
import { LostBusinessContactTypeLanguageSearchComponent } from './search/iCABSSLostBusinessContactTypeLanguageSearch.component';
import { CallCentreReviewGridMultiComponent } from './search/iCABSCMCallCentreReviewGridMulti';
import { LostBusinessContactOutcomeLanguageSearchComponent } from './search/iCABSSLostBusinessContactOutcomeLanguageSearch.component';
import { LostBusinessDetailLanguageSearchComponent } from './search/iCABSBLostBusinessDetailLanguageSearch.component';
import { ContactMediumLanguageSearchComponent } from './search/iCABSSContactMediumLanguageSearch.component';
import { LostBusinessLanguageSearchComponent } from './search/iCABSBLostBusinessLanguageSearch.component';
import { ServiceTypeSearchComponent } from './search/iCABSBServiceTypeSearch.component';
import { SystemInvoiceCreditReasonSearchComponent } from './search/iCABSSSystemInvoiceCreditReasonSearch.component';
import { SystemInvoiceFormatLanguageSearchComponent } from './search/iCABSSSystemInvoiceFormatLanguageSearch.component';
import { SICSearchComponent } from './search/iCABSSSICSearch.component';
import { ContractTypeLanguageSearchComponent } from './search/iCABSBContractTypeLanguageSearch.component';
import { ProductServiceGroupSearchComponent } from './search/iCABSBProductServiceGroupSearch.component';
import { ListGroupSearchComponent } from './grid-search/iCABSBListGroupSearch.component';
import { InvoiceChargeTypeLanguageSearchComponent } from './search/iCABSBInvoiceChargeTypeLanguageSearch.component';
import { ProductAttributeValuesSearchComponent } from './search/iCABSBProductAttributeValuesSearch.component';
import { ProductSalesGroupSearchComponent } from './search/iCABSBProductSalesGroupSearch.component';
import { ComponentTypeLanguageSearchComponent } from './search/iCABSBComponentTypeLanguageSearch.component';
import { EmployeeGridComponent } from './search/iCABSAEmployeeGrid.component';
import { InfestationLevelSearchComponent } from './search/iCABSBInfestationLevelSearch.component';
import { CustomerCategorySearchComponent } from './search/iCABSBCustomerCategorySearch.component';
import { InvoiceCreditReasonLanguageSearchComponent } from './search/iCABSSInvoiceCreditReasonLanguageSearch.component';
import { SeasonalTemplateSearchComponent } from './search/iCABSBSeasonalTemplateSearch';
import { RMMCategoryLanguageSearchComponent } from './search/iCABSARMMCategoryLanguageSearch.component';
import { RoutingSearchComponent } from './search/iCABSARoutingSearch';
import { LOSSearchComponent } from './search/iCABSSLOSSearch.component';

@NgModule({
    exports: [
        SeasonalTemplateSearchComponent,
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
        ServiceTypeSearchComponent,
        AccountHistoryDetailComponent,
        ServicePlanSearchComponent,
        ContractSearchComponent,
        CountryCodeComponent,
        InfestationLevelSearchComponent,
        BranchSearchComponent,
        PestNetOnLineLevelSearchComponent,
        ContactTypeSearchComponent,
        APICodeSearchComponent,
        BCompanySearchComponent,
        PremiseSearchComponent,
        LostBusinessDetailSearchComponent,
        TaxCodeSearchComponent,
        ProductCoverSearchComponent,
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
        InvoiceRunDateSelectPrint2Component,
        ClosedTemplateSearchComponent,
        AUPostcodeSearchComponent,
        AccountPremiseSearchComponent,
        AccountHistoryGridComponent,
        InvoiceGroupGridComponent,
        LostBusinessContactSearchComponent,
        ScreenNotReadyComponent,
        ProductSearchGridComponent,
        ProspectSearchComponent,
        PremiseLocationAllocationGridComponent,
        ServiceCoverDetailsComponent,
        ServiceSummaryDetailComponent,
        MarktSelectSearchComponent,
        PNOLPremiseSearchGridComponent,
        ProspectStatusSearchComponent,
        LostBusinessRequestSearchComponent,
        VisitTypeSearchComponent,
        ContactTypeDetailSearchComponent,
        ContactTypeDetailSearchDropDownComponent,
        ExpenseCodeSearchDropDownComponent,
        ExpenseCodeSearchComponent,
        LostBusinessContactTypeLanguageSearchComponent,
        LostBusinessRequestOriginLanguageSearchComponent,
        LostBusinessContactOutcomeLanguageSearchComponent,
        LostBusinessLanguageSearchComponent,
        LostBusinessDetailLanguageSearchComponent,
        SystemInvoiceCreditReasonSearchComponent,
        SystemInvoiceFormatLanguageSearchComponent,
        SICSearchComponent,
        ContractTypeLanguageSearchComponent,
        ProductServiceGroupSearchComponent,
        ListGroupSearchComponent,
        InvoiceChargeTypeLanguageSearchComponent,
        ProductAttributeValuesSearchComponent,
        ProductSalesGroupSearchComponent,
        ComponentTypeLanguageSearchComponent,
        CustomerCategorySearchComponent,
        EmployeeGridComponent,
        InvoiceCreditReasonLanguageSearchComponent,
        RMMCategoryLanguageSearchComponent,
        RoutingSearchComponent,
        SeasonalTemplateSearchComponent,
        LOSSearchComponent
    ],
    imports: [
        SharedModule,
        RouterModule.forChild([
            { path: InternalSearchModuleRoutes.ICABSBSEASONALTEMPLATESEARCH, component: SeasonalTemplateSearchComponent },
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
            { path: InternalSearchModuleRoutes.ICABSSESERVICEPLANSEARCH, component: ServicePlanSearchComponent },
            { path: 'contractmanagement/account/invoiceCharge', component: InvoiceChargeSearchComponent },
            { path: 'contractmanagement/account/employeeSearch', component: EmployeeSearchComponent },
            { path: InternalSearchModuleRoutes.ICABSSEPLANVISITSEARCH, component: PlanVisitSearchComponent },
            { path: 'application/invoiceRunDate/print', component: InvoiceRunDateSelectPrintComponent },
            { path: InternalSearchModuleRoutes.ICABSBINVOICERUNDATESELECTPRINT2, component: InvoiceRunDateSelectPrint2Component },
            { path: InternalSearchModuleRoutes.ICABSBCLOSEDTEMPLATESEARCH, component: ClosedTemplateSearchComponent },
            { path: InternalSearchModuleRoutes.ICABSBRANCHSERVICEAREASEARCH, component: BranchServiceAreaSearchComponent },
            { path: 'application/aupostcode/search', component: AUPostcodeSearchComponent },
            { path: 'application/accountpremise', component: AccountPremiseSearchComponent },
            { path: 'application/accounthistorygrid', component: AccountHistoryGridComponent },
            { path: InternalSearchModuleRoutes.ICABSALOSTBUSINESSCONTACTSEARCH, component: LostBusinessContactSearchComponent },
            { path: 'application/invoicegroupgrid', component: InvoiceGroupGridComponent },
            { path: InternalSearchModuleRoutes.ICABSBPRODUCTSEARCH, component: ProductSearchGridComponent },
            { path: InternalSearchModuleRoutes.ICABSCMPROSPECTSEARCH, component: ProspectSearchComponent },
            { path: 'application/premiseLocationAllocation', component: PremiseLocationAllocationGridComponent, canDeactivate: [RouteAwayGuardService] },
            { path: InternalSearchModuleRoutes.ICABSBLOSTBUSINESSDETAILSEARCH, component: LostBusinessDetailSearchComponent },
            { path: 'application/ServiceCoverDetails', component: ServiceCoverDetailsComponent },
            { path: InternalSearchModuleRoutes.ICABSBPRODUCTSEARCH, component: ProductSearchGridComponent },
            { path: InternalSearchModuleRoutes.ICABSBPESTNETONLINELEVELSEARCH, component: PestNetOnLineLevelSearchComponent },
            { path: InternalSearchModuleRoutes.ICABSBINFESTATIONLEVELSEARCH, component: InfestationLevelSearchComponent },
            { path: InternalSearchModuleRoutes.ICABSASERVICESUMMARYDETAIL, component: ServiceSummaryDetailComponent },
            { path: InternalSearchModuleRoutes.ICABSCMPROSPECTSTATUSSEARCH, component: ProspectStatusSearchComponent },
            { path: InternalSearchModuleRoutes.ICABSALOSTBUSINESSREQUESTSEARCH, component: LostBusinessRequestSearchComponent },
            { path: 'application/premiseSearchGrid', component: PNOLPremiseSearchGridComponent },
            { path: InternalSearchModuleRoutes.ICABSSTAXCODESEARCH, component: TaxCodeSearchComponent },
            { path: InternalSearchModuleRoutes.ICABSBPRODUCTDETAILSEARCH, component: ProductDetailSearchComponent },
            { path: InternalSearchModuleRoutes.ICABSCMCALLCENTREREVIEWGRIDMULTI, component: CallCentreReviewGridMultiComponent },
            { path: InternalSearchModuleRoutes.ICABSSLOSTBUSINESSCONTACTOUTCOMELANGUAGESEARCH, component: LostBusinessContactOutcomeLanguageSearchComponent },
            { path: InternalSearchModuleRoutes.ICABSSCONTACTMEDIUMLANGUAGESEARCH, component: ContactMediumLanguageSearchComponent },
            { path: InternalSearchModuleRoutes.ICABSBPRODUCTCOVERSEARCH, component: ProductCoverSearchComponent },
            { path: InternalSearchModuleRoutes.ICABSSSYSTEMINVOICECREDITREASONSEARCH, component: SystemInvoiceCreditReasonSearchComponent },
            { path: InternalSearchModuleRoutes.ICABSBCUSTOMERCATEGORYSEARCH, component: CustomerCategorySearchComponent },
            { path: InternalSearchModuleRoutes.ICABSBPRODUCTSALESGROUPSEARCH, component: ProductSalesGroupSearchComponent },
            { path: InternalSearchModuleRoutes.ICABSSSYSTEMINVOICEFORMATLANGUAGESEARCH, component: SystemInvoiceFormatLanguageSearchComponent },
            { path: InternalSearchModuleRoutes.ICABSSSICSEARCH, component: SICSearchComponent },
            { path: InternalGridSearchApplicationModuleRoutesConstant.ICABSBLISTGROUPSEARCH, component: ListGroupSearchComponent },
            { path: InternalSearchModuleRoutes.ICABSAROUTINGSEARCH, component: RoutingSearchComponent },
            { path: InternalSearchModuleRoutes.ICABSBSEASONALTEMPLATESEARCH, component: SeasonalTemplateSearchComponent }
        ])
    ],

    declarations: [
        SeasonalTemplateSearchComponent,
        BusinessSearchComponent,
        PaymentSearchComponent,
        InvoiceFrequencySearchComponent,
        InvoiceChargeSearchComponent,
        SalesAreaSearchComponent,
        BatchProgramSearchComponent,
        AccountSearchComponent,
        AccountGroupSearchComponent,
        InfestationLevelSearchComponent,
        ServiceTypeSearchComponent,
        GroupAccountNumberComponent,
        ServicePlanSearchComponent,
        InvoiceFeeSearchComponent,
        PostCodeSearchComponent,
        EmployeeSearchComponent,
        AccountHistoryDetailComponent,
        ContractSearchComponent,
        CountryCodeComponent,
        BranchSearchComponent,
        ContactTypeSearchComponent,
        PlanVisitSearchComponent,
        ProductCoverSearchComponent,
        APICodeSearchComponent,
        BCompanySearchComponent,
        PremiseSearchComponent,
        TaxCodeSearchComponent,
        LostBusinessDetailSearchComponent,
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
        PestNetOnLineLevelSearchComponent,
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
        InvoiceRunDateSelectPrint2Component,
        ClosedTemplateSearchComponent,
        AUPostcodeSearchComponent,
        AccountPremiseSearchComponent,
        AccountHistoryGridComponent,
        InvoiceGroupGridComponent,
        LostBusinessContactSearchComponent,
        ScreenNotReadyComponent,
        ProductSearchGridComponent,
        ProspectSearchComponent,
        PremiseLocationAllocationGridComponent,
        ServiceCoverDetailsComponent,
        ProductSearchGridComponent,
        ServiceSummaryDetailComponent,
        MarktSelectSearchComponent,
        PNOLPremiseSearchGridComponent,
        ProspectStatusSearchComponent,
        LostBusinessRequestSearchComponent,
        VisitTypeSearchComponent,
        ContactTypeDetailSearchComponent,
        ProductDetailSearchComponent,
        ContactTypeDetailSearchDropDownComponent,
        ExpenseCodeSearchDropDownComponent,
        ExpenseCodeSearchComponent,
        LostBusinessContactTypeLanguageSearchComponent,
        CallCentreReviewGridMultiComponent,
        CallCentreReviewGridMultiComponent,
        LostBusinessRequestOriginLanguageSearchComponent,
        LostBusinessContactOutcomeLanguageSearchComponent,
        ContactMediumLanguageSearchComponent,
        LostBusinessDetailLanguageSearchComponent,
        LostBusinessLanguageSearchComponent,
        SystemInvoiceCreditReasonSearchComponent,
        SystemInvoiceFormatLanguageSearchComponent,
        ContractTypeLanguageSearchComponent,
        ProductServiceGroupSearchComponent,
        ListGroupSearchComponent,
        InvoiceChargeTypeLanguageSearchComponent,
        ProductAttributeValuesSearchComponent,
        ProductSalesGroupSearchComponent,
        ComponentTypeLanguageSearchComponent,
        CustomerCategorySearchComponent,
        EmployeeGridComponent,
        SICSearchComponent,
        InvoiceCreditReasonLanguageSearchComponent,
        RMMCategoryLanguageSearchComponent,
        RoutingSearchComponent,
        SeasonalTemplateSearchComponent,
        LOSSearchComponent
    ],

    entryComponents: [
        BusinessSearchComponent,
        PaymentSearchComponent,
        InvoiceFrequencySearchComponent,
        InvoiceChargeSearchComponent,
        SalesAreaSearchComponent,
        ServicePlanSearchComponent,
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
        TaxCodeSearchComponent,
        InfestationLevelSearchComponent,
        BusinessOriginDetailLanguageSearchComponent,
        BranchServiceAreaSearchComponent,
        ProductCoverSearchComponent,
        InvoiceHeaderAddressComponent,
        AccountBusinessTypeSearchComponent,
        ICABSBAPICodeSearchComponent,
        ApiRateSearchComponent,
        ServiceTypeSearchComponent,
        ProductExpenseSearchComponent,
        ServiceCoverSearchComponent,
        LostBusinessDetailSearchComponent,
        TierSearchComponent,
        BusinessTierSearchComponent,
        PestNetOnLineLevelSearchComponent,
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
        InvoiceRunDateSelectPrint2Component,
        ClosedTemplateSearchComponent,
        AUPostcodeSearchComponent,
        AccountPremiseSearchComponent,
        AccountHistoryGridComponent,
        InvoiceGroupGridComponent,
        LostBusinessContactSearchComponent,
        ScreenNotReadyComponent,
        ProductSearchGridComponent,
        ProspectSearchComponent,
        PremiseLocationAllocationGridComponent,
        ServiceCoverDetailsComponent,
        ProductSearchGridComponent,
        MarktSelectSearchComponent,
        PNOLPremiseSearchGridComponent,
        ProspectStatusSearchComponent,
        LostBusinessRequestSearchComponent,
        VisitTypeSearchComponent,
        ContactTypeDetailSearchComponent,
        ProductDetailSearchComponent,
        ContactTypeDetailSearchDropDownComponent,
        ExpenseCodeSearchDropDownComponent,
        ExpenseCodeSearchComponent,
        CallCentreReviewGridMultiComponent,
        CallCentreReviewGridMultiComponent,
        LostBusinessRequestOriginLanguageSearchComponent,
        LostBusinessContactOutcomeLanguageSearchComponent,
        ContactMediumLanguageSearchComponent,
        SystemInvoiceCreditReasonSearchComponent,
        SystemInvoiceFormatLanguageSearchComponent,
        ProductServiceGroupSearchComponent,
        ListGroupSearchComponent,
        InvoiceChargeTypeLanguageSearchComponent,
        ProductAttributeValuesSearchComponent,
        ProductSalesGroupSearchComponent,
        ComponentTypeLanguageSearchComponent,
        EmployeeGridComponent,
        SICSearchComponent,
        InvoiceCreditReasonLanguageSearchComponent,
        SeasonalTemplateSearchComponent
    ]
})

export class InternalSearchModule {
    /*static forRoot(): ModuleWithProviders {
        return {
            ngModule: InternalSearchModule,
            providers: [
                RouteAwayGuardService, RouteAwayGlobals
            ]
        };
    }*/
}
