import { PremiseSearchGridComponent } from './grid-search/iCABSAPremiseSearchGrid';
import { CustomerInformationSummaryComponent } from './grid-search/iCABSACustomerInformationSummary.component';
import { ProductSalesSCEntryGridComponent } from './grid-search/iCABSAProductSalesSCEntryGrid.component';
import { RecommendationGridComponent } from './grid-search/iCABSARecommendationGrid.component';
import { RouteAwayGuardService } from '../../shared/services/route-away-guard.service';
import { VisitToleranceGridComponent } from './grid-search/iCABSSVisitToleranceGrid.component';
import { InternalGridSearchServiceModuleRoutesConstant } from '../base/PageRoutes';
import { InternalSearchModule } from './search.module';
import { SharedModule } from './../../shared/shared.module';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { Component, ViewChild, ViewContainerRef, NgModule } from '@angular/core';
import { ComponentsHelper } from 'ng2-bootstrap/ng2-bootstrap';
import { SeHCANewLocationGridComponent } from './grid-search/iCABSSeHCANewLocationGrid.component';
import { SOProspectGridComponent } from './grid-search/iCABSSSOProspectGrid';
import { ClosedTemplateBranchAccessGridComponent } from './grid-search/iCABSAClosedTemplateBranchAccessGrid.component';
import { CustomerSignatureDetailComponent } from './grid-search/iCABSSeCustomerSignatureDetail.component';
import { AnniversaryGenerateComponent } from './grid-search/iCABSAnniversaryGenerate';
import { DiaryYearGridComponent } from './grid-search/iCABSADiaryYearGrid.component';
import { ServiceCoverDisplayEntryComponent } from './grid-search/iCABSAServiceCoverDisplayEntry';
import { ServiceCoverDetailLocationEntryGridComponent } from './grid-search/iCABSAServiceCoverDetailLocationEntryGrid';
import { PlanVisitTabularComponent } from './grid-search/iCABSAPlanVisitTabular';
import { BranchHolidayGridComponent } from './grid-search/iCABSBBranchHolidayGrid.component';
import { CalendarTemplateDateGridComponent } from './grid-search/iCABSACalendarTemplateDateGrid.component';
import { SeDebriefSummaryGridComponent } from './grid-search/iCABSSeDebriefSummaryGrid.component';
import { SeasonalTemplateDetailGridComponent } from './grid-search/iCABSASeasonalTemplateDetailGrid.component';
import { InfestationToleranceGridComponent } from './grid-search/iCABSSInfestationToleranceGrid';
import { CustomerContactHistoryGridComponent } from './grid-search/iCABSCMCustomerContactHistoryGrid';
import { ContractServiceSummaryComponent } from './grid-search/iCABSAContractServiceSummary/iCABSAContractServiceSummary';
import { ServiceValueGridComponent } from './grid-search/iCABSAServiceValueGrid';
import { AccountAddressChangeHistoryComponent } from './grid-search/iCABSAAccountAddressChangeHistoryGrid';
import { ServiceVisitSummaryComponent } from './grid-search/iCABSAServiceVisitSummary';
import { WorkOrderGridComponent } from './grid-search/iCABSCMWorkOrderGrid.component';
import { CMGeneralSearchInfoGridComponent } from './grid-search/iCABSCMGeneralSearchInfoGrid.component';
import { ContractProductSummaryComponent } from './grid-search/iCABSAContractProductSummary.component';
import { ServicePlanningGridComponent } from './grid-search/iCABSSeServicePlanningGrid.component';
import { ServiceWorkListGridComponent  } from './grid-search/iCABSSeServiceWorkListGrid.component';
import { ServiceActivityUpdateGridComponent } from './grid-search/iCABSSeServiceActivityUpdateGrid.component';
import { ServiceWorkListDateGridComponent } from './grid-search/iCABSSeServiceWorkListDateGrid.component';

@Component({
    template: `<router-outlet></router-outlet>
    <icabs-modal #errorModal="child" [(showHeader)]="showErrorHeader" [config]="{backdrop: 'static'}"></icabs-modal>`
})

