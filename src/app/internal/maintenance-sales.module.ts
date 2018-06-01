import { LostBusinessMaintenanceComponent } from './maintenance/iCABSBLostBusinessMaintenance.component';
import { ContactTypeDetailPCExcMaintComponent } from './maintenance/iCABSSContactTypeDetailPCExcMaint.component';
import { CMTelesalesEntryConfirmOrderComponent } from './maintenance/iCABSCMTelesalesEntryConfirmOrder.component';
import { ServiceCoverComponentReplacementComponent } from './maintenance/iCABSAServiceCoverComponentReplacement.component';
import { BatchProgramScheduleMaintenanceComponent } from './maintenance/riMBatchProgramScheduleMaintenance.component';
import { ExpenseCodeMaintenanceComponent } from './maintenance/iCABSBExpenseCodeMaintenance.component';
import { QuoteSubmitMaintenanceComponent } from './maintenance/iCABSSSOQuoteSubmitMaintenance';
import { VisitToleranceMaintenanceComponent } from './maintenance/iCABSSVisitToleranceMaintenance.component';
import { DlContractMaintenanceComponent } from './maintenance/iCABSSdlContractMaintenance';
import { SdlPremiseMaintenanceComponent } from './maintenance/iCABSSdlPremiseMaintenance.component';
import { QuoteStatusMaintenanceComponent } from './maintenance/iCABSSSOQuoteStatusMaintenance';
import { DlServiceCoverMaintenanceComponent } from './maintenance/iCABSSdlServiceCoverMaintenance';
import { InvoiceRunDateConfirmComponent } from './maintenance/iCABSBInvoiceRunDateConfirm';
import { InvoiceRangeMaintenanceComponent } from './maintenance/iCABSBInvoiceRangeMaintenance.component';
import { ProspectStatusChangeComponent } from './maintenance/iCABSSProspectStatusChange';
import { InvoiceRunDateMaintenanceComponent } from './maintenance/iCABSBInvoiceRunDateMaintenance';
import { InvoiceGroupPremiseMaintenanceComponent } from './maintenance/iCABSAInvoiceGroupPremiseMaintenance';
import { InvoicePrintLineComponent } from './maintenance/iCABSAInvoicePrintLineMaintenance.component';
import { InvoiceChargeMaintenanceComponent } from './maintenance/iCABSAInvoiceChargeMaintenance';
import { ServiceCoverCalendarDatesMaintenanceComponent } from './maintenance/iCABSAServiceCoverCalendarDatesMaintenance';
import { RenewalGenerateComponent } from './maintenance/iCABSRenewalGenerate';
import { ContractCommenceDateMaintenanceComponentExComponent } from './maintenance/iCABSAContractCommenceDateMaintenanceEx.component';
import { ContractCommenceDateMaintenanceComponent } from './maintenance/iCABSAContractCommenceDateMaintenance.component';
import { CustomerInfoMaintenanceComponent } from './maintenance/iCABSACustomerInfoMaintenance';
import { InvoiceNarrativeMaintenanceComponent } from './maintenance/iCABSAInvoiceNarrativeMaintenance/iCABSAInvoiceNarrativeMaintenance.component';
import { RouteAwayGuardService } from '../../shared/services/route-away-guard.service';
import { ProRataChargeMaintenanceComponent } from './maintenance/iCABSAProRataChargeMaintenance.component';
import { ContactTypeDetailLanglMaintenanceComponent } from './maintenance/iCABSSContactTypeDetailLangMaintenance.component';
import { InternalMaintenanceSalesModuleRoutesConstant } from '../base/PageRoutes';
import { InternalSearchModule } from './search.module';
import { SharedModule } from './../../shared/shared.module';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { Component, ViewChild, ViewContainerRef, NgModule } from '@angular/core';
import { ComponentsHelper } from 'ng2-bootstrap/ng2-bootstrap';
import { ContactTypeDetailPropertiesMaintComponent } from './maintenance/iCABSSContactTypeDetailPropertiesMaint.component';
import { ContractSuspendMaintenanceComponent } from './maintenance/iCABSAContractSuspendMaintenance.component';

