import { SePlanVisitMaintenanceComponent } from './maintenance/iCABSSePlanVisitMaintenance.component';
import { PlanVisitMaintenance2Component } from './maintenance/iCABSSePlanVisitMaintenance2.component';
import { ServicePlanDeliveryNoteGenerationComponent } from './maintenance/iCABSSeServicePlanDeliveryNoteGeneration.component';
import { CustomerContactMaintenanceCopyComponent } from './maintenance/iCABSCMCustomerContactMaintenanceCopy';
import { CustomerContactRootCauseEntryComponent } from './maintenance/iCABSCMCustomerContactRootCauseEntry';
import { SMSRedirectComponent } from './maintenance/iCABSCMSMSRedirect.component';
import { SCMCallOutMaintenanceComponent } from './maintenance/iCABSCMCallOutMaintenance.component';
import { ContactPersonMaintenanceComponent } from './maintenance/ContactPersonMaintenance/iCABSCMContactPersonMaintenance';
import { ContactPersonTypeAComponent } from './maintenance/ContactPersonMaintenance/tabs/contactPerson-type-a';
import { ContactPersonTypeBComponent } from './maintenance/ContactPersonMaintenance/tabs/contactPerson-type-b';
import { ContactPersonTypeCComponent } from './maintenance/ContactPersonMaintenance/tabs/contactPerson-type-c';
import { TelesalesEntryComponent } from './maintenance/TeleSales/iCABSCMTelesalesEntry.component';
import { CMProspectMaintenanceComponent } from './maintenance/iCABSCMProspectMaintenance';
import { CMEmployeeViewBranchDetailsComponent } from './maintenance/iCABSCMEmployeeViewBranchDetails.component';
import { CustomerContactEmployeeViewComponent } from './maintenance/iCABSCMCustomerContactEmployeeView.component';
import { CMNatAxJobServiceCoverMaintenanceComponent } from './maintenance/iCABSCMNatAxJobServiceCoverMaintenance.component';
import { RateMaintenanceComponent } from './maintenance/iCABSBAPIRateMaintenance.component';
import { JobServiceDetailGroupMaintenanceMaintenanceComponent } from './maintenance/iCABSCMNatAxJobServiceDetailGroupMaintenance.component';
import { DiaryEntryComponent } from './maintenance/iCABSADiaryEntry.component';
import { ServiceVisitMaintenanceComponent } from './maintenance/iCABSSeServiceVisitMaintenance/iCABSSeServiceVisitMaintenance.component';
import { ServiceAreaSequenceMaintenanceComponent } from './maintenance/iCABSSeServiceAreaSequenceMaintenance.component';
import { ServicePlanCancelComponent } from './maintenance/iCABSSeServicePlanCancel.component';
import { InfestationMaintenanceComponent } from './maintenance/iCABSSeInfestationMaintenance.component';
import { CampaignEntryComponent } from './maintenance/iCABSCMCampaignEntry';
import { CreditServiceVisitGroupMaintenanceComponent } from './maintenance/iCABSSeCreditServiceVisitGroupMaintenance.component';
import { DataChangeMaintenanceComponent } from './maintenance/iCABSSeDataChangeMaintenance.component';
import { SeServiceValueMaintenanceComponent } from './maintenance/iCABSSeServiceValueMaintenance.component';
import { ServicePlanningEmployeeTimeMaintenanceHgComponent } from './maintenance/iCABSSeServicePlanningEmployeeTimeMaintenanceHg.component';
import { LinkedProductsMaintenanceComponent } from './maintenance/iCABSALinkedProductsMaintenance.component';
import { RouteAwayGuardService } from '../../shared/services/route-away-guard.service';
import { BranchHolidayMaintenanceComponent } from './maintenance/iCABSBBranchHolidayMaintenance.component';
import { PDAInfestationMaintenanceComponent } from './maintenance/iCABSSePDAiCABSInfestationMaintenance.component';
import { WorkOrderMaintenanceComponent } from './maintenance/iCABSCMWorkOrderMaintenance.component';
import { WorkListConfirmSubmitComponent } from './maintenance/iCABSWorkListConfirmSubmit.component';
import { InternalMaintenanceServiceModuleRoutesConstant } from '../base/PageRoutes';
import { ServicePlanDescMaintenanceComponent } from './maintenance/iCABSSeServicePlanDescMaintenance.component';
import { InternalSearchModule } from './search.module';
import { SharedModule } from './../../shared/shared.module';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { Component, ViewChild, ViewContainerRef, NgModule } from '@angular/core';
import { ComponentsHelper } from 'ng2-bootstrap/ng2-bootstrap';

