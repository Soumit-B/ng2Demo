import { RouteAwayGuardService } from '../../shared/services/route-away-guard.service';
import { InternalGridSearchSalesModuleRoutesConstant } from '../base/PageRoutes';
import { InternalSearchModule } from './search.module';
import { SharedModule } from './../../shared/shared.module';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { Component, ViewChild, ViewContainerRef, NgModule } from '@angular/core';
import { ComponentsHelper } from 'ng2-bootstrap/ng2-bootstrap';
import { SCMProspectConvGridComponent } from './grid-search/iCABSCMProspectConvGrid.component';
import { PipelineServiceCoverGridComponent } from './grid-search/iCABSSPipelineServiceCoverGrid.component';
import { PipelinePremiseGridComponent } from './grid-search/iCABSSPipelinePremiseGrid.component';
import { QuoteGridComponent } from './grid-search/iCABSSSOQuoteGrid';
import { ServiceCoverComponent } from './grid-search/iCABSSSOServiceCoverGrid.component';
import { PipelineQuoteGridComponent } from './grid-search/iCABSSPipelineQuoteGrid.component';
import { LinkedProductsGridComponent } from './grid-search/iCABSALinkedProductsGrid.component';
import { SOPremiseGridComponent } from './grid-search/iCABSSSOPremiseGrid';
import { DLHistoryGridComponent } from './grid-search/iCABSSdlHistoryGrid';
import { EmptyPremiseLocationSearchGridComponent } from './grid-search/iCABSAEmptyPremiseLocationSearchGrid';
import { StaticVisitGridDayComponent } from './grid-search/iCABSAStaticVisitGridDay.component';
import { StaticVisitGridYearComponent } from './grid-search/iCABSAStaticVisitGridYear/iCABSAStaticVisitGridYear.component';
import { ProRateChargeSearchComponent } from './grid-search/iCABSAProRataChargeSummary.component';
import { ContractHistoryGridComponent } from './grid-search/iCABSAContractHistoryGrid';
import { PlanVisitGridYearComponent } from './grid-search/iCABSAPlanVisitGridYear';
import { PlanVisitGridDayComponent } from './grid-search/iCABSAPlanVisitGridDay';
import { ProductSalesSCDetailMntComponent } from './grid-search/iCABSAProductSalesSCDetailMaintenance/iCABSAProductSalesSCDetailMaintenance.component';
import { PremiseServiceSummaryComponent } from './grid-search/iCABSAPremiseServiceSummary.component';
import { SalesAreaPostCodeComponent } from './grid-search/iCABSBSalesAreaPostCodeGrid.component';
import { RelatedVisitGridComponent } from './grid-search/iCABSARelatedVisitGrid.component';
import { PremiseAccessTimesGridComponent } from './grid-search/iCABSPremiseAccessTimesGrid';
import { ContactTypeDetailEscalateGridComponent } from './grid-search/iCABSSContactTypeDetailEscalateGrid.component';
import { SContactTypeDetailPropertiesGridComponent } from './grid-search/iCABSSContactTypeDetailPropertiesGrid.component';
import { SummaryWorkloadGridMonthBranchComponent } from './grid-search/iCABSSESummaryWorkloadGridMonthBranch.component';
import { ProRataChargeBranchGridComponent } from './grid-search/iCABSAProRataChargeBranchGrid.component';
import { InvoiceRangeUpdateGridComponent } from './grid-search/iCABSBInvoiceRangeUpdateGrid';
import { SalesStatisticsServiceValueGridComponent } from './grid-search/iCABSSSalesStatisticsServiceValueGrid.component';
import { ContractInvoiceTurnoverGridComponent } from './grid-search/iCABSAContractInvoiceTurnoverGrid.component';
import { ContractApprovalGridComponent } from './grid-search/iCABSSdlContractApprovalGrid.component';
import { ServicePatternGridComponent } from './grid-search/iCABSSeServicePatternGrid.component';

@Component({
    template: `<router-outlet></router-outlet>
    <icabs-modal #errorModal="child" [(showHeader)]="showErrorHeader" [config]="{backdrop: 'static'}"></icabs-modal>`
})