@Component({
    template: `<router-outlet></router-outlet>
    <icabs-modal #errorModal="child" [(showHeader)]="showErrorHeader" [config]="{backdrop: 'static'}"></icabs-modal>`
})

export class InternalMaintenanceSalesComponent {
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
                path: '', component: InternalMaintenanceSalesComponent, children: [
                    { path: InternalMaintenanceSalesModuleRoutesConstant.ICABSAPRORATACHARGEMAINTENANCE, component: ProRataChargeMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: InternalMaintenanceSalesModuleRoutesConstant.ICABSAINVOICENARRATIVEMAINTENANCE, component: InvoiceNarrativeMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: InternalMaintenanceSalesModuleRoutesConstant.ICABSACUSTOMERINFOMAINTENANCE, component: CustomerInfoMaintenanceComponent },
                    { path: InternalMaintenanceSalesModuleRoutesConstant.ICABSACONTRACTCOMMENCEDATEMAINTENANCE, component: ContractCommenceDateMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: InternalMaintenanceSalesModuleRoutesConstant.ICABSACONTRACTCOMMENCEDATEMAINTENANCEEX, component: ContractCommenceDateMaintenanceComponentExComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: InternalMaintenanceSalesModuleRoutesConstant.ICABSRENEWALGENERATE, component: RenewalGenerateComponent },
                    { path: InternalMaintenanceSalesModuleRoutesConstant.ICABSASERVICECOVERCALENDARDATESMAINTENANCE, component: ServiceCoverCalendarDatesMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: InternalMaintenanceSalesModuleRoutesConstant.ICABSAINVOICECHARGEMAINTENANCE, component: InvoiceChargeMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: InternalMaintenanceSalesModuleRoutesConstant.ICABSAINVOICEPRINTLINEMAINTENANCE, component: InvoicePrintLineComponent },
                    { path: InternalMaintenanceSalesModuleRoutesConstant.ICABSAINVOICEGROUPPREMISEMAINTENANCE, component: InvoiceGroupPremiseMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: InternalMaintenanceSalesModuleRoutesConstant.ICABSBINVOICERUNDATEMAINTENANCE, component: InvoiceRunDateMaintenanceComponent },
                    { path: InternalMaintenanceSalesModuleRoutesConstant.ICABSSPROSPECTSTATUSCHANGE, component: ProspectStatusChangeComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: InternalMaintenanceSalesModuleRoutesConstant.ICABSBINVOICERANGEMAINTENANCE, component: InvoiceRangeMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: InternalMaintenanceSalesModuleRoutesConstant.ICABSBINVOICERUNDATECONFIRM, component: InvoiceRunDateConfirmComponent },
                    { path: InternalMaintenanceSalesModuleRoutesConstant.ICABSSDLSERVICECOVERMAINTENANCE, component: DlServiceCoverMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: InternalMaintenanceSalesModuleRoutesConstant.ICABSSSOQUOTESTATUSMAINTENANCE, component: QuoteStatusMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: InternalMaintenanceSalesModuleRoutesConstant.ICABSSDLPREMISEMAINTENANCE, component: SdlPremiseMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: InternalMaintenanceSalesModuleRoutesConstant.ICABSSDLCONTRACTMAINTENANCE, component: DlContractMaintenanceComponent },
                    { path: InternalMaintenanceSalesModuleRoutesConstant.ICABSSVISITTOLERANCEMAINTENANCE, component: VisitToleranceMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: InternalMaintenanceSalesModuleRoutesConstant.ICABSSSOQUOTESUBMITMAINTENANCE, component: QuoteSubmitMaintenanceComponent },
                    { path: InternalMaintenanceSalesModuleRoutesConstant.ICABSBEXPENSECODEMAINTENANCE, component: ExpenseCodeMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: InternalMaintenanceSalesModuleRoutesConstant.RIMBATCHPROGRAMSCHEDULEMAINTENANCE, component: BatchProgramScheduleMaintenanceComponent },
                    { path: InternalMaintenanceSalesModuleRoutesConstant.ICABSASERVICECOVERCOMPONENTREPLACEMENT, component: ServiceCoverComponentReplacementComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: InternalMaintenanceSalesModuleRoutesConstant.ICABSCMTELESALESENTRYCONFIRMORDER, component: CMTelesalesEntryConfirmOrderComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: InternalMaintenanceSalesModuleRoutesConstant.ICABSSCONTACTTYPEDETAILLANGMAINTENANCE, component: ContactTypeDetailLanglMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: InternalMaintenanceSalesModuleRoutesConstant.ICABSBLOSTBUSINESSMAINTENANCE, component: LostBusinessMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: InternalMaintenanceSalesModuleRoutesConstant.ICABSSCONTACTTYPEDETAILPCEXCMAINT, component: ContactTypeDetailPCExcMaintComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: InternalMaintenanceSalesModuleRoutesConstant.ICABSSCONTACTTYPEDETAILPROPERTIESMAINT, component: ContactTypeDetailPropertiesMaintComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: InternalMaintenanceSalesModuleRoutesConstant.ICABSACONTRACTSUSPENDMAINTENANCE.CONTRACT, component: ContractSuspendMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: InternalMaintenanceSalesModuleRoutesConstant.ICABSACONTRACTSUSPENDMAINTENANCE.JOB, component: ContractSuspendMaintenanceComponent, canDeactivate: [RouteAwayGuardService] }
                ]
            }
        ])
    ],

    declarations: [
        InternalMaintenanceSalesComponent,
        ProRataChargeMaintenanceComponent,
        InvoiceNarrativeMaintenanceComponent,
        CustomerInfoMaintenanceComponent,
        ContractCommenceDateMaintenanceComponent,
        ContractCommenceDateMaintenanceComponentExComponent,
        RenewalGenerateComponent,
        ServiceCoverCalendarDatesMaintenanceComponent,
        InvoiceChargeMaintenanceComponent,
        InvoicePrintLineComponent,
        InvoiceGroupPremiseMaintenanceComponent,
        InvoiceRunDateMaintenanceComponent,
        ProspectStatusChangeComponent,
        InvoiceRangeMaintenanceComponent,
        InvoiceRunDateConfirmComponent,
        DlServiceCoverMaintenanceComponent,
        QuoteStatusMaintenanceComponent,
        SdlPremiseMaintenanceComponent,
        DlContractMaintenanceComponent,
        VisitToleranceMaintenanceComponent,
        QuoteSubmitMaintenanceComponent,
        ExpenseCodeMaintenanceComponent,
        BatchProgramScheduleMaintenanceComponent,
        ServiceCoverComponentReplacementComponent,
        CMTelesalesEntryConfirmOrderComponent,
        ContactTypeDetailLanglMaintenanceComponent,
        LostBusinessMaintenanceComponent,
        ContactTypeDetailPCExcMaintComponent,
        ContactTypeDetailPropertiesMaintComponent,
        ContractSuspendMaintenanceComponent
    ],

    entryComponents: [
        InvoiceNarrativeMaintenanceComponent,
        CustomerInfoMaintenanceComponent,
        ContractCommenceDateMaintenanceComponent,
        ContractCommenceDateMaintenanceComponentExComponent,
        RenewalGenerateComponent,
        InvoiceChargeMaintenanceComponent,
        InvoiceGroupPremiseMaintenanceComponent,
        InvoiceRunDateMaintenanceComponent,
        ProspectStatusChangeComponent,
        InvoiceRangeMaintenanceComponent,
        InvoiceRunDateConfirmComponent,
        QuoteStatusMaintenanceComponent,
        SdlPremiseMaintenanceComponent,
        ExpenseCodeMaintenanceComponent,
        BatchProgramScheduleMaintenanceComponent,
        LostBusinessMaintenanceComponent,
        ContactTypeDetailPCExcMaintComponent,
        ContactTypeDetailPropertiesMaintComponent
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

export class InternalMaintenanceSalesModule { }
