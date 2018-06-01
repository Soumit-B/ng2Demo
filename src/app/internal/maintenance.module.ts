/*import { ProspectStatusChangeComponent } from './maintenance/iCABSSProspectStatusChange';
import { CMTelesalesEntryConfirmOrderComponent } from './maintenance/iCABSCMTelesalesEntryConfirmOrder.component';
import { ContractRenewalMaintenanceComponent } from './../contract-management/ContractManagement/iCABSAContractRenewalMaintenance';
import { InvoicePrintMaintenanceComponent } from './maintenance/iCABSAInvoicePrintMaintenance';
import { ServiceCoverLocationMaintenanceComponent } from './maintenance/iCABSAServiceCoverLocationMaintenance.component';
import { DlContractMaintenanceComponent } from './maintenance/iCABSSdlContractMaintenance';
import { SdlPremiseMaintenanceComponent } from './maintenance/iCABSSdlPremiseMaintenance.component';
import { RouterModule } from '@angular/router';
import { NgModule, ModuleWithProviders, Component, ViewContainerRef, ViewChild } from '@angular/core';
import { ComponentsHelper } from 'ng2-bootstrap/ng2-bootstrap';
import { HttpModule } from '@angular/http';
import { SharedModule } from '../../shared/shared.module';
import { InternalSearchModule } from './search.module';
import { BillToCashModuleRoutes, ContractManagementModuleRoutes, CCMModuleRoutes, InternalMaintenanceModuleRoutes, ProspectToContractModuleRoutes } from './../base/PageRoutes';

import { TelesalesEntryComponent } from './maintenance/TeleSales/iCABSCMTelesalesEntry.component';
import { InvoiceReprintMaintenanceComponent } from './maintenance/iCABSAInvoiceReprintMaintenance';
import { MBatchProcessMonitorMaintenanceComponent } from './maintenance/riMBatchProcessMonitorMaintenance';
import { ServiceCoverDetailGroupMaintenanceComponent } from './maintenance/iCABSAServiceCoverDetailGroupMaintenance';
import { AccountOwnerMaintenanceComponent } from './maintenance/iCABSAAccountOwnerMaintenance.component';
import { InvoiceNarrativeMaintenanceComponent } from './maintenance/iCABSAInvoiceNarrativeMaintenance/iCABSAInvoiceNarrativeMaintenance.component';
import { ContractCommenceDateMaintenanceComponent } from './maintenance/iCABSAContractCommenceDateMaintenance.component';
import { ContractCommenceDateMaintenanceComponentExComponent } from './maintenance/iCABSAContractCommenceDateMaintenanceEx.component';
import { InvoiceHeaderAddressDetailsComponent } from './maintenance/iCABSAInvoiceHeaderAddressDetails.component';
import { ProRataChargeMaintenanceComponent } from './maintenance/iCABSAProRataChargeMaintenance.component';

import { ServiceCoverEntryComponent } from './maintenance/iCABSAServiceCoverComponentEntry.component';
import { PlanVisitMaintenanceComponent } from './maintenance/Planvisitmaintenance/iCABSAPlanVisitMaintenance';
import { RouteAwayGuardService } from '../../shared/services/route-away-guard.service';
import { RouteAwayGlobals } from '../../shared/services/route-away-global.service';
import { ServiceVisitMaintenanceComponent } from './maintenance/iCABSSeServiceVisitMaintenance.component';
import { ServicePlanningEmployeeTimeMaintenanceHgComponent } from './maintenance/iCABSSeServicePlanningEmployeeTimeMaintenanceHg.component';
import { ServicePlanCancelComponent } from './maintenance/iCABSSeServicePlanCancel.component';
import { BatchProgramScheduleMaintenanceComponent } from './maintenance/riMBatchProgramScheduleMaintenance.component';
import { QuoteStatusMaintenanceComponent } from './maintenance/iCABSSSOQuoteStatusMaintenance';
import { ServiceAreaSequenceMaintenanceComponent } from './maintenance/iCABSSeServiceAreaSequenceMaintenance.component';
import { ServiceCoverComponentReplacementComponent } from './maintenance/iCABSAServiceCoverComponentReplacement.component';
import { VisitToleranceMaintenanceComponent } from './maintenance/iCABSSVisitToleranceMaintenance.component';
import { InvoicePrintLineComponent } from './maintenance/iCABSAInvoicePrintLineMaintenance.component';
import { AccountBankDetailsMaintenanceComponent } from './maintenance/Accountmaintenance/iCABSAAccountBankDetailsMaintenance.component';
import { ContractHistoryDetailComponent } from './maintenance/iCABSAContractHistoryDetail';
import { ServicePlanDeliveryNoteGenerationComponent } from './maintenance/iCABSSeServicePlanDeliveryNoteGeneration.component';
import { ServiceCoverLocationMoveMaintenanceComponent } from './maintenance/iCABSAServiceCoverLocationMoveMaintenance';
import { RateMaintenanceComponent } from './maintenance/iCABSBAPIRateMaintenance.component';
import { DiaryEntryComponent } from './maintenance/iCABSADiaryEntry.component';
import { SMSRedirectComponent } from './maintenance/iCABSCMSMSRedirect.component';
import { ServiceCoverSeasonMaintenanceComponent } from './maintenance/iCABSAServiceCoverSeasonMaintenance.component';
import { SCMCallOutMaintenanceComponent } from './maintenance/iCABSCMCallOutMaintenance.component';
import { DlServiceCoverMaintenanceComponent } from './maintenance/iCABSSdlServiceCoverMaintenance';
import { CustomerContactMaintenanceCopyComponent } from './maintenance/iCABSCMCustomerContactMaintenanceCopy';
import { QuoteSubmitMaintenanceComponent } from './maintenance/iCABSSSOQuoteSubmitMaintenance';
import { SeasonalTemplateMaintenanceComponent } from './maintenance/iCABSASeasonalTemplateMaintenance.component';
// Tabs
import { ProRataMaintenanceTypeAComponent } from './maintenance/proRataChargeMaintenance/proRatamaintenance-type-a.component';
import { ProRataMaintenanceTypeBComponent } from './maintenance/proRataChargeMaintenance/proRatamaintenance-type-b.component';
import { InvoiceGroupPaymentMaintenanceComponent } from './maintenance/iCABSAInvoiceGroupPaymentMaintenance';
import { ServiceCoverDisplayMassValuesComponent } from './maintenance/iCABSAServiceCoverDisplayMassValues';
import { EmployeeGridComponent } from './maintenance/iCABSAEmployeeGrid.component';
import { DataChangeMaintenanceComponent } from './maintenance/iCABSSeDataChangeMaintenance.component';
import { InvoiceRangeMaintenanceComponent } from './maintenance/iCABSBInvoiceRangeMaintenance.component';
import { InvoiceRunDateConfirmComponent } from './maintenance/iCABSBInvoiceRunDateConfirm';
import { PremiseLocationMaintenanceComponent } from './maintenance/iCABSAPremiseLocationMaintenance.component';
import { ServiceCoverCommenceDateMaintenanceExComponent } from './maintenance/iCABSAServiceCoverCommenceDateMaintenanceEx';
import { JobServiceDetailGroupMaintenanceMaintenanceComponent } from './maintenance/iCABSCMNatAxJobServiceDetailGroupMaintenance';
import { InvoiceRunDateMaintenanceComponent } from './maintenance/iCABSBInvoiceRunDateMaintenance';
import { InvoiceGroupPremiseMaintenanceComponent } from './maintenance/iCABSAInvoiceGroupPremiseMaintenance';
import { RenewalGenerateComponent } from './maintenance/iCABSRenewalGenerate';
import { CustomerInfoMaintenanceComponent } from '../internal/maintenance/iCABSACustomerInfoMaintenance';
import { CustomerInformationAccountMaintenanceComponent } from './maintenance/iCABSACustomerInformationAccountMaintenance';
import { ServiceCoverDetailMaintenanceComponent } from './maintenance/iCABSAServiceCoverDetailMaintenance';
import { ServiceCoverCommenceDateMaintenanceComponent } from './maintenance/iCABSAServiceCoverCommenceDateMaintenance.component';
import { TrialPeriodReleaseMaintenanceComponent } from './maintenance/iCABSATrialPeriodReleaseMaintenance.component';
import { ContactPersonMaintenanceComponent } from '../internal/maintenance/ContactPersonMaintenance/iCABSCMContactPersonMaintenance';
import { ContactPersonTypeAComponent } from '../internal/maintenance/ContactPersonMaintenance/tabs/contactPerson-type-a';
import { ContactPersonTypeBComponent } from '../internal/maintenance/ContactPersonMaintenance/tabs/contactPerson-type-b';
import { ContactPersonTypeCComponent } from '../internal/maintenance/ContactPersonMaintenance/tabs/contactPerson-type-c';
import { CustomerContactRootCauseEntryComponent } from './maintenance/iCABSCMCustomerContactRootCauseEntry';
import { ServiceCoverCalendarDatesMaintenanceComponent } from './maintenance/iCABSAServiceCoverCalendarDatesMaintenance';
import { CalendarTemplateMaintenanceComponent } from '../internal/maintenance/iCABSACalendarTemplateMaintenance';
import { CMNatAxJobServiceCoverMaintenanceComponent } from './maintenance/iCABSCMNatAxJobServiceCoverMaintenance.component';
import { BranchHolidayMaintenanceComponent } from './maintenance/iCABSBBranchHolidayMaintenance.component';
import { CustomerContactEmployeeViewComponent } from './maintenance/iCABSCMCustomerContactEmployeeView.component';
import { CMEmployeeViewBranchDetailsComponent } from './maintenance/iCABSCMEmployeeViewBranchDetails.component';
import { ServiceCoverPriceChangeMaintenanceComponent } from '../internal/maintenance/iCABSAServiceCoverPriceChangeMaintenance.component';
import { ExpenseCodeMaintenanceComponent } from './maintenance/iCABSBExpenseCodeMaintenance.component';
import { InvoiceChargeMaintenanceComponent } from '../internal/maintenance/iCABSAInvoiceChargeMaintenance';
import { CustomerInformationMaintenanceComponent } from '../internal/maintenance/iCABSACustomerInformationMaintenance';
import { CMProspectMaintenanceComponent } from '../internal/maintenance/iCABSCMProspectMaintenance';
import { LinkedProductsMaintenanceComponent } from '../internal/maintenance/iCABSALinkedProductsMaintenance.component';
import { LostBusinessDetailMaintenanceComponent } from '../internal/maintenance/iCABSBLostBusinessDetailMaintenance.component';

import { ProspectConversionMaintenanceComponent } from './maintenance/iCABSCMProspectConversionMaintenance';
@Component({
    template: `<router-outlet></router-outlet>
    <icabs-modal #errorModal="child" [(showHeader)]="showErrorHeader" [config]="{backdrop: 'static'}"></icabs-modal>`
})

export class InternalMaintenanceComponent {
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
                path: '', component: InternalMaintenanceComponent, children: [
                    { path: InternalMaintenanceModuleRoutes.ICABSSDLSERVICECOVERMAINTENANCE, component: DlServiceCoverMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: 'application/invoice/addressdetails', component: InvoiceHeaderAddressDetailsComponent },
                    { path: 'application/service/invoice/ProRataChargeMaintenance', component: ProRataChargeMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: InternalMaintenanceModuleRoutes.ICABSBBRANCHHOLIDAYMAINTENANCE, component: BranchHolidayMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: 'application/ServiceCoverComponentEntry', component: ServiceCoverEntryComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: 'maintenance/accountowner', component: AccountOwnerMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: 'maintenance/planvisit', component: PlanVisitMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: 'application/BatchProcessMonitorMaintenance', component: MBatchProcessMonitorMaintenanceComponent },
                    { path: 'application/serviceCoverDetailGroupMaintenance', component: ServiceCoverDetailGroupMaintenanceComponent },
                    { path: 'application/telesalesEntry', component: TelesalesEntryComponent },
                    { path: 'application/service/visit/maintenance', component: ServiceVisitMaintenanceComponent },
                    { path: 'application/invoiceReprintMaintenance', component: InvoiceReprintMaintenanceComponent },
                    { path: 'maintenance/batchProgramSchedule', component: BatchProgramScheduleMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: 'maintenance/quotestatusmaintenance', component: QuoteStatusMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: 'maintenance/serviceCover/replacement', component: ServiceCoverComponentReplacementComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: 'application/maintenance/serviceCover/replacement', component: ServiceCoverComponentReplacementComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: 'maintenance/InvoicePrintLine', component: InvoicePrintLineComponent },
                    { path: 'application/grouppaymentmaintenance', component: InvoiceGroupPaymentMaintenanceComponent },
                    { path: InternalMaintenanceModuleRoutes.ICABSAEMPLOYEEGRID, component: EmployeeGridComponent },
                    { path: 'application/AccountBankDetailsMaintenance', component: AccountBankDetailsMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: 'maintenance/serviceCoverDisplayMassValues', component: ServiceCoverDisplayMassValuesComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: InternalMaintenanceModuleRoutes.ICABSSESERVICEPLANNINGEMPLOYEETIMEMAINTENANCEHG, component: ServicePlanningEmployeeTimeMaintenanceHgComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: 'service/datachangemaintenance', component: DataChangeMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: 'maintenance/contractHistoryDetail', component: ContractHistoryDetailComponent },
                    { path: 'maintenance/visitTolerance', component: VisitToleranceMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: 'maintenance/premiseLocationMaintenance', component: PremiseLocationMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: 'application/invoice/print/maintenance', component: InvoicePrintMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: 'maintenance/sdlpremisemaintenance', component: SdlPremiseMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: 'business/rangemaintenance', component: InvoiceRangeMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: 'maintenance/servicecoverlocationmaintenance', component: ServiceCoverLocationMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: 'application/invoice/print/maintenance', component: InvoicePrintMaintenanceComponent },
                    { path: 'maintenance/sSdlContractMaintenance', component: DlContractMaintenanceComponent },
                    { path: 'maintenance/servicecover/commencedate', component: ServiceCoverCommenceDateMaintenanceExComponent },
                    { path: 'business/rundateconfirm', component: InvoiceRunDateConfirmComponent },
                    { path: 'maintenance/ServiceCoverLocationMoveMaintenance', component: ServiceCoverLocationMoveMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: 'business/ServicePlanDeliveryNoteGeneration', component: ServicePlanDeliveryNoteGenerationComponent },
                    { path: 'maintenance/invoiceRunDateMaintenance', component: InvoiceRunDateMaintenanceComponent },
                    { path: InternalMaintenanceModuleRoutes.ICABSAMNATAXJOBSERVICEDETAILGROUPMAINTENANCE, component: JobServiceDetailGroupMaintenanceMaintenanceComponent },
                    { path: 'maintenance/apiRateMaintenance', component: RateMaintenanceComponent },
                    { path: 'maintenance/invoiceRunDateMaintenance', component: InvoiceRunDateMaintenanceComponent },
                    { path: InternalMaintenanceModuleRoutes.ICABSSESERVICEPLANCANCEL, component: ServicePlanCancelComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: 'maintenance/invoicepremisegroup/search', component: InvoiceGroupPremiseMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: 'contractmanagement/maintenance/contract/invoicenarrative', component: InvoiceNarrativeMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: 'contractmanagement/maintenance/commencedate', component: ContractCommenceDateMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: 'contractmanagement/maintenance/commencedateex', component: ContractCommenceDateMaintenanceComponentExComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: 'contractmanagement/maintenance/customerInfoMaintenance', component: CustomerInfoMaintenanceComponent },
                    { path: InternalMaintenanceModuleRoutes.ICABSADIARYENTRY, component: DiaryEntryComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: 'application/serviceCoverCommencedate', component: ServiceCoverCommenceDateMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: InternalMaintenanceModuleRoutes.ICABSACUSTOMERINFORMATIONACCOUNTMAINTENANCE, component: CustomerInformationAccountMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: 'contractmanagement/maintenance/renewalLetterGenerate', component: RenewalGenerateComponent },
                    { path: 'application/ContactPersonMaintenance', component: ContactPersonMaintenanceComponent },
                    { path: InternalMaintenanceModuleRoutes.ICABSASERVICECOVERSEASONMAINTENANCE, component: ServiceCoverSeasonMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: InternalMaintenanceModuleRoutes.ICABSASERVICECOVERPRICECHANGEMAINTENANCE, component: ServiceCoverPriceChangeMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: InternalMaintenanceModuleRoutes.ICABSCMCALLOUTMAINTENANCE, component: SCMCallOutMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: InternalMaintenanceModuleRoutes.ICABSASERVICECOVERDETAILMAINTENANCE, component: ServiceCoverDetailMaintenanceComponent },
                    { path: InternalMaintenanceModuleRoutes.ICABSCMSMSREDIRECT, component: SMSRedirectComponent },
                    { path: CCMModuleRoutes.ICABSCMTELESALESENTRYCONFIRMORDER, component: CMTelesalesEntryConfirmOrderComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: InternalMaintenanceModuleRoutes.ICABSASERVICECOVERCALENDARDATESMAINTENANCE, component: ServiceCoverCalendarDatesMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: InternalMaintenanceModuleRoutes.ICABSACALENDARTEMPLATEMAINTENANCE, component: CalendarTemplateMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: InternalMaintenanceModuleRoutes.ICABSCMNATAXJOBSERVICECOVERMAINTENANCE, component: CMNatAxJobServiceCoverMaintenanceComponent },
                    { path: InternalMaintenanceModuleRoutes.ICABSCMCUSTOMERCONTACTEMPLOYEEVIEW, component: CustomerContactEmployeeViewComponent },
                    { path: InternalMaintenanceModuleRoutes.ICABSCMEMPLOYEEVIEWBRANCHDETAILS, component: CMEmployeeViewBranchDetailsComponent },
                    { path: InternalMaintenanceModuleRoutes.ICABSSESERVICEAREASEQUENCEMAINTENANCE, component: ServiceAreaSequenceMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: InternalMaintenanceModuleRoutes.ICABSCMCUSTOMERCONTACTROOTCAUSEENTRY, component: CustomerContactRootCauseEntryComponent },
                    { path: InternalMaintenanceModuleRoutes.ICABSACONTRACTRENEWALMAINTENANCE, component: ContractRenewalMaintenanceComponent },
                    { path: InternalMaintenanceModuleRoutes.ICABSBEXPENSECODEMAINTENANCE, component: ExpenseCodeMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: InternalMaintenanceModuleRoutes.ICABSAINVOICECHARGEMAINTENANCE, component: InvoiceChargeMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: InternalMaintenanceModuleRoutes.ICABSSSOQUOTESUBMITMAINTENANCE, component: QuoteSubmitMaintenanceComponent },
                    { path: InternalMaintenanceModuleRoutes.ICABSCMCUSTOMERCONTACTMAINTENANCECOPY, component: CustomerContactMaintenanceCopyComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: InternalMaintenanceModuleRoutes.ICABSCMPROSPECTMAINTENANCE, component: CMProspectMaintenanceComponent },
                    { path: InternalMaintenanceModuleRoutes.ICABSATRIALPERIODRELEASEMAINTENANCE, component: TrialPeriodReleaseMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: InternalMaintenanceModuleRoutes.ICABSACUSTOMERINFORMATIONMAINTENANCE, component: CustomerInformationMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: InternalMaintenanceModuleRoutes.ICABSASERVICECOVERDETAILMAINTENANCE, component: ServiceCoverDetailMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: InternalMaintenanceModuleRoutes.ICABSASEASONALTEMPLATEMAINTENANCE, component: SeasonalTemplateMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: InternalMaintenanceModuleRoutes.ICABSSPROSPECTSTATUSCHANGE, component: ProspectStatusChangeComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: InternalMaintenanceModuleRoutes.ICABSALINKEDPRODUCTSMAINTENANCE, component: LinkedProductsMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: InternalMaintenanceModuleRoutes.ICABSBLOSTBUSINESSDETAILMAINTENANCE, component: LostBusinessDetailMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: InternalMaintenanceModuleRoutes.ICABSCMPROSPECTCONVERSIONMAINTENANCE, component: ProspectConversionMaintenanceComponent, canDeactivate: [RouteAwayGuardService] }
                ]
            }
        ])
    ],

    declarations: [
        InternalMaintenanceComponent,
        DlServiceCoverMaintenanceComponent,
        ContactPersonMaintenanceComponent,
        ContactPersonTypeAComponent,
        ContactPersonTypeBComponent,
        ContactPersonTypeCComponent,
        InvoiceNarrativeMaintenanceComponent,
        ContractCommenceDateMaintenanceComponent,
        ContractCommenceDateMaintenanceComponentExComponent,
        InvoiceHeaderAddressDetailsComponent,
        ProRataChargeMaintenanceComponent,
        ServiceCoverEntryComponent,
        AccountOwnerMaintenanceComponent,
        ServicePlanningEmployeeTimeMaintenanceHgComponent,
        TelesalesEntryComponent,
        ServiceCoverPriceChangeMaintenanceComponent,
        PlanVisitMaintenanceComponent,
        ServiceCoverDetailGroupMaintenanceComponent,
        MBatchProcessMonitorMaintenanceComponent,
        ServiceVisitMaintenanceComponent,
        InvoiceReprintMaintenanceComponent,
        BatchProgramScheduleMaintenanceComponent,
        QuoteStatusMaintenanceComponent,
        ServiceCoverComponentReplacementComponent,
        ProRataMaintenanceTypeAComponent,
        ProRataMaintenanceTypeBComponent,
        ServicePlanCancelComponent,
        ServiceAreaSequenceMaintenanceComponent,
        VisitToleranceMaintenanceComponent,
        AccountBankDetailsMaintenanceComponent,
        ServiceCoverDisplayMassValuesComponent,
        SdlPremiseMaintenanceComponent,
        DataChangeMaintenanceComponent,
        PremiseLocationMaintenanceComponent,
        ContractHistoryDetailComponent,
        InvoicePrintLineComponent,
        InvoiceGroupPaymentMaintenanceComponent,
        InvoiceGroupPremiseMaintenanceComponent,
        SdlPremiseMaintenanceComponent,
        EmployeeGridComponent,
        InvoicePrintMaintenanceComponent,
        InvoiceRangeMaintenanceComponent,
        ServiceCoverLocationMaintenanceComponent,
        InvoicePrintMaintenanceComponent,
        DlContractMaintenanceComponent,
        ServiceCoverLocationMoveMaintenanceComponent,
        ServiceCoverCommenceDateMaintenanceExComponent,
        InvoiceRunDateConfirmComponent,
        ServicePlanDeliveryNoteGenerationComponent,
        JobServiceDetailGroupMaintenanceMaintenanceComponent,
        RateMaintenanceComponent,
        InvoiceRunDateMaintenanceComponent,
        CustomerInfoMaintenanceComponent,
        CustomerInformationAccountMaintenanceComponent,
        RenewalGenerateComponent,
        DiaryEntryComponent,
        ServiceCoverSeasonMaintenanceComponent,
        SCMCallOutMaintenanceComponent,
        ServiceCoverCommenceDateMaintenanceExComponent,
        ServiceCoverDetailMaintenanceComponent,
        DiaryEntryComponent,
        CustomerContactRootCauseEntryComponent,
        ServiceCoverCalendarDatesMaintenanceComponent,
        // LostBusinessContactMaintenanceComponent
        DiaryEntryComponent,
        SMSRedirectComponent,
        CMTelesalesEntryConfirmOrderComponent,
        CalendarTemplateMaintenanceComponent,
        CMNatAxJobServiceCoverMaintenanceComponent,
        CustomerContactEmployeeViewComponent,
        CMEmployeeViewBranchDetailsComponent,
        ServiceCoverCommenceDateMaintenanceComponent,
        ContractRenewalMaintenanceComponent,
        TrialPeriodReleaseMaintenanceComponent,
        ExpenseCodeMaintenanceComponent,
        InvoiceChargeMaintenanceComponent,
        QuoteSubmitMaintenanceComponent,
        BranchHolidayMaintenanceComponent,
        ServiceCoverDetailMaintenanceComponent,
        CustomerContactMaintenanceCopyComponent,
        CustomerInformationMaintenanceComponent,
        CMProspectMaintenanceComponent,
        SeasonalTemplateMaintenanceComponent,
        ProspectStatusChangeComponent,
        LinkedProductsMaintenanceComponent,
        ContactTypeDetailLanglMaintenanceComponent
    ],

        InvoiceNarrativeMaintenanceComponent,
        ContractCommenceDateMaintenanceComponent,
        ContractCommenceDateMaintenanceComponentExComponent,
        InvoiceHeaderAddressDetailsComponent,
        ServiceCoverEntryComponent,
        AccountOwnerMaintenanceComponent,
        PlanVisitMaintenanceComponent,
        MBatchProcessMonitorMaintenanceComponent,
        ServiceVisitMaintenanceComponent,
        InvoiceReprintMaintenanceComponent,
        BatchProgramScheduleMaintenanceComponent,
        QuoteStatusMaintenanceComponent,
        ProRataMaintenanceTypeAComponent,
        ProRataMaintenanceTypeBComponent,
        InvoiceGroupPaymentMaintenanceComponent,
        AccountBankDetailsMaintenanceComponent,
        ServiceCoverDisplayMassValuesComponent,
        SdlPremiseMaintenanceComponent,
        DataChangeMaintenanceComponent,
        PremiseLocationMaintenanceComponent,
        InvoiceRangeMaintenanceComponent,
        ContractHistoryDetailComponent,
        ServiceCoverLocationMaintenanceComponent,
        ServiceCoverLocationMoveMaintenanceComponent,
        RateMaintenanceComponent,
        InvoiceRunDateConfirmComponent,
        ServicePlanDeliveryNoteGenerationComponent,
        InvoiceRunDateMaintenanceComponent,
        InvoiceGroupPremiseMaintenanceComponent,
        CustomerInfoMaintenanceComponent,
        CustomerInformationAccountMaintenanceComponent,
        RenewalGenerateComponent,
        ServiceCoverCommenceDateMaintenanceComponent,
        ContactPersonTypeAComponent,
        ContactPersonTypeBComponent,
        ContactPersonTypeCComponent,
        ServiceCoverDetailMaintenanceComponent,
        CustomerContactRootCauseEntryComponent,
        CMTelesalesEntryConfirmOrderComponent,
        CalendarTemplateMaintenanceComponent,
        ServiceCoverSeasonMaintenanceComponent,
        CMNatAxJobServiceCoverMaintenanceComponent,
        CustomerContactEmployeeViewComponent,
        CMEmployeeViewBranchDetailsComponent,
        ExpenseCodeMaintenanceComponent,
        CustomerContactMaintenanceCopyComponent,
        InvoiceChargeMaintenanceComponent,
        SeasonalTemplateMaintenanceComponent,
        ProspectStatusChangeComponent,
        LostBusinessDetailMaintenanceComponent
    ]
})

export class InternalMaintenanceModule { }
*/