export class InternalGridSearchSalesComponent {
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
                path: '', component: InternalGridSearchSalesComponent, children: [
                    { path: InternalGridSearchSalesModuleRoutesConstant.ICABSCMPROSPECTCONVGRID, component: SCMProspectConvGridComponent },
                    { path: InternalGridSearchSalesModuleRoutesConstant.ICABSSPIPELINESERVICECOVERGRID, component: PipelineServiceCoverGridComponent },
                    { path: InternalGridSearchSalesModuleRoutesConstant.ICABSSPIPELINEPREMISEGRID, component: PipelinePremiseGridComponent },
                    { path: InternalGridSearchSalesModuleRoutesConstant.ICABSSSOQUOTEGRID, component: QuoteGridComponent },
                    { path: InternalGridSearchSalesModuleRoutesConstant.ICABSSSOSERVICECOVERGRID, component: ServiceCoverComponent },
                    { path: InternalGridSearchSalesModuleRoutesConstant.ICABSSPIPELINEQUOTEGRID, component: PipelineQuoteGridComponent },
                    { path: InternalGridSearchSalesModuleRoutesConstant.ICABSALINKEDPRODUCTSGRID, component: LinkedProductsGridComponent },
                    { path: InternalGridSearchSalesModuleRoutesConstant.ICABSSSOPREMISEGRID, component: SOPremiseGridComponent },
                    { path: InternalGridSearchSalesModuleRoutesConstant.ICABSSDLHISTORYGRID, component: DLHistoryGridComponent },
                    { path: InternalGridSearchSalesModuleRoutesConstant.ICABSAEMPTYPREMISELOCATIONSEARCHGRID, component: EmptyPremiseLocationSearchGridComponent },
                    { path: InternalGridSearchSalesModuleRoutesConstant.ICABSASTATICVISITGRIDDAY, component: StaticVisitGridDayComponent },
                    { path: InternalGridSearchSalesModuleRoutesConstant.ICABSASTATICVISITGRIDYEAR, component: StaticVisitGridYearComponent },
                    { path: InternalGridSearchSalesModuleRoutesConstant.ICABSAPRORATACHARGESUMMARY, component: ProRateChargeSearchComponent },
                    { path: InternalGridSearchSalesModuleRoutesConstant.ICABSACONTRACTHISTORYGRID, component: ContractHistoryGridComponent },
                    { path: InternalGridSearchSalesModuleRoutesConstant.ICABSAPLANVISITGRIDYEAR, component: PlanVisitGridYearComponent },
                    { path: InternalGridSearchSalesModuleRoutesConstant.ICABSAPLANVISITGRIDDAY, component: PlanVisitGridDayComponent },
                    { path: InternalGridSearchSalesModuleRoutesConstant.ICABSAPRODUCTSALESSCDETAILMAINTENANCE, component: ProductSalesSCDetailMntComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: InternalGridSearchSalesModuleRoutesConstant.ICABSAPREMISESERVICESUMMARY, component: PremiseServiceSummaryComponent },
                    { path: InternalGridSearchSalesModuleRoutesConstant.ICABSBSALESAREAPOSTCODEGRID, component: SalesAreaPostCodeComponent },
                    { path: InternalGridSearchSalesModuleRoutesConstant.ICABSARELATEDVISITGRID, component: RelatedVisitGridComponent },
                    { path: InternalGridSearchSalesModuleRoutesConstant.ICABSSCONTACTTYPEDETAILESCALATEGRID, component: ContactTypeDetailEscalateGridComponent },
                    { path: InternalGridSearchSalesModuleRoutesConstant.ICABSPREMISEACCESSTIMESGRID, component: PremiseAccessTimesGridComponent },
                    { path: InternalGridSearchSalesModuleRoutesConstant.ICABSSCONTACTTYPEDETAILPROPERTIESGRID, component: SContactTypeDetailPropertiesGridComponent },
                    { path: InternalGridSearchSalesModuleRoutesConstant.ICABSACONTRACTINVOICETURNOVERGRID, component: ContractInvoiceTurnoverGridComponent },
                    { path: InternalGridSearchSalesModuleRoutesConstant.ICABSSESUMMARYWORKLOADGRIDMONTHBRANCH, component: SummaryWorkloadGridMonthBranchComponent },
                    { path: InternalGridSearchSalesModuleRoutesConstant.ICABSAPRORATACHARGEBRANCHGRID, component: ProRataChargeBranchGridComponent },
                    { path: InternalGridSearchSalesModuleRoutesConstant.ICABSBINVOICERANGEUPDATEGRID, component: InvoiceRangeUpdateGridComponent },
                    { path: InternalGridSearchSalesModuleRoutesConstant.ICABSSSALESSTATISTICSSERVICEVALUEGRID.CONTRACT, component: SalesStatisticsServiceValueGridComponent },
                    { path: InternalGridSearchSalesModuleRoutesConstant.ICABSSSALESSTATISTICSSERVICEVALUEGRID.JOB, component: SalesStatisticsServiceValueGridComponent },
                    { path: InternalGridSearchSalesModuleRoutesConstant.ICABSSSALESSTATISTICSSERVICEVALUEGRID.PRODUCT, component: SalesStatisticsServiceValueGridComponent },
                    { path: InternalGridSearchSalesModuleRoutesConstant.ICABSBINVOICERANGEUPDATEGRID, component: InvoiceRangeUpdateGridComponent },
                    { path: InternalGridSearchSalesModuleRoutesConstant.ICABSSDLCONTRACTAPPROVALGRID, component: ContractApprovalGridComponent },
                    { path: InternalGridSearchSalesModuleRoutesConstant.ICABSSESERVICEPATTERNGRID, component: ServicePatternGridComponent }

                ]
            }
        ])
    ],

    declarations: [
        InternalGridSearchSalesComponent,
        SCMProspectConvGridComponent,
        PipelineServiceCoverGridComponent,
        PipelinePremiseGridComponent,
        QuoteGridComponent,
        ServiceCoverComponent,
        PipelineQuoteGridComponent,
        LinkedProductsGridComponent,
        SOPremiseGridComponent,
        DLHistoryGridComponent,
        EmptyPremiseLocationSearchGridComponent,
        StaticVisitGridDayComponent,
        StaticVisitGridYearComponent,
        ProRateChargeSearchComponent,
        ContractHistoryGridComponent,
        PlanVisitGridYearComponent,
        PlanVisitGridDayComponent,
        ProductSalesSCDetailMntComponent,
        PremiseServiceSummaryComponent,
        SalesAreaPostCodeComponent,
        RelatedVisitGridComponent,
        ContactTypeDetailEscalateGridComponent,
        PremiseAccessTimesGridComponent,
        SContactTypeDetailPropertiesGridComponent,
        ContractInvoiceTurnoverGridComponent,
        SummaryWorkloadGridMonthBranchComponent,
        ProRataChargeBranchGridComponent,
        InvoiceRangeUpdateGridComponent,
        SalesStatisticsServiceValueGridComponent,
        InvoiceRangeUpdateGridComponent,
        ContractApprovalGridComponent,
        ServicePatternGridComponent

    ],

    entryComponents: [
        SCMProspectConvGridComponent,
        QuoteGridComponent,
        ServiceCoverComponent,
        LinkedProductsGridComponent,
        DLHistoryGridComponent,
        EmptyPremiseLocationSearchGridComponent,
        StaticVisitGridYearComponent,
        ProRateChargeSearchComponent,
        ContractHistoryGridComponent,
        PlanVisitGridYearComponent,
        PlanVisitGridDayComponent,
        ProductSalesSCDetailMntComponent,
        SalesAreaPostCodeComponent,
        ContactTypeDetailEscalateGridComponent,
        PremiseAccessTimesGridComponent,
        SContactTypeDetailPropertiesGridComponent,
        ContractInvoiceTurnoverGridComponent,
        SummaryWorkloadGridMonthBranchComponent,
        InvoiceRangeUpdateGridComponent,
        SalesStatisticsServiceValueGridComponent,
        ContractApprovalGridComponent,
        ServicePatternGridComponent

    ]
})

/*export class InternalGridSearchModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: InternalGridSearchModule,
            providers: [
                RouteAwayGuardService, RouteAwayGlobals
            ]
        };
    }
}*/

export class InternalGridSearchSalesModule { }
