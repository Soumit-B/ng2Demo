import { ContractRenewalMaintenanceComponent } from './../contract-management/ContractManagement/iCABSAContractRenewalMaintenance';
import { InvoicePrintMaintenanceComponent } from './maintenance/iCABSAInvoicePrintMaintenance';
import { ServiceCoverLocationMaintenanceComponent } from './maintenance/iCABSAServiceCoverLocationMaintenance.component';
import { DlContractMaintenanceComponent } from './maintenance/iCABSSdlContractMaintenance';
import { RouterModule } from '@angular/router';
import { NgModule, Component, ViewContainerRef, ViewChild } from '@angular/core';
import { ComponentsHelper } from 'ng2-bootstrap/ng2-bootstrap';
import { HttpModule } from '@angular/http';
import { SharedModule } from '../../shared/shared.module';
import { InternalSearchModule } from './search.module';
import { BillToCashModuleRoutes } from './../base/PageRoutes';
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
import { ServiceVisitMaintenanceComponent } from './maintenance/iCABSSeServiceVisitMaintenance.component';
import { BatchProgramScheduleMaintenanceComponent } from './maintenance/riMBatchProgramScheduleMaintenance.component';
import { QuoteStatusMaintenanceComponent } from './maintenance/iCABSSSOQuoteStatusMaintenance';
import { ServiceCoverComponentReplacementComponent } from './maintenance/iCABSAServiceCoverComponentReplacement.component';
import { VisitToleranceMaintenanceComponent } from './maintenance/iCABSSVisitToleranceMaintenance.component';
import { InvoicePrintLineComponent } from './maintenance/iCABSAInvoicePrintLineMaintenance.component';
import { AccountBankDetailsMaintenanceComponent } from './maintenance/Accountmaintenance/iCABSAAccountBankDetailsMaintenance.component';
import { ContractHistoryDetailComponent } from './maintenance/iCABSAContractHistoryDetail';
import { ServicePlanDeliveryNoteGenerationComponent } from './maintenance/iCABSSeServicePlanDeliveryNoteGeneration.component';
import { ServiceCoverLocationMoveMaintenanceComponent } from './maintenance/iCABSAServiceCoverLocationMoveMaintenance';
import { RateMaintenanceComponent } from './maintenance/iCABSBAPIRateMaintenance.component';
import { DiaryEntryComponent } from './maintenance/iCABSADiaryEntry.component';
import { DlServiceCoverMaintenanceComponent } from './maintenance/iCABSSdlServiceCoverMaintenance';
import { QuoteSubmitMaintenanceComponent } from './maintenance/iCABSSSOQuoteSubmitMaintenance';
import { ServiceCoverDetailMaintenanceComponent } from './maintenance/iCABSAServiceCoverDetailMaintenance';
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
import { InternalMaintenanceModuleRoutes } from '../base/PageRoutes';
import { InvoiceRunDateMaintenanceComponent } from './maintenance/iCABSBInvoiceRunDateMaintenance';
import { InvoiceGroupPremiseMaintenanceComponent } from './maintenance/iCABSAInvoiceGroupPremiseMaintenance';
import { RenewalGenerateComponent } from './maintenance/iCABSRenewalGenerate';
import { CustomerInfoMaintenanceComponent } from '../internal/maintenance/iCABSACustomerInfoMaintenance';
import { InvoiceDetailsMaintainanceComponent } from '../internal/maintenance/iCABSAInvoiceDetailsMaintenance';
import { CustomerInformationAccountMaintenanceComponent } from './maintenance/iCABSACustomerInformationAccountMaintenance';
import { ServiceCoverCommenceDateMaintenanceComponent } from './maintenance/iCABSAServiceCoverCommenceDateMaintenance.component';
import { TrialPeriodReleaseMaintenanceComponent } from './maintenance/iCABSATrialPeriodReleaseMaintenance.component';
import { ContactPersonMaintenanceComponent } from '../internal/maintenance/ContactPersonMaintenance/iCABSCMContactPersonMaintenance';
import { ContactPersonTypeAComponent } from '../internal/maintenance/ContactPersonMaintenance/tabs/contactPerson-type-a';
import { ContactPersonTypeBComponent } from '../internal/maintenance/ContactPersonMaintenance/tabs/contactPerson-type-b';
import { ContactPersonTypeCComponent } from '../internal/maintenance/ContactPersonMaintenance/tabs/contactPerson-type-c';
import { InvoiceChargeMaintenanceComponent } from '../internal/maintenance/iCABSAInvoiceChargeMaintenance';
import { CustomerInformationMaintenanceComponent } from '../internal/maintenance/iCABSACustomerInformationMaintenance';
export var InternalMaintenanceComponent = (function () {
    function InternalMaintenanceComponent(viewContainerRef, componentsHelper) {
        this.showErrorHeader = true;
        componentsHelper.setRootViewContainerRef(viewContainerRef);
    }
    InternalMaintenanceComponent.decorators = [
        { type: Component, args: [{
                    template: "<router-outlet></router-outlet>\n    <icabs-modal #errorModal=\"child\" [(showHeader)]=\"showErrorHeader\" [config]=\"{backdrop: 'static'}\"></icabs-modal>"
                },] },
    ];
    InternalMaintenanceComponent.ctorParameters = [
        { type: ViewContainerRef, },
        { type: ComponentsHelper, },
    ];
    InternalMaintenanceComponent.propDecorators = {
        'errorModal': [{ type: ViewChild, args: ['errorModal',] },],
    };
    return InternalMaintenanceComponent;
}());
export var InternalMaintenanceModule = (function () {
    function InternalMaintenanceModule() {
    }
    InternalMaintenanceModule.decorators = [
        { type: NgModule, args: [{
                    imports: [
                        HttpModule,
                        SharedModule,
                        InternalSearchModule,
                        RouterModule.forChild([
                            {
                                path: '', component: InternalMaintenanceComponent, children: [
                                    { path: InternalMaintenanceModuleRoutes.ICABSSDLSERVICECOVERMAINTENANCE, component: DlServiceCoverMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                                    { path: 'application/invoice/addressdetails', component: InvoiceHeaderAddressDetailsComponent },
                                    { path: 'application/service/invoice/ProRataChargeMaintenance', component: ProRataChargeMaintenanceComponent },
                                    { path: 'application/ServiceCoverComponentEntry', component: ServiceCoverEntryComponent },
                                    { path: 'maintenance/accountowner', component: AccountOwnerMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                                    { path: 'maintenance/planvisit', component: PlanVisitMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                                    { path: 'application/BatchProcessMonitorMaintenance', component: MBatchProcessMonitorMaintenanceComponent },
                                    { path: 'application/serviceCoverDetailGroupMaintenance', component: ServiceCoverDetailGroupMaintenanceComponent },
                                    { path: 'application/telesalesEntry', component: TelesalesEntryComponent },
                                    { path: 'application/service/visit/maintenance', component: ServiceVisitMaintenanceComponent },
                                    { path: 'application/invoiceReprintMaintenance', component: InvoiceReprintMaintenanceComponent },
                                    { path: 'maintenance/batchProgramSchedule', component: BatchProgramScheduleMaintenanceComponent },
                                    { path: 'maintenance/quotestatusmaintenance', component: QuoteStatusMaintenanceComponent },
                                    { path: 'maintenance/serviceCover/replacement', component: ServiceCoverComponentReplacementComponent, canDeactivate: [RouteAwayGuardService] },
                                    { path: 'application/maintenance/serviceCover/replacement', component: ServiceCoverComponentReplacementComponent, canDeactivate: [RouteAwayGuardService] },
                                    { path: 'maintenance/InvoicePrintLine', component: InvoicePrintLineComponent },
                                    { path: 'application/grouppaymentmaintenance', component: InvoiceGroupPaymentMaintenanceComponent },
                                    { path: InternalMaintenanceModuleRoutes.ICABSAEMPLOYEEGRID, component: EmployeeGridComponent },
                                    { path: 'application/AccountBankDetailsMaintenance', component: AccountBankDetailsMaintenanceComponent },
                                    { path: 'maintenance/serviceCoverDisplayMassValues', component: ServiceCoverDisplayMassValuesComponent, canDeactivate: [RouteAwayGuardService] },
                                    { path: 'service/datachangemaintenance', component: DataChangeMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                                    { path: 'maintenance/contractHistoryDetail', component: ContractHistoryDetailComponent },
                                    { path: 'maintenance/visitTolerance', component: VisitToleranceMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                                    { path: 'maintenance/premiseLocationMaintenance', component: PremiseLocationMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                                    { path: 'application/invoice/print/maintenance', component: InvoicePrintMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                                    { path: 'business/rangemaintenance', component: InvoiceRangeMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                                    { path: 'maintenance/servicecoverlocationmaintenance', component: ServiceCoverLocationMaintenanceComponent },
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
                                    { path: 'maintenance/invoicepremisegroup/search', component: InvoiceGroupPremiseMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                                    { path: 'contractmanagement/maintenance/contract/invoicenarrative', component: InvoiceNarrativeMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                                    { path: 'contractmanagement/maintenance/commencedate', component: ContractCommenceDateMaintenanceComponent },
                                    { path: 'contractmanagement/maintenance/commencedateex', component: ContractCommenceDateMaintenanceComponentExComponent },
                                    { path: 'contractmanagement/maintenance/customerInfoMaintenance', component: CustomerInfoMaintenanceComponent },
                                    { path: BillToCashModuleRoutes.ICABSAINVOICEDETAILSMAINTENANCE, component: InvoiceDetailsMaintainanceComponent },
                                    { path: InternalMaintenanceModuleRoutes.ICABSADIARYENTRY, component: DiaryEntryComponent, canDeactivate: [RouteAwayGuardService] },
                                    { path: 'application/serviceCoverCommencedate', component: ServiceCoverCommenceDateMaintenanceComponent },
                                    { path: InternalMaintenanceModuleRoutes.ICABSACUSTOMERINFORMATIONACCOUNTMAINTENANCE, component: CustomerInformationAccountMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                                    { path: 'contractmanagement/maintenance/renewalLetterGenerate', component: RenewalGenerateComponent },
                                    { path: 'application/ContactPersonMaintenance', component: ContactPersonMaintenanceComponent },
                                    { path: InternalMaintenanceModuleRoutes.ICABSACONTRACTRENEWALMAINTENANCE, component: ContractRenewalMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                                    { path: InternalMaintenanceModuleRoutes.ICABSAINVOICECHARGEMAINTENANCE, component: InvoiceChargeMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                                    { path: InternalMaintenanceModuleRoutes.ICABSSSOQUOTESUBMITMAINTENANCE, component: QuoteSubmitMaintenanceComponent },
                                    { path: InternalMaintenanceModuleRoutes.ICABSATRIALPERIODRELEASEMAINTENANCE, component: TrialPeriodReleaseMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                                    { path: InternalMaintenanceModuleRoutes.ICABSACUSTOMERINFORMATIONMAINTENANCE, component: CustomerInformationMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                                    { path: InternalMaintenanceModuleRoutes.ICABSASERVICECOVERDETAILMAINTENANCE, component: ServiceCoverDetailMaintenanceComponent, canDeactivate: [RouteAwayGuardService] }
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
                        TelesalesEntryComponent,
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
                        VisitToleranceMaintenanceComponent,
                        AccountBankDetailsMaintenanceComponent,
                        ServiceCoverDisplayMassValuesComponent,
                        DataChangeMaintenanceComponent,
                        PremiseLocationMaintenanceComponent,
                        ContractHistoryDetailComponent,
                        InvoicePrintLineComponent,
                        InvoiceGroupPaymentMaintenanceComponent,
                        InvoiceGroupPremiseMaintenanceComponent,
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
                        InvoiceDetailsMaintainanceComponent,
                        CustomerInformationAccountMaintenanceComponent,
                        RenewalGenerateComponent,
                        DiaryEntryComponent,
                        ServiceCoverCommenceDateMaintenanceComponent,
                        ContractRenewalMaintenanceComponent,
                        InvoiceChargeMaintenanceComponent,
                        QuoteSubmitMaintenanceComponent,
                        TrialPeriodReleaseMaintenanceComponent,
                        CustomerInformationMaintenanceComponent,
                        ServiceCoverDetailMaintenanceComponent
                    ],
                    entryComponents: [
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
                        InvoiceDetailsMaintainanceComponent,
                        CustomerInformationAccountMaintenanceComponent,
                        RenewalGenerateComponent,
                        ServiceCoverCommenceDateMaintenanceComponent,
                        ContactPersonTypeAComponent,
                        ContactPersonTypeBComponent,
                        ContactPersonTypeCComponent,
                        InvoiceChargeMaintenanceComponent,
                        ServiceCoverDetailMaintenanceComponent
                    ]
                },] },
    ];
    InternalMaintenanceModule.ctorParameters = [];
    return InternalMaintenanceModule;
}());