export class InternalGridSearchServiceComponent {
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
                path: '', component: InternalGridSearchServiceComponent, children: [
                    { path: InternalGridSearchServiceModuleRoutesConstant.ICABSSVISITTOLERANCEGRID, component: VisitToleranceGridComponent },
                    { path: InternalGridSearchServiceModuleRoutesConstant.ICABSARECOMMENDATIONGRID.URL_1, component: RecommendationGridComponent },
                    { path: InternalGridSearchServiceModuleRoutesConstant.ICABSARECOMMENDATIONGRID.URL_2, component: RecommendationGridComponent },
                    { path: InternalGridSearchServiceModuleRoutesConstant.ICABSAPRODUCTSALESSCENTRYGRID.URL_1, component: ProductSalesSCEntryGridComponent },
                    { path: InternalGridSearchServiceModuleRoutesConstant.ICABSAPRODUCTSALESSCENTRYGRID.URL_2, component: ProductSalesSCEntryGridComponent },
                    { path: InternalGridSearchServiceModuleRoutesConstant.ICABSACUSTOMERINFORMATIONSUMMARY.URL_1, component: CustomerInformationSummaryComponent },
                    { path: InternalGridSearchServiceModuleRoutesConstant.ICABSACUSTOMERINFORMATIONSUMMARY.URL_2, component: CustomerInformationSummaryComponent },
                    { path: InternalGridSearchServiceModuleRoutesConstant.ICABSAPREMISESEARCHGRID.URL_1, component: PremiseSearchGridComponent },
                    { path: InternalGridSearchServiceModuleRoutesConstant.ICABSAPREMISESEARCHGRID.URL_2, component: PremiseSearchGridComponent },
                    { path: InternalGridSearchServiceModuleRoutesConstant.ICABSSEHCANEWLOCATIONGRID, component: SeHCANewLocationGridComponent },
                    { path: InternalGridSearchServiceModuleRoutesConstant.ICABSSSOPROSPECTGRID, component: SOProspectGridComponent },
                    { path: InternalGridSearchServiceModuleRoutesConstant.ICABSACLOSEDTEMPLATEBRANCHACCESSGRID, component: ClosedTemplateBranchAccessGridComponent },
                    { path: InternalGridSearchServiceModuleRoutesConstant.ICABSSECUSTOMERSIGNATUREDETAIL, component: CustomerSignatureDetailComponent },
                    { path: InternalGridSearchServiceModuleRoutesConstant.ICABSANNIVERSARYGENERATE, component: AnniversaryGenerateComponent },
                    { path: InternalGridSearchServiceModuleRoutesConstant.ICABSADIARYYEARGRID, component: DiaryYearGridComponent },
                    { path: InternalGridSearchServiceModuleRoutesConstant.ICABSASERVICECOVERDISPLAYENTRY, component: ServiceCoverDisplayEntryComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: InternalGridSearchServiceModuleRoutesConstant.ICABSASERVICECOVERDETAILLOCATIONENTRYGRID, component: ServiceCoverDetailLocationEntryGridComponent },
                    { path: InternalGridSearchServiceModuleRoutesConstant.ICABSAPLANVISITTABULAR, component: PlanVisitTabularComponent },
                    { path: InternalGridSearchServiceModuleRoutesConstant.ICABSBBRANCHHOLIDAYGRID, component: BranchHolidayGridComponent },
                    { path: InternalGridSearchServiceModuleRoutesConstant.ICABSACALENDARTEMPLATEDATEGRID, component: CalendarTemplateDateGridComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: InternalGridSearchServiceModuleRoutesConstant.ICABSASEASONALTEMPLATEDETAILGRID, component: SeasonalTemplateDetailGridComponent },
                    { path: InternalGridSearchServiceModuleRoutesConstant.ICABSSINFESTATIONTOLERANCEGRID, component: InfestationToleranceGridComponent },
                    { path: InternalGridSearchServiceModuleRoutesConstant.ICABSCMCUSTOMERCONTACTHISTORYGRID, component: CustomerContactHistoryGridComponent },
                    { path: InternalGridSearchServiceModuleRoutesConstant.ICABSACONTRACTSERVICESUMMARY, component: ContractServiceSummaryComponent },
                    { path: InternalGridSearchServiceModuleRoutesConstant.ICABSSEDEBRIEFSUMMARYGRID, component: SeDebriefSummaryGridComponent },
                    { path: InternalGridSearchServiceModuleRoutesConstant.ICABSASERVICEVALUEGRID, component: ServiceValueGridComponent },
                    { path: InternalGridSearchServiceModuleRoutesConstant.ICABSAACCOUNTADDRESSCHANGEHISTORYGRID, component: AccountAddressChangeHistoryComponent },
                    { path: InternalGridSearchServiceModuleRoutesConstant.ICABSASERVICEVISITSUMMARY, component: ServiceVisitSummaryComponent },
                    { path: InternalGridSearchServiceModuleRoutesConstant.ICABSCMWORKORDERGRID, component: WorkOrderGridComponent },
                    { path: InternalGridSearchServiceModuleRoutesConstant.ICABSCMGENERALSEARCHINFOGRID, component: CMGeneralSearchInfoGridComponent },
                    { path: InternalGridSearchServiceModuleRoutesConstant.ICABSACONTRACTPRODUCTSUMMARY, component: ContractProductSummaryComponent },
                    { path: InternalGridSearchServiceModuleRoutesConstant.ICABSSESERVICEPLANNINGGRID, component: ServicePlanningGridComponent },
                    { path: InternalGridSearchServiceModuleRoutesConstant.ICABSSESERVICEWORKLISTGRID,  component: ServiceWorkListGridComponent },
                    { path: InternalGridSearchServiceModuleRoutesConstant.ICABSSESERVICEACTIVITYUPDATEGRID, component: ServiceActivityUpdateGridComponent },
                    { path: InternalGridSearchServiceModuleRoutesConstant.ICABSSESERVICEWORKLISTDATEGRID, component: ServiceWorkListDateGridComponent }
                ]
            }
        ])
    ],

    declarations: [
        InternalGridSearchServiceComponent,
        VisitToleranceGridComponent,
        RecommendationGridComponent,
        ProductSalesSCEntryGridComponent,
        CustomerInformationSummaryComponent,
        PremiseSearchGridComponent,
        SeHCANewLocationGridComponent,
        SOProspectGridComponent,
        ClosedTemplateBranchAccessGridComponent,
        CustomerSignatureDetailComponent,
        AnniversaryGenerateComponent,
        DiaryYearGridComponent,
        ServiceCoverDisplayEntryComponent,
        ServiceCoverDetailLocationEntryGridComponent,
        PlanVisitTabularComponent,
        BranchHolidayGridComponent,
        CalendarTemplateDateGridComponent,
        SeasonalTemplateDetailGridComponent,
        InfestationToleranceGridComponent,
        CustomerContactHistoryGridComponent,
        ContractServiceSummaryComponent,
        SeDebriefSummaryGridComponent,
        ServiceValueGridComponent,
        AccountAddressChangeHistoryComponent,
        ServiceVisitSummaryComponent,
        WorkOrderGridComponent,
        CMGeneralSearchInfoGridComponent,
        ContractProductSummaryComponent,
        ServicePlanningGridComponent,
        ServiceWorkListGridComponent,
        ServiceActivityUpdateGridComponent,
        ServiceWorkListDateGridComponent
    ],

    entryComponents: [
        VisitToleranceGridComponent,
        RecommendationGridComponent,
        ProductSalesSCEntryGridComponent,
        CustomerInformationSummaryComponent,
        PremiseSearchGridComponent,
        ClosedTemplateBranchAccessGridComponent,
        AnniversaryGenerateComponent,
        DiaryYearGridComponent,
        PlanVisitTabularComponent,
        CalendarTemplateDateGridComponent,
        SeasonalTemplateDetailGridComponent,
        InfestationToleranceGridComponent,
        ContractServiceSummaryComponent,
        ServiceValueGridComponent,
        AccountAddressChangeHistoryComponent,
        ServiceVisitSummaryComponent,
        WorkOrderGridComponent,
        CMGeneralSearchInfoGridComponent,
        ServicePlanningGridComponent,
        ServiceWorkListGridComponent

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

export class InternalGridSearchServiceModule { }
