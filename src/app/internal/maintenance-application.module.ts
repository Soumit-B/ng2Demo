import { ProductMaintenanceComponent } from './maintenance/ProductMaintenance/iCABSBProductMaintenance.component';
import { VisitAppointmentMaintenanceComponent } from './maintenance/iCABSAVisitAppointmentMaintenance.component';
import { ValidLinkedProductsMaintenanceComponent } from './maintenance/iCABSBValidLinkedProductsMaintenance.component';
import { CallCentreCreateFixedPriceJobComponent } from './maintenance/iCABSCMCallCentreCreateFixedPriceJob.component';
import { LostBusinessDetailMaintenanceComponent } from '../internal/maintenance/iCABSBLostBusinessDetailMaintenance.component';
import { ServiceCoverLocationMoveMaintenanceComponent } from './maintenance/iCABSAServiceCoverLocationMoveMaintenance';
import { ServiceCoverCommenceDateMaintenanceExComponent } from './maintenance/iCABSAServiceCoverCommenceDateMaintenanceEx';
import { ServiceCoverCommenceDateMaintenanceComponent } from './maintenance/iCABSAServiceCoverCommenceDateMaintenance.component';
import { ServiceCoverLocationMaintenanceComponent } from './maintenance/iCABSAServiceCoverLocationMaintenance.component';
import { ServiceCoverDisplayMassValuesComponent } from './maintenance/iCABSAServiceCoverDisplayMassValues';
import { ServiceCoverPriceChangeMaintenanceComponent } from './maintenance/iCABSAServiceCoverPriceChangeMaintenance.component';
import { CustomerInformationMaintenanceComponent } from './maintenance/iCABSACustomerInformationMaintenance';
import { TrialPeriodReleaseMaintenanceComponent } from './maintenance/iCABSATrialPeriodReleaseMaintenance.component';
import { CustomerInformationAccountMaintenanceComponent } from './maintenance/iCABSACustomerInformationAccountMaintenance';
import { PremiseLocationMaintenanceComponent } from './maintenance/iCABSAPremiseLocationMaintenance.component';
import { ContractHistoryDetailComponent } from './maintenance/iCABSAContractHistoryDetail';
import { PlanVisitMaintenanceComponent } from './maintenance/Planvisitmaintenance/iCABSAPlanVisitMaintenance';
import { AccountOwnerMaintenanceComponent } from './maintenance/iCABSAAccountOwnerMaintenance.component';
import { SeasonalTemplateMaintenanceComponent } from './maintenance/iCABSASeasonalTemplateMaintenance.component';
import { CalendarTemplateMaintenanceComponent } from './maintenance/iCABSACalendarTemplateMaintenance';
import { LostBusinessRequestMaintenanceComponent } from './maintenance/iCABSALostBusinessRequestMaintenance.component';
import { ServiceCoverDetailMaintenanceComponent } from './maintenance/iCABSAServiceCoverDetailMaintenance';
import { ServiceCoverSeasonMaintenanceComponent } from './maintenance/iCABSAServiceCoverSeasonMaintenance.component';
import { InvoicePrintMaintenanceComponent } from './maintenance/iCABSAInvoicePrintMaintenance';
import { AccountBankDetailsMaintenanceComponent } from './maintenance/Accountmaintenance/iCABSAAccountBankDetailsMaintenance.component';
import { InvoiceGroupPaymentMaintenanceComponent } from './maintenance/iCABSAInvoiceGroupPaymentMaintenance';
import { InvoiceReprintMaintenanceComponent } from './maintenance/iCABSAInvoiceReprintMaintenance';
import { ServiceCoverDetailGroupMaintenanceComponent } from './maintenance/iCABSAServiceCoverDetailGroupMaintenance';
import { MBatchProcessMonitorMaintenanceComponent } from './maintenance/riMBatchProcessMonitorMaintenance';
import { ServiceCoverEntryComponent } from './maintenance/iCABSAServiceCoverComponentEntry.component';
import { ContractRenewalMaintenanceComponent } from './../contract-management/ContractManagement/iCABSAContractRenewalMaintenance';
import { RouteAwayGuardService } from '../../shared/services/route-away-guard.service';
import { InvoiceHeaderAddressDetailsComponent } from './maintenance/iCABSAInvoiceHeaderAddressDetails.component';
import { ContactTypeDetailMaintenanceComponent } from './maintenance/iCABSSContactTypeDetailMaintenance.component';
import { InternalMaintenanceApplicationModuleRoutesConstant } from '../base/PageRoutes';
import { InternalSearchModule } from './search.module';
import { SharedModule } from './../../shared/shared.module';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { Component, ViewChild, ViewContainerRef, NgModule } from '@angular/core';
import { ComponentsHelper } from 'ng2-bootstrap/ng2-bootstrap';
import { AServiceCoverSuspendMaintenanceComponent } from './maintenance/iCABSAServiceCoverSuspendMaintenance.component';
import { LostBusinessContactMaintenanceComponent } from './maintenance/iCABSALostBusinessContactMaintenance.component';
import { ProductDetailMaintenanceComponent } from '../internal/maintenance/iCABSBProductDetailMaintenance.component';
import { ProductServiceGroupMaintenanceComponent } from '../internal/maintenance/iCABSBProductServiceGroupMaintenance.component';
import { CustomerTypeMaintenanceComponent } from './maintenance/iCABSSCustomerTypeMaintenance.component';
import { PremiseSuspendMaintenanceComponent } from './maintenance/iCABSAPremiseSuspendMaintenance.component';

