import { GridTestComponent } from './grid-search/Grid/gridTest.component';
import { PremisePostcodeRezoneGridComponent } from './grid-search/iCABSBPremisePostcodeRezoneGrid.component';
import { InternalGridSearchModuleRoutes } from '../base/PageRoutes';
import { PNOLLevelHistoryComponent } from './grid-search/iCABSAPNOLLevelHistory.component';
import { PipelineQuoteGridComponent } from './grid-search/iCABSSPipelineQuoteGrid.component';
import { ServiceCoverSeasonGridComponent } from './grid-search/iCABSAServiceCoverSeasonGrid';
import { NgModule, Component, ViewContainerRef, ViewChild } from '@angular/core';
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
import { InfestationToleranceGridComponent } from './grid-search/iCABSSInfestationToleranceGrid';
import { AccountAddressChangeHistoryComponent } from './grid-search/iCABSAAccountAddressChangeHistoryGrid';
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
import { ICABSAServiceVisitDisplayGridComponent } from './grid-search/iCABSAServiceVisitDisplayGrid.component';
import { ServiceCoverCalendarDateComponent } from './grid-search/iCABSAServiceCoverCalendarDateGrid.component';
import { SalesAreaPostCodeComponent } from './grid-search/iCABSBSalesAreaPostCodeGrid.component';
import { ServiceCoverComponent } from './grid-search/iCABSSSOServiceCoverGrid.component';
import { RouteAwayGuardService } from '../../shared/services/route-away-guard.service';
import { RelatedVisitGridComponent } from './grid-search/iCABSARelatedVisitGrid.component';
import { SummaryWorkloadRezoneMoveGridComponent } from './grid-search/iCABSSeSummaryWorkloadRezoneMoveGrid';
import { SOPremiseGridComponent } from './grid-search/iCABSSSOPremiseGrid';
import { QuoteGridComponent } from './grid-search/iCABSSSOQuoteGrid';
import { PremiseAccessTimesGridComponent } from './grid-search/iCABSPremiseAccessTimesGrid';
import { EmptyPremiseLocationSearchGridComponent } from './grid-search/iCABSAEmptyPremiseLocationSearchGrid';
import { DLHistoryGridComponent } from './grid-search/iCABSSdlHistoryGrid';
import { DiaryYearGridComponent } from './grid-search/iCABSADiaryYearGrid.component';
import { AnniversaryGenerateComponent } from './grid-search/iCABSAnniversaryGenerate';
import { ServiceCoverDetailLocationEntryGridComponent } from './grid-search/iCABSAServiceCoverDetailLocationEntryGrid';
import { ContractApprovalGridComponent } from './grid-search/iCABSSdlContractApprovalGrid.component';
import { ServiceCoverDisplayGridComponent } from './grid-search/iCABSAServiceCoverDisplayGrid.component';
import { ServiceCoverDisplayEntryComponent } from './grid-search/iCABSAServiceCoverDisplayEntry';
import { InvoiceHeaderGridComponent } from './grid-search/iCABSAInvoiceHeaderGrid';
import { ListGroupSearchComponent } from './grid-search/iCABSBListGroupSearch.component';
import { CreditApprovalGridComponent } from './grid-search/iCABSACreditApprovalGrid.component';
import { ServiceCoverWasteGridComponent } from './grid-search/iCABSAServiceCoverWasteGrid.component';
export var InternalGridSearchComponent = (function () {
    function InternalGridSearchComponent(viewContainerRef, componentsHelper) {
        this.showErrorHeader = true;
        componentsHelper.setRootViewContainerRef(viewContainerRef);
    }
    InternalGridSearchComponent.decorators = [
        { type: Component, args: [{
                    template: "<router-outlet></router-outlet>\n    <icabs-modal #errorModal=\"child\" [(showHeader)]=\"showErrorHeader\" [config]=\"{backdrop: 'static'}\"></icabs-modal>"
                },] },
    ];
    InternalGridSearchComponent.ctorParameters = [
        { type: ViewContainerRef, },
        { type: ComponentsHelper, },
    ];
    InternalGridSearchComponent.propDecorators = {
        'errorModal': [{ type: ViewChild, args: ['errorModal',] },],
    };
    return InternalGridSearchComponent;
}());
export var InternalGridSearchModule = (function () {
    function InternalGridSearchModule() {
    }
    InternalGridSearchModule.decorators = [
        { type: NgModule, args: [{
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
                                    { path: 'contractmanagement/account/recommendationGrid', component: RecommendationGridComponent },
                                    { path: 'application/service/staticVisitGridDay', component: StaticVisitGridDayComponent },
                                    { path: 'application/service/StaticVisitGridYear', component: StaticVisitGridYearComponent },
                                    { path: 'contractmanagement/account/infestationToleranceGrid', component: InfestationToleranceGridComponent },
                                    { path: 'application/contract/planVisitGridYear', component: PlanVisitGridYearComponent },
                                    { path: 'application/contract/planVisitGridDay', component: PlanVisitGridDayComponent },
                                    { path: 'application/productSalesSCDetailsMaintenance', component: ProductSalesSCDetailMntComponent },
                                    { path: 'application/premiseServiceSummary', component: PremiseServiceSummaryComponent },
                                    { path: 'application/ServiceVisitDisplay', component: ICABSAServiceVisitDisplayGridComponent },
                                    { path: InternalGridSearchModuleRoutes.ICABSASERVICECOVERCALENDARDATEGRID, component: ServiceCoverCalendarDateComponent, canDeactivate: [RouteAwayGuardService] },
                                    { path: 'application/SalesAreaPostCode', component: SalesAreaPostCodeComponent },
                                    { path: 'Sales/SOServiceCoverGrid', component: ServiceCoverComponent },
                                    { path: 'contactmanagement/customercontactHistorygrid', component: CustomerContactHistoryGridComponent },
                                    { path: 'application/relatedVisitGrid', component: RelatedVisitGridComponent },
                                    { path: 'application/summaryWorkloadrezoneMoveGrid', component: SummaryWorkloadRezoneMoveGridComponent },
                                    { path: 'application/PremiseAccessTimesGrid', component: PremiseAccessTimesGridComponent },
                                    { path: 'application/EmptyPremiseLocationSearchGrid', component: EmptyPremiseLocationSearchGridComponent },
                                    { path: 'application/DLHistoryGridComponent', component: DLHistoryGridComponent },
                                    { path: 'application/SOPremiseGrid', component: SOPremiseGridComponent },
                                    { path: 'application/AnniversaryGenerate', component: AnniversaryGenerateComponent },
                                    { path: 'sales/QuoteGrid', component: QuoteGridComponent },
                                    { path: 'application/DairyYearGridGridComponent', component: DiaryYearGridComponent },
                                    { path: 'maintenance/contract/customerinformation', component: CustomerInformationSummaryComponent },
                                    { path: 'contractmanagement/maintenance/contract/customerinformation', component: CustomerInformationSummaryComponent },
                                    { path: 'application/servicedisplayentry', component: ServiceCoverDisplayEntryComponent, canDeactivate: [RouteAwayGuardService] },
                                    { path: 'sales/QuoteGrid', component: QuoteGridComponent },
                                    { path: 'application/ServiceCoverDetailLocationEntryGridComponent', component: ServiceCoverDetailLocationEntryGridComponent },
                                    { path: 'sales/PipelineQuoteGrid', component: PipelineQuoteGridComponent },
                                    { path: InternalGridSearchModuleRoutes.ICABSSDLCONTRACTAPPROVALGRID, component: ContractApprovalGridComponent },
                                    { path: InternalGridSearchModuleRoutes.ICABSAINVOICEHEADERGRID, component: InvoiceHeaderGridComponent },
                                    { path: 'application/premisePostcodeRezoneGrid', component: PremisePostcodeRezoneGridComponent },
                                    { path: InternalGridSearchModuleRoutes.ICABSASERVICECOVERSEASONGRID, component: ServiceCoverSeasonGridComponent },
                                    { path: InternalGridSearchModuleRoutes.ICABSAPNOLLEVELHISTORY, component: PNOLLevelHistoryComponent },
                                    { path: 'contractmanagement/account/contractservicesummary', component: ContractServiceSummaryComponent },
                                    { path: 'contractmanagement/account/serviceValue', component: ServiceValueGridComponent },
                                    { path: 'contractmanagement/account/addressChangeHistory', component: AccountAddressChangeHistoryComponent },
                                    { path: 'contractmanagement/maintenance/contract/visitsummary', component: ServiceVisitSummaryComponent },
                                    { path: 'application/ListGroupSearch', component: ListGroupSearchComponent },
                                    { path: 'application/creditApprovalGrid', component: CreditApprovalGridComponent },
                                    { path: InternalGridSearchModuleRoutes.ICABSASERVICECOVERWASTEGRID, component: ServiceCoverWasteGridComponent },
                                    { path: InternalGridSearchModuleRoutes.ICABSSASERVICECOVERDISPLAYGRID, component: ServiceCoverDisplayGridComponent },
                                    { path: 'application/grid', component: GridTestComponent }
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
                        ICABSAServiceVisitDisplayGridComponent,
                        ServiceCoverCalendarDateComponent,
                        SalesAreaPostCodeComponent,
                        ServiceCoverComponent,
                        CustomerContactHistoryGridComponent,
                        RelatedVisitGridComponent,
                        SummaryWorkloadRezoneMoveGridComponent,
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
                        ContractApprovalGridComponent,
                        InvoiceHeaderGridComponent,
                        PremisePostcodeRezoneGridComponent,
                        ServiceCoverSeasonGridComponent,
                        PNOLLevelHistoryComponent,
                        ListGroupSearchComponent,
                        CreditApprovalGridComponent,
                        ServiceCoverWasteGridComponent,
                        ServiceCoverDisplayGridComponent,
                        GridTestComponent
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
                        ICABSAServiceVisitDisplayGridComponent,
                        ServiceCoverCalendarDateComponent,
                        SalesAreaPostCodeComponent,
                        ServiceCoverComponent,
                        CustomerContactHistoryGridComponent,
                        SummaryWorkloadRezoneMoveGridComponent,
                        QuoteGridComponent,
                        DLHistoryGridComponent,
                        DiaryYearGridComponent,
                        PremiseAccessTimesGridComponent,
                        EmptyPremiseLocationSearchGridComponent,
                        DLHistoryGridComponent,
                        AnniversaryGenerateComponent,
                        ContractApprovalGridComponent,
                        PremisePostcodeRezoneGridComponent,
                        PNOLLevelHistoryComponent,
                        ListGroupSearchComponent,
                        CreditApprovalGridComponent,
                        ServiceCoverWasteGridComponent,
                        ServiceCoverDisplayGridComponent
                    ]
                },] },
    ];
    InternalGridSearchModule.ctorParameters = [];
    return InternalGridSearchModule;
}());
