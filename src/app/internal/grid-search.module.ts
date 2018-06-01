/*import { WorkOrderGridComponent } from './grid-search/iCABSCMWorkOrderGrid';
import { ServiceCoverClosedDateGridComponent } from './grid-search/iCABSAServiceCoverClosedDateGrid.component';
import { SOProspectGridComponent } from './grid-search/iCABSSSOProspectGrid';
import { PNOLPremiseSearchGridComponent } from './grid-search/iCABSAPNOLPremiseSearchGrid.component';
import { TeleSalesOrderLineGridComponent } from './grid-search/iCABSATeleSalesOrderLineGrid.component';
import { PremisePostcodeRezoneGridComponent } from './grid-search/iCABSBPremisePostcodeRezoneGrid.component';
import { InternalGridSearchModuleRoutes } from '../base/PageRoutes';
import { PNOLLevelHistoryComponent } from './grid-search/iCABSAPNOLLevelHistory.component';
import { PipelineQuoteGridComponent } from './grid-search/iCABSSPipelineQuoteGrid.component';
import { ServiceCoverSeasonGridComponent } from './grid-search/iCABSAServiceCoverSeasonGrid';
import { NgModule, ModuleWithProviders, Component, ViewContainerRef, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { HttpModule } from '@angular/http';
import { InternalSearchModule } from './search.module';
import { ComponentsHelper } from 'ng2-bootstrap/ng2-bootstrap';
import { CustomerContactHistoryGridComponent } from './grid-search/iCABSCMCustomerContactHistoryGrid';
import { ProductSalesSCDetailMntComponent } from './grid-search/iCABSAProductSalesSCDetailMaintenance/iCABSAProductSalesSCDetailMaintenance.component';
import { PremiseServiceSummaryComponent } from './grid-search/iCABSAPremiseServiceSummary.component';
import { StaticVisitGridYearComponent } from './grid-search/iCABSAStaticVisitGridYear/iCABSAStaticVisitGridYear.component';
import { PlanVisitGridDayComponent } from './grid-search/iCABSAPlanVisitGridDay';
import { PlanVisitGridYearComponent } from './grid-search/iCABSAPlanVisitGridYear';
import { ContractHistoryGridComponent } from './grid-search/iCABSAContractHistoryGrid';
import { PlanVisitTabularComponent } from './grid-search/iCABSAPlanVisitTabular';
import { ServiceValueGridComponent } from './grid-search/iCABSAServiceValueGrid';
import { CustomerSignatureDetailComponent } from './grid-search/iCABSSeCustomerSignatureDetail.component';
import { InfestationToleranceGridComponent } from './grid-search/iCABSSInfestationToleranceGrid';
import { AccountAddressChangeHistoryComponent } from './grid-search/iCABSAAccountAddressChangeHistoryGrid';
import { InvoiceGroupAddressAmendmentGridComponent } from './grid-search/iCABSAInvoiceGroupAddressAmendmentGrid.component';
import { ProRateChargeSearchComponent } from './grid-search/iCABSAProRataChargeSummary.component';
import { RecommendationGridComponent } from './grid-search/iCABSARecommendationGrid.component';
import { VisitToleranceGridComponent } from './grid-search/iCABSSVisitToleranceGrid.component';
import { CustomerInformationSummaryComponent } from './grid-search/iCABSACustomerInformationSummary.component';
import { PremiseSearchGridComponent } from './grid-search/iCABSAPremiseSearchGrid';
import { ContractServiceSummaryComponent } from './grid-search/iCABSAContractServiceSummary/iCABSAContractServiceSummary';
import { ApplyAPIContractGridComponent } from './grid-search/iCABSAApplyAPIContractGrid.component';
import { SCMProspectConvGridComponent } from './grid-search/iCABSCMProspectConvGrid.component';
import { ProductSalesSCEntryGridComponent } from './grid-search/iCABSAProductSalesSCEntryGrid.component';
import { StaticVisitGridDayComponent } from './grid-search/iCABSAStaticVisitGridDay.component';
import { ServiceVisitSummaryComponent } from './grid-search/iCABSAServiceVisitSummary';
import { ServiceCoverCalendarDateComponent } from './grid-search/iCABSAServiceCoverCalendarDateGrid.component';
import { SalesAreaPostCodeComponent } from './grid-search/iCABSBSalesAreaPostCodeGrid.component';
import { ServiceCoverComponent } from './grid-search/iCABSSSOServiceCoverGrid.component';
import { RouteAwayGuardService } from '../../shared/services/route-away-guard.service';
import { RouteAwayGlobals } from '../../shared/services/route-away-global.service';
import { RelatedVisitGridComponent } from './grid-search/iCABSARelatedVisitGrid.component';
import { SOPremiseGridComponent } from './grid-search/iCABSSSOPremiseGrid';
import { QuoteGridComponent } from './grid-search/iCABSSSOQuoteGrid';
import { PremiseAccessTimesGridComponent } from './grid-search/iCABSPremiseAccessTimesGrid';
import { EmptyPremiseLocationSearchGridComponent } from './grid-search/iCABSAEmptyPremiseLocationSearchGrid';
import { DLHistoryGridComponent } from './grid-search/iCABSSdlHistoryGrid';
import { DiaryYearGridComponent } from './grid-search/iCABSADiaryYearGrid.component';
import { AnniversaryGenerateComponent } from './grid-search/iCABSAnniversaryGenerate';
import { ServiceCoverDetailLocationEntryGridComponent } from './grid-search/iCABSAServiceCoverDetailLocationEntryGrid';
import { BranchHolidayGridComponent } from './grid-search/iCABSBBranchHolidayGrid.component';
import { SeHCANewLocationGridComponent } from './grid-search/iCABSSeHCANewLocationGrid.component';
import { ServiceCoverDisplayGridComponent } from './grid-search/iCABSAServiceCoverDisplayGrid.component';
import { PipelineServiceCoverGridComponent } from './grid-search/iCABSSPipelineServiceCoverGrid.component';
import { CallAnalysisTicketGridComponent } from './grid-search/iCABSCMCallAnalysisTicketGrid.component';
import { PipelinePremiseGridComponent } from './grid-search/iCABSSPipelinePremiseGrid.component';
import { SeasonalTemplateDetailGridComponent } from './grid-search/iCABSASeasonalTemplateDetailGrid.component';
import { LeadGridComponent } from './grid-search/iCABSCMHCALeadGrid';
import { CallCentreSearchEmployeeGridComponent } from './grid-search/iCABSCMCallCentreSearchEmployeeGrid.component';

import { ServiceCoverDisplayEntryComponent } from './grid-search/iCABSAServiceCoverDisplayEntry';
import { InvoiceHeaderGridComponent } from './grid-search/iCABSAInvoiceHeaderGrid';
import { ListGroupSearchComponent } from './grid-search/iCABSBListGroupSearch.component';
import { CreditApprovalGridComponent } from './grid-search/iCABSACreditApprovalGrid.component';
import { ServiceCoverWasteGridComponent } from './grid-search/iCABSAServiceCoverWasteGrid.component';
import { LinkedPremiseSummaryGridComponent } from './grid-search/iCABSALinkedPremiseSummaryGrid.component';
import { CallCentreGridNotepadComponent } from './grid-search/iCABSCMCallCentreGridNotepad';
import { ClosedTemplateDateGridComponent } from './grid-search/iCABSAClosedTemplateDateGrid.component';
import { CallCentreGridEmployeeViewComponent } from './grid-search/iCABSCMCallCentreGridEmployeeView.component';
import { CalendarTemplateBranchAccessGridComponent } from './grid-search/iCABSACalendarTemplateBranchAccessGrid.component';
import { CMCustomerContactDetailGridComponent } from './grid-search/iCABSCMCustomerContactDetailGrid.component';
import { CalendarTemplateDateGridComponent } from './grid-search/iCABSACalendarTemplateDateGrid.component';
import { ClosedTemplateBranchAccessGridComponent } from './grid-search/iCABSAClosedTemplateBranchAccessGrid.component';
import { LinkedProductsGridComponent } from './grid-search/iCABSALinkedProductsGrid.component';
import { ContactTypeDetailAssigneeGridComponent } from './grid-search/iCABSSContactTypeDetailAssigneeGrid.component';
import { GeneralSearchInfoGridComponent } from './grid-search/iCABSCMGeneralSearchInfoGrid.component';
import { CallCentreGridCallLogDetailViewComponent } from './grid-search/iCABSCMCallCentreGridCallLogDetailView.component';
import { SummaryWorkloadRezoneMoveGridComponent } from './grid-search/iCABSSeSummaryWorkloadRezoneMoveGrid';
@Component({
    template: `<router-outlet></router-outlet>
    <icabs-modal #errorModal="child" [(showHeader)]="showErrorHeader" [config]="{backdrop: 'static'}"></icabs-modal>`
})

export class InternalGridSearchComponent {
    @ViewChild('errorModal') public errorModal;
    public showErrorHeader: boolean = true;
    constructor(viewContainerRef: ViewContainerRef, componentsHelper: ComponentsHelper) {
        componentsHelper.setRootViewContainerRef(viewContainerRef);
    }
}


@NgModule({
    imports: [
        HttpModule,
        SharedModule,
        InternalSearchModule,
        RouterModule.forChild([
            {
                path: '', component: InternalGridSearchComponent, children: [
                    { path: 'application/premise/search', component: PremiseSearchGridComponent },
                    { path: 'contractmanagement/maintenance/contract/premise', component: PremiseSearchGridComponent },
                    { path: 'application/applyapigrid', component: ApplyAPIContractGridComponent },
                    { path: 'application/prospectconvgrid', component: SCMProspectConvGridComponent },
                    { path: 'application/visittolerancegrid', component: VisitToleranceGridComponent },
                    { path: 'application/proRatacharge/summary', component: ProRateChargeSearchComponent },
                    { path: 'application/contract/history', component: ContractHistoryGridComponent },
                    { path: 'application/productSalesSCEntryGrid', component: ProductSalesSCEntryGridComponent },
                    { path: 'contractmanagement/maintenance/productSalesSCEntryGrid', component: ProductSalesSCEntryGridComponent },
                    { path: 'application/premise/planVisit', component: PlanVisitTabularComponent },
                    { path: 'application/service/recommendation', component: RecommendationGridComponent },
                    { path: InternalGridSearchModuleRoutes.ICABSSECUSTOMERSIGNATUREDETAIL, component: CustomerSignatureDetailComponent },
                    { path: 'contractmanagement/account/recommendationGrid', component: RecommendationGridComponent },
                    { path: 'application/service/staticVisitGridDay', component: StaticVisitGridDayComponent },
                    { path: 'application/service/StaticVisitGridYear', component: StaticVisitGridYearComponent },
                    { path: 'contractmanagement/account/infestationToleranceGrid', component: InfestationToleranceGridComponent },
                    { path: 'application/contract/planVisitGridYear', component: PlanVisitGridYearComponent },
                    { path: 'application/contract/planVisitGridDay', component: PlanVisitGridDayComponent },
                    { path: 'application/productSalesSCDetailsMaintenance', component: ProductSalesSCDetailMntComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: 'application/premiseServiceSummary', component: PremiseServiceSummaryComponent },
                    { path: InternalGridSearchModuleRoutes.ICABSASERVICECOVERCALENDARDATEGRID, component: ServiceCoverCalendarDateComponent },
                    { path: 'application/SalesAreaPostCode', component: SalesAreaPostCodeComponent },
                    { path: 'Sales/SOServiceCoverGrid', component: ServiceCoverComponent },
                    { path: 'contactmanagement/customercontactHistorygrid', component: CustomerContactHistoryGridComponent },
                    { path: 'application/relatedVisitGrid', component: RelatedVisitGridComponent },
                    { path: 'application/PremiseAccessTimesGrid', component: PremiseAccessTimesGridComponent },
                    { path: 'application/EmptyPremiseLocationSearchGrid', component: EmptyPremiseLocationSearchGridComponent },
                    { path: 'application/DLHistoryGridComponent', component: DLHistoryGridComponent },
                    { path: 'application/SOPremiseGrid', component: SOPremiseGridComponent },
                    { path: 'application/AnniversaryGenerate', component: AnniversaryGenerateComponent },
                    { path: 'sales/QuoteGrid', component: QuoteGridComponent },
                    { path: 'application/DairyYearGridGridComponent', component: DiaryYearGridComponent },
                    { path: InternalGridSearchModuleRoutes.ICABSACUSTOMERINFORMATIONSUMMARY, component: CustomerInformationSummaryComponent },
                    { path: 'contractmanagement/maintenance/contract/customerinformation', component: CustomerInformationSummaryComponent },
                    { path: 'application/servicedisplayentry', component: ServiceCoverDisplayEntryComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: 'sales/QuoteGrid', component: QuoteGridComponent },
                    { path: 'application/ServiceCoverDetailLocationEntryGridComponent', component: ServiceCoverDetailLocationEntryGridComponent },
                    { path: 'sales/PipelineQuoteGrid', component: PipelineQuoteGridComponent },
                    { path: InternalGridSearchModuleRoutes.ICABSAINVOICEHEADERGRID, component: InvoiceHeaderGridComponent },
                    { path: 'application/premisePostcodeRezoneGrid', component: PremisePostcodeRezoneGridComponent },
                    { path: InternalGridSearchModuleRoutes.ICABSASERVICECOVERSEASONGRID, component: ServiceCoverSeasonGridComponent },
                    { path: InternalGridSearchModuleRoutes.ICABSAPNOLLEVELHISTORY, component: PNOLLevelHistoryComponent },
                    { path: 'contractmanagement/account/contractservicesummary', component: ContractServiceSummaryComponent },
                    { path: 'contractmanagement/account/serviceValue', component: ServiceValueGridComponent },
                    { path: 'contractmanagement/account/addressChangeHistory', component: AccountAddressChangeHistoryComponent },
                    { path: InternalGridSearchModuleRoutes.ICABSAINVOICEGROUPADDRESSAMENDMENTGRID, component: InvoiceGroupAddressAmendmentGridComponent },
                    { path: 'contractmanagement/maintenance/contract/visitsummary', component: ServiceVisitSummaryComponent },
                    { path: 'application/ListGroupSearch', component: ListGroupSearchComponent },
                    { path: InternalGridSearchModuleRoutes.ICABSSPIPELINESERVICECOVERGRID, component: PipelineServiceCoverGridComponent },
                    { path: InternalGridSearchModuleRoutes.ICABSSPIPELINEPREMISEGRID, component: PipelinePremiseGridComponent },
                    { path: InternalGridSearchModuleRoutes.ICABSBDLREJECTIONSEARCH, component: PNOLPremiseSearchGridComponent },
                    { path: 'application/creditApprovalGrid', component: CreditApprovalGridComponent },
                    { path: InternalGridSearchModuleRoutes.ICABSASERVICECOVERWASTEGRID, component: ServiceCoverWasteGridComponent },
                    { path: 'application/CallAnalysisTicketGridComponent', component: CallAnalysisTicketGridComponent },
                    { path: InternalGridSearchModuleRoutes.ICABSALINKEDPREMISESUMMARYGRID, component: LinkedPremiseSummaryGridComponent },
                    { path: InternalGridSearchModuleRoutes.ICABSCMCALLCENTREGRIDNOTEPAD, component: CallCentreGridNotepadComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: InternalGridSearchModuleRoutes.ICABSATELESALESORDERLINEGRID, component: TeleSalesOrderLineGridComponent },
                    { path: InternalGridSearchModuleRoutes.ICABSCLOSEDTEMPLATEDATEGRID, component: ClosedTemplateDateGridComponent },
                    { path: InternalGridSearchModuleRoutes.ICABSCMCALLCENTERGRIDEMPLOYEEVIEW, component: CallCentreGridEmployeeViewComponent },
                    { path: InternalGridSearchModuleRoutes.ICABSACALENDARTEMPLATEBRANCHACCESSGRID, component: CalendarTemplateBranchAccessGridComponent },
                    { path: InternalGridSearchModuleRoutes.ICABSCMCUSTOMERCONTACTDETAILGRID, component: CMCustomerContactDetailGridComponent },
                    { path: InternalGridSearchModuleRoutes.ICABSCMHCALEADGRID, component: LeadGridComponent },
                    { path: InternalGridSearchModuleRoutes.BRANCHHOLIDAYGRID, component: BranchHolidayGridComponent },
                    { path: InternalGridSearchModuleRoutes.ICABSSEHCANEWLOCATIONGRID, component: SeHCANewLocationGridComponent },
                    { path: InternalGridSearchModuleRoutes.ICABSSASERVICECOVERDISPLAYGRID, component: ServiceCoverDisplayGridComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: InternalGridSearchModuleRoutes.ICABSSSOPROSPECTGRID, component: SOProspectGridComponent },
                    { path: InternalGridSearchModuleRoutes.ICABSASERVICECOVERCLOSEDDATEGRID, component: ServiceCoverClosedDateGridComponent },
                    { path: InternalGridSearchModuleRoutes.ICABSACALENDARTEMPLATEDATEGRID, component: CalendarTemplateDateGridComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: InternalGridSearchModuleRoutes.ICABSCMWORKORDERGRID, component: WorkOrderGridComponent },
                    { path: InternalGridSearchModuleRoutes.ICABSACLOSEDTEMPLATEBRANCHACCESSGRID, component: ClosedTemplateBranchAccessGridComponent },
                    { path: InternalGridSearchModuleRoutes.ICABSCMGENERALSEARCHINFOGRID, component: GeneralSearchInfoGridComponent },
                    { path: InternalGridSearchModuleRoutes.ICABSASEASONALTEMPLATEDETAILGRID, component: SeasonalTemplateDetailGridComponent },
                    { path: InternalGridSearchModuleRoutes.ICABSALINKEDPRODUCTSGRID, component: LinkedProductsGridComponent },
                    { path: InternalGridSearchModuleRoutes.ICABSCMCALLCENTREGRIDCALLLOGDETAILVIEW, component: CallCentreGridCallLogDetailViewComponent },
                    { path: InternalGridSearchModuleRoutes.ICABSSESUMMARYWORKLOADREZONEMOVEGRID , component: SummaryWorkloadRezoneMoveGridComponent , canDeactivate: [RouteAwayGuardService]},
                    { path: InternalGridSearchModuleRoutes.ICABSSESUMMARYWORKLOADREZONEMOVEGRIDDEST, component: SummaryWorkloadRezoneMoveGridComponent , canDeactivate: [RouteAwayGuardService]},
                    { path: InternalGridSearchModuleRoutes.ICABSCMCALLCENTRESEARCHEMPLOYEEGRID, component: CallCentreSearchEmployeeGridComponent },
                    { path: InternalGridSearchModuleRoutes.ICABSSCONTACTTYPEDETAILASSIGNEEGRID, component: ContactTypeDetailAssigneeGridComponent }

                ]
            }
        ])
    ],

    declarations: [
        InternalGridSearchComponent,
        ProRateChargeSearchComponent,
        RecommendationGridComponent,
        AccountAddressChangeHistoryComponent,
        InfestationToleranceGridComponent,
        ServiceValueGridComponent,
        CustomerInformationSummaryComponent,
        ContractServiceSummaryComponent,
        CustomerSignatureDetailComponent,
        VisitToleranceGridComponent,
        PremiseSearchGridComponent,
        ApplyAPIContractGridComponent,
        SCMProspectConvGridComponent,
        ServiceVisitSummaryComponent,
        ContractHistoryGridComponent,
        ProductSalesSCEntryGridComponent,
        PlanVisitTabularComponent,
        StaticVisitGridDayComponent,
        PlanVisitGridYearComponent,
        StaticVisitGridYearComponent,
        PlanVisitGridDayComponent,
        ProductSalesSCDetailMntComponent,
        PremiseServiceSummaryComponent,
        ServiceCoverCalendarDateComponent,
        SalesAreaPostCodeComponent,
        ServiceCoverComponent,
        CustomerContactHistoryGridComponent,
        RelatedVisitGridComponent,
        SOPremiseGridComponent,
        QuoteGridComponent,
        DLHistoryGridComponent,
        DiaryYearGridComponent,
        PremiseAccessTimesGridComponent,
        EmptyPremiseLocationSearchGridComponent,
        AnniversaryGenerateComponent,
        ServiceCoverDisplayEntryComponent,
        ServiceCoverDetailLocationEntryGridComponent,
        PipelineQuoteGridComponent,
        InvoiceHeaderGridComponent,
        PremisePostcodeRezoneGridComponent,
        ServiceCoverSeasonGridComponent,
        PNOLLevelHistoryComponent,
        ListGroupSearchComponent,
        CreditApprovalGridComponent,
        ServiceCoverWasteGridComponent,
        ServiceCoverDisplayGridComponent,
        TeleSalesOrderLineGridComponent,
        CallAnalysisTicketGridComponent,
        LinkedPremiseSummaryGridComponent,
        CallCentreGridNotepadComponent,
        InvoiceGroupAddressAmendmentGridComponent,
        ClosedTemplateDateGridComponent,
        PipelineServiceCoverGridComponent,
        PipelinePremiseGridComponent,
        BranchHolidayGridComponent,
        SeHCANewLocationGridComponent,
        CallCentreGridEmployeeViewComponent,
        CalendarTemplateBranchAccessGridComponent,
        CMCustomerContactDetailGridComponent,
        LeadGridComponent,
        SOProspectGridComponent,
        ServiceCoverClosedDateGridComponent,
        CalendarTemplateDateGridComponent,
        WorkOrderGridComponent,
        ClosedTemplateBranchAccessGridComponent,
        LinkedProductsGridComponent,
        GeneralSearchInfoGridComponent,
        SeasonalTemplateDetailGridComponent,
        CallCentreGridCallLogDetailViewComponent,
        SummaryWorkloadRezoneMoveGridComponent,
        CallCentreSearchEmployeeGridComponent,
        ContactTypeDetailAssigneeGridComponent
    ],

    entryComponents: [
        ProRateChargeSearchComponent,
        RecommendationGridComponent,
        AccountAddressChangeHistoryComponent,
        InfestationToleranceGridComponent,
        ServiceValueGridComponent,
        CustomerInformationSummaryComponent,
        ContractServiceSummaryComponent,
        VisitToleranceGridComponent,
        PremiseSearchGridComponent,
        ApplyAPIContractGridComponent,
        SCMProspectConvGridComponent,
        ServiceVisitSummaryComponent,
        ContractHistoryGridComponent,
        ProductSalesSCEntryGridComponent,
        PlanVisitTabularComponent,
        PlanVisitGridYearComponent,
        StaticVisitGridYearComponent,
        PlanVisitGridDayComponent,
        ProductSalesSCDetailMntComponent,
        ServiceCoverCalendarDateComponent,
        SalesAreaPostCodeComponent,
        ServiceCoverComponent,
        CustomerContactHistoryGridComponent,
        QuoteGridComponent,
        DLHistoryGridComponent,
        DiaryYearGridComponent,
        PremiseAccessTimesGridComponent,
        EmptyPremiseLocationSearchGridComponent,
        DLHistoryGridComponent,
        AnniversaryGenerateComponent,
        PremisePostcodeRezoneGridComponent,
        PNOLLevelHistoryComponent,
        ListGroupSearchComponent,
        CreditApprovalGridComponent,
        ServiceCoverWasteGridComponent,
        ServiceCoverDisplayGridComponent,
        LinkedPremiseSummaryGridComponent,
        CallCentreGridNotepadComponent,
        ClosedTemplateDateGridComponent,
        CalendarTemplateBranchAccessGridComponent,
        CMCustomerContactDetailGridComponent,
        ServiceCoverDisplayGridComponent,
        LeadGridComponent,
        SOProspectGridComponent,
        ServiceCoverClosedDateGridComponent,
        CalendarTemplateDateGridComponent,
        WorkOrderGridComponent,
        ClosedTemplateBranchAccessGridComponent,
        LinkedProductsGridComponent,
        GeneralSearchInfoGridComponent,
        SeasonalTemplateDetailGridComponent,
        CallCentreGridCallLogDetailViewComponent,
        CallCentreSearchEmployeeGridComponent
    ]
})

export class InternalGridSearchModule { }
*/