@Component({
    template: `<router-outlet></router-outlet>
    <icabs-modal #errorModal="child" [(showHeader)]="showErrorHeader" [config]="{backdrop: 'static'}"></icabs-modal>`
})

export class InternalMaintenanceApplicationComponent {
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
                path: '', component: InternalMaintenanceApplicationComponent, children: [
                    { path: InternalMaintenanceApplicationModuleRoutesConstant.ICABSAINVOICEHEADERADDRESSDETAILS, component: InvoiceHeaderAddressDetailsComponent },
                    { path: InternalMaintenanceApplicationModuleRoutesConstant.ICABSACONTRACTRENEWALMAINTENANCE, component: ContractRenewalMaintenanceComponent },
                    { path: InternalMaintenanceApplicationModuleRoutesConstant.ICABSASERVICECOVERCOMPONENTENTRY, component: ServiceCoverEntryComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: InternalMaintenanceApplicationModuleRoutesConstant.RIMBATCHPROCESSMONITORMAINTENANCE, component: MBatchProcessMonitorMaintenanceComponent },
                    { path: InternalMaintenanceApplicationModuleRoutesConstant.ICABSASERVICECOVERDETAILGROUPMAINTENANCE, component: ServiceCoverDetailGroupMaintenanceComponent },
                    { path: InternalMaintenanceApplicationModuleRoutesConstant.ICABSAINVOICEREPRINTMAINTENANCE, component: InvoiceReprintMaintenanceComponent },
                    { path: InternalMaintenanceApplicationModuleRoutesConstant.ICABSAINVOICEGROUPPAYMENTMAINTENANCE, component: InvoiceGroupPaymentMaintenanceComponent },
                    { path: InternalMaintenanceApplicationModuleRoutesConstant.ICABSAACCOUNTBANKDETAILSMAINTENANCE, component: AccountBankDetailsMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: InternalMaintenanceApplicationModuleRoutesConstant.ICABSAINVOICEPRINTMAINTENANCE, component: InvoicePrintMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: InternalMaintenanceApplicationModuleRoutesConstant.ICABSASERVICECOVERSEASONMAINTENANCE, component: ServiceCoverSeasonMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: InternalMaintenanceApplicationModuleRoutesConstant.ICABSASERVICECOVERDETAILMAINTENANCE, component: ServiceCoverDetailMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: InternalMaintenanceApplicationModuleRoutesConstant.ICABSACALENDARTEMPLATEMAINTENANCE, component: CalendarTemplateMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: InternalMaintenanceApplicationModuleRoutesConstant.ICABSASEASONALTEMPLATEMAINTENANCE, component: SeasonalTemplateMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: InternalMaintenanceApplicationModuleRoutesConstant.ICABSAACCOUNTOWNERMAINTENANCE, component: AccountOwnerMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: InternalMaintenanceApplicationModuleRoutesConstant.ICABSAPLANVISITMAINTENANCE, component: PlanVisitMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: InternalMaintenanceApplicationModuleRoutesConstant.ICABSACONTRACTHISTORYDETAIL, component: ContractHistoryDetailComponent },
                    { path: InternalMaintenanceApplicationModuleRoutesConstant.ICABSAPREMISELOCATIONMAINTENANCE, component: PremiseLocationMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: InternalMaintenanceApplicationModuleRoutesConstant.ICABSALOSTBUSINESSREQUESTMAINTENANCE, component: LostBusinessRequestMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: InternalMaintenanceApplicationModuleRoutesConstant.ICABSACUSTOMERINFORMATIONACCOUNTMAINTENANCE, component: CustomerInformationAccountMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: InternalMaintenanceApplicationModuleRoutesConstant.ICABSATRIALPERIODRELEASEMAINTENANCE, component: TrialPeriodReleaseMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: InternalMaintenanceApplicationModuleRoutesConstant.ICABSACUSTOMERINFORMATIONMAINTENANCE, component: CustomerInformationMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: InternalMaintenanceApplicationModuleRoutesConstant.ICABSASERVICECOVERPRICECHANGEMAINTENANCE, component: ServiceCoverPriceChangeMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: InternalMaintenanceApplicationModuleRoutesConstant.ICABSASERVICECOVERDISPLAYMASSVALUES, component: ServiceCoverDisplayMassValuesComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: InternalMaintenanceApplicationModuleRoutesConstant.ICABSASERVICECOVERLOCATIONMAINTENANCE, component: ServiceCoverLocationMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: InternalMaintenanceApplicationModuleRoutesConstant.ICABSASERVICECOVERCOMMENCEDATEMAINTENANCE, component: ServiceCoverCommenceDateMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: InternalMaintenanceApplicationModuleRoutesConstant.ICABSASERVICECOVERCOMMENCEDATEMAINTENANCEEX, component: ServiceCoverCommenceDateMaintenanceExComponent },
                    { path: InternalMaintenanceApplicationModuleRoutesConstant.ICABSASERVICECOVERLOCATIONMOVEMAINTENANCE, component: ServiceCoverLocationMoveMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: InternalMaintenanceApplicationModuleRoutesConstant.ICABSBPRODUCTMAINTENANCE, component: ProductMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: InternalMaintenanceApplicationModuleRoutesConstant.ICABSCMCALLCENTRECREATEFIXEDPRICEJOB, component: CallCentreCreateFixedPriceJobComponent },
                    { path: InternalMaintenanceApplicationModuleRoutesConstant.ICABSSCONTACTTYPEDETAILMAINTENANCE, component: ContactTypeDetailMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: InternalMaintenanceApplicationModuleRoutesConstant.ICABSALOSTBUSINESSCONTACTMAINTENANCE, component: LostBusinessContactMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: InternalMaintenanceApplicationModuleRoutesConstant.ICABSBLOSTBUSINESSDETAILMAINTENANCE, component: LostBusinessDetailMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: InternalMaintenanceApplicationModuleRoutesConstant.ICABSBPRODUCTDETAILMAINTENANCE, component: ProductDetailMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: InternalMaintenanceApplicationModuleRoutesConstant.ICABSBVALIDLINKEDPRODUCTSMAINTENANCE, component: ValidLinkedProductsMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: InternalMaintenanceApplicationModuleRoutesConstant.ICABSASERVICECOVERSUSPENDMAINTENANCE.CONTRACT, component: AServiceCoverSuspendMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: InternalMaintenanceApplicationModuleRoutesConstant.ICABSASERVICECOVERSUSPENDMAINTENANCE.JOB, component: AServiceCoverSuspendMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: InternalMaintenanceApplicationModuleRoutesConstant.ICABSAPREMISESUSPENDMAINTENANCE.CONTRACT, component: PremiseSuspendMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: InternalMaintenanceApplicationModuleRoutesConstant.ICABSAPREMISESUSPENDMAINTENANCE.JOB, component: PremiseSuspendMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: InternalMaintenanceApplicationModuleRoutesConstant.ICABSBVALIDLINKEDPRODUCTSMAINTENANCE, component: ValidLinkedProductsMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: InternalMaintenanceApplicationModuleRoutesConstant.ICABSAVISITAPPOINTMENTMAINTENANCE, component: VisitAppointmentMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: InternalMaintenanceApplicationModuleRoutesConstant.ICABSBPRODUCTSERVICEGROUPMAINTENANCE, component: ProductServiceGroupMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: InternalMaintenanceApplicationModuleRoutesConstant.ICABSSCUSTOMERTYPEMAINTENANCE, component: CustomerTypeMaintenanceComponent, canDeactivate: [RouteAwayGuardService] }
                ]
            }
        ])
    ],

    declarations: [
        InternalMaintenanceApplicationComponent,
        InvoiceHeaderAddressDetailsComponent,
        ContractRenewalMaintenanceComponent,
        ServiceCoverEntryComponent,
        MBatchProcessMonitorMaintenanceComponent,
        ServiceCoverDetailGroupMaintenanceComponent,
        InvoiceReprintMaintenanceComponent,
        InvoiceGroupPaymentMaintenanceComponent,
        AccountBankDetailsMaintenanceComponent,
        InvoicePrintMaintenanceComponent,
        ServiceCoverSeasonMaintenanceComponent,
        LostBusinessRequestMaintenanceComponent,
        ServiceCoverDetailMaintenanceComponent,
        CalendarTemplateMaintenanceComponent,
        SeasonalTemplateMaintenanceComponent,
        AccountOwnerMaintenanceComponent,
        PlanVisitMaintenanceComponent,
        ContractHistoryDetailComponent,
        PremiseLocationMaintenanceComponent,
        CustomerInformationAccountMaintenanceComponent,
        TrialPeriodReleaseMaintenanceComponent,
        CustomerInformationMaintenanceComponent,
        ServiceCoverPriceChangeMaintenanceComponent,
        ServiceCoverDisplayMassValuesComponent,
        ServiceCoverLocationMaintenanceComponent,
        ServiceCoverCommenceDateMaintenanceComponent,
        ServiceCoverCommenceDateMaintenanceExComponent,
        ServiceCoverLocationMoveMaintenanceComponent,
        ProductMaintenanceComponent,
        CallCentreCreateFixedPriceJobComponent,
        ContactTypeDetailMaintenanceComponent,
        LostBusinessContactMaintenanceComponent,
        LostBusinessDetailMaintenanceComponent,
        ProductDetailMaintenanceComponent,
        AServiceCoverSuspendMaintenanceComponent,
        ValidLinkedProductsMaintenanceComponent,
        ProductServiceGroupMaintenanceComponent,
        CustomerTypeMaintenanceComponent,
        VisitAppointmentMaintenanceComponent,
        PremiseSuspendMaintenanceComponent
    ],

    entryComponents: [
        InvoiceHeaderAddressDetailsComponent,
        ServiceCoverEntryComponent,
        MBatchProcessMonitorMaintenanceComponent,
        InvoiceReprintMaintenanceComponent,
        InvoiceGroupPaymentMaintenanceComponent,
        AccountBankDetailsMaintenanceComponent,
        ServiceCoverSeasonMaintenanceComponent,
        ServiceCoverDetailMaintenanceComponent,
        CalendarTemplateMaintenanceComponent,
        SeasonalTemplateMaintenanceComponent,
        AccountOwnerMaintenanceComponent,
        PlanVisitMaintenanceComponent,
        ContractHistoryDetailComponent,
        PremiseLocationMaintenanceComponent,
        CustomerInformationAccountMaintenanceComponent,
        ServiceCoverDisplayMassValuesComponent,
        ServiceCoverLocationMaintenanceComponent,
        ServiceCoverCommenceDateMaintenanceComponent,
        ServiceCoverLocationMoveMaintenanceComponent,
        AServiceCoverSuspendMaintenanceComponent,
        VisitAppointmentMaintenanceComponent,
        PremiseSuspendMaintenanceComponent
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

export class InternalMaintenanceApplicationModule { }