@Component({
    template: `<router-outlet></router-outlet>
    <icabs-modal #errorModal="child" [(showHeader)]="showErrorHeader" [config]="{backdrop: 'static'}"></icabs-modal>`
})

export class InternalMaintenanceServiceComponent {
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
                path: '', component: InternalMaintenanceServiceComponent, children: [
                    { path: InternalMaintenanceServiceModuleRoutesConstant.ICABSBBRANCHHOLIDAYMAINTENANCE, component: BranchHolidayMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: InternalMaintenanceServiceModuleRoutesConstant.ICABSALINKEDPRODUCTSMAINTENANCE, component: LinkedProductsMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: InternalMaintenanceServiceModuleRoutesConstant.ICABSSESERVICEPLANNINGEMPLOYEETIMEMAINTENANCEHG, component: ServicePlanningEmployeeTimeMaintenanceHgComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: InternalMaintenanceServiceModuleRoutesConstant.ICABSSEDATACHANGEMAINTENANCE, component: DataChangeMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: InternalMaintenanceServiceModuleRoutesConstant.ICABSSEPDAICABSINFESTATIONMAINTENANCE, component: PDAInfestationMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: InternalMaintenanceServiceModuleRoutesConstant.ICABSSEINFESTATIONMAINTENANCE, component: InfestationMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: InternalMaintenanceServiceModuleRoutesConstant.ICABSSESERVICEPLANCANCEL, component: ServicePlanCancelComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: InternalMaintenanceServiceModuleRoutesConstant.ICABSSESERVICEAREASEQUENCEMAINTENANCE, component: ServiceAreaSequenceMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: InternalMaintenanceServiceModuleRoutesConstant.ICABSSESERVICEVISITMAINTENANCE, component: ServiceVisitMaintenanceComponent },
                    { path: InternalMaintenanceServiceModuleRoutesConstant.ICABSADIARYENTRY, component: DiaryEntryComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: InternalMaintenanceServiceModuleRoutesConstant.ICABSCMNATAXJOBSERVICEDETAILGROUPMAINTENANCE, component: JobServiceDetailGroupMaintenanceMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: InternalMaintenanceServiceModuleRoutesConstant.ICABSBAPIRATEMAINTENANCE, component: RateMaintenanceComponent },
                    { path: InternalMaintenanceServiceModuleRoutesConstant.ICABSCMNATAXJOBSERVICECOVERMAINTENANCE, component: CMNatAxJobServiceCoverMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: InternalMaintenanceServiceModuleRoutesConstant.ICABSCMCUSTOMERCONTACTEMPLOYEEVIEW, component: CustomerContactEmployeeViewComponent },
                    { path: InternalMaintenanceServiceModuleRoutesConstant.ICABSCMEMPLOYEEVIEWBRANCHDETAILS, component: CMEmployeeViewBranchDetailsComponent },
                    { path: InternalMaintenanceServiceModuleRoutesConstant.ICABSCMPROSPECTMAINTENANCE, component: CMProspectMaintenanceComponent },
                    { path: InternalMaintenanceServiceModuleRoutesConstant.ICABSCMTELESALESENTRY, component: TelesalesEntryComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: InternalMaintenanceServiceModuleRoutesConstant.ICABSSECREDITSERVICEVISITGROUPMAINTENANCE, component: CreditServiceVisitGroupMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: InternalMaintenanceServiceModuleRoutesConstant.ICABSCMCONTACTPERSONMAINTENANCE, component: ContactPersonMaintenanceComponent },
                    { path: InternalMaintenanceServiceModuleRoutesConstant.ICABSCMCALLOUTMAINTENANCE, component: SCMCallOutMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: InternalMaintenanceServiceModuleRoutesConstant.ICABSCMSMSREDIRECT, component: SMSRedirectComponent },
                    { path: InternalMaintenanceServiceModuleRoutesConstant.ICABSCMCAMPAIGNENTRY, component: CampaignEntryComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: InternalMaintenanceServiceModuleRoutesConstant.ICABSSEPLANVISITMAINTENANCE, component: SePlanVisitMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: InternalMaintenanceServiceModuleRoutesConstant.ICABSSEPLANVISITMAINTENANCE2, component: PlanVisitMaintenance2Component },
                    { path: InternalMaintenanceServiceModuleRoutesConstant.ICABSCMCUSTOMERCONTACTROOTCAUSEENTRY, component: CustomerContactRootCauseEntryComponent },
                    { path: InternalMaintenanceServiceModuleRoutesConstant.ICABSSESERVICEVALUEMAINTENANCE, component: SeServiceValueMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: InternalMaintenanceServiceModuleRoutesConstant.ICABSCMCUSTOMERCONTACTMAINTENANCECOPY, component: CustomerContactMaintenanceCopyComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: InternalMaintenanceServiceModuleRoutesConstant.ICABSCMWORKORDERMAINTENANCE, component: WorkOrderMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: InternalMaintenanceServiceModuleRoutesConstant.ICABSCMWORKORDERMAINTENANCE + '/:wonumber', component: WorkOrderMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: InternalMaintenanceServiceModuleRoutesConstant.ICABSSESERVICEPLANDESCMAINTENANCE, component: ServicePlanDescMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: InternalMaintenanceServiceModuleRoutesConstant.ICABSWORKLISTCONFIRMSUBMIT, component: WorkListConfirmSubmitComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: InternalMaintenanceServiceModuleRoutesConstant.ICABSSESERVICEPLANDESCMAINTENANCE, component: ServicePlanDescMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: InternalMaintenanceServiceModuleRoutesConstant.ICABSSESERVICEPLANDELIVERYNOTEGENERATION, component: ServicePlanDeliveryNoteGenerationComponent }
                ]
            }
        ])
    ],

    declarations: [
        InternalMaintenanceServiceComponent,
        BranchHolidayMaintenanceComponent,
        LinkedProductsMaintenanceComponent,
        ServicePlanningEmployeeTimeMaintenanceHgComponent,
        DataChangeMaintenanceComponent,
        InfestationMaintenanceComponent,
        ServicePlanCancelComponent,
        ServiceAreaSequenceMaintenanceComponent,
        ServiceVisitMaintenanceComponent,
        DiaryEntryComponent,
        JobServiceDetailGroupMaintenanceMaintenanceComponent,
        RateMaintenanceComponent,
        CMNatAxJobServiceCoverMaintenanceComponent,
        CustomerContactEmployeeViewComponent,
        PDAInfestationMaintenanceComponent,
        CMEmployeeViewBranchDetailsComponent,
        CMProspectMaintenanceComponent,
        TelesalesEntryComponent,
        CreditServiceVisitGroupMaintenanceComponent,
        SeServiceValueMaintenanceComponent,
        CampaignEntryComponent,
        ContactPersonMaintenanceComponent,
        SCMCallOutMaintenanceComponent,
        SMSRedirectComponent,
        CustomerContactRootCauseEntryComponent,
        CustomerContactMaintenanceCopyComponent,
        ServicePlanDeliveryNoteGenerationComponent,
        SePlanVisitMaintenanceComponent,
        PlanVisitMaintenance2Component,
        ContactPersonTypeAComponent,
        ContactPersonTypeBComponent,
        ContactPersonTypeCComponent,
        WorkOrderMaintenanceComponent,
        WorkListConfirmSubmitComponent,
        ServicePlanDescMaintenanceComponent,
        ContactPersonTypeCComponent
    ],
    exports: [
        ContactPersonTypeAComponent,
        ContactPersonTypeBComponent,
        ContactPersonTypeCComponent
    ],

    entryComponents: [
        DataChangeMaintenanceComponent,
        ServiceVisitMaintenanceComponent,
        RateMaintenanceComponent,
        CMNatAxJobServiceCoverMaintenanceComponent,
        CustomerContactEmployeeViewComponent,
        CMEmployeeViewBranchDetailsComponent,
        SeServiceValueMaintenanceComponent,
        CustomerContactRootCauseEntryComponent,
        CustomerContactMaintenanceCopyComponent,
        ServicePlanDeliveryNoteGenerationComponent,
        ContactPersonTypeAComponent,
        ContactPersonTypeBComponent,
        ServicePlanDescMaintenanceComponent,
        ContactPersonTypeCComponent
    ]
})

/*export class InternalMaintenanceModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: InternalMaintenanceModule,
            providers: [
                RouteAwayGuardService, RouteAwayGlobals
            ]
        };
    }
}*/

export class InternalMaintenanceServiceModule { }
