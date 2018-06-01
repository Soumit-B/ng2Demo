import { ServiceDocketDataEntryComponent } from './VisitMaintenance/iCABSSeServiceDocketDataEntry';
import { ServiceDeliveryModuleRoutes } from './../base/PageRoutes';
import { ServicePlanDeliveryNoteGridComponent } from './DeliveryPaperwork/iCABSSeServicePlanDeliveryNoteGrid.component';
import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ServiceDeliveryRootComponent } from './service-delivery.component';
import { TechnicianWorkSummaryComponent } from './PDAReturns/TechWorkGrid/iCABSSeTechnicianWorkSummaryGrid.component';
import { TechnicianSyncSummaryGridComponent } from './PDAReturns/iCABSSeTechnicianSyncSummaryGrid.component';
import { ServicePlanDeliveryNoteProductComponent } from './DeliveryPaperwork/SingleServiceReceipt/iCABSSeServicePlanDeliveryNotebyProduct.component';
import { InstallReceiptComponent } from './DeliveryPaperwork/iCABSSInstallReceipt.component';
import { WorkListConfirmComponent } from './DeliveryPaperwork/Work-list/iCABSWorkListConfirm.component';
import { SePESVisitGridComponent } from './PDAReturns/iCABSSePESVisitGrid.component';
import { ProductSalesDeliveriesDueGridComponent } from './ReportsPlanning/iCABSAProductSalesDeliveriesDueGrid.component';
import { ServiceCallTypeGridComponent } from './ReportsWorkload/ServiceCallTypeBranch/iCABSServiceCallTypeGrid.component';
import { ProductLanguageMaintenanceComponent } from './Translation/Product Language/iCABSBProductLanguageMaintenance.component';
import { ValidLinkedProductsGridComponent } from './TableMaintenanceProduct/ValidLinkedProducts/iCABSBValidLinkedProductsGrid.component';
import { RouteAwayGuardService } from './../../shared/services/route-away-guard.service';
import { DailyPrenotificationReportComponent } from './ProcessWasteConsignmentNote/DailyPrenotificationReport/iCABSARDailyPrenotificationReport.component';

const routes: Routes = [
    {
        path: '', component: ServiceDeliveryRootComponent, children: [
            { path: 'pdareturns/techniciansyncsummary', component: TechnicianSyncSummaryGridComponent },
            { path: 'techWorkGridService/TechnicianWorkSummaryGrid', component: TechnicianWorkSummaryComponent },
            { path: 'techWorkGridService/TechnicianWorkSummaryGrid', component: TechnicianWorkSummaryComponent },
            { path: 'paperwork/servicelisting', component: ServicePlanDeliveryNoteGridComponent },
            { path: 'paperwork/singleServiceReceipt', component: ServicePlanDeliveryNoteProductComponent },
            { path: ServiceDeliveryModuleRoutes.ICABSSERVICECALLTYPEGRIDBUSINESS, component: ServiceCallTypeGridComponent },
            { path: ServiceDeliveryModuleRoutes.ICABSSERVICECALLTYPEGRIDREGION, component: ServiceCallTypeGridComponent },
            { path: ServiceDeliveryModuleRoutes.ICABSSERVICECALLTYPEGRIDBRANCH, component: ServiceCallTypeGridComponent },
            { path: ServiceDeliveryModuleRoutes.ICABSSERVICECALLTYPEGRIDSERVICEAREA, component: ServiceCallTypeGridComponent },
            { path: ServiceDeliveryModuleRoutes.ICABSSESERVICEDOCKETDATAENTRY, component: ServiceDocketDataEntryComponent },
            { path: ServiceDeliveryModuleRoutes.ICABSSEPESVISITGRID, component: SePESVisitGridComponent },
            { path: 'service/worklist', component: WorkListConfirmComponent },
            { path: ServiceDeliveryModuleRoutes.ICABSAPRODUCTSALESDELIVERIESDUEGRID, component: ProductSalesDeliveriesDueGridComponent },
            { path: 'installReceipt', component: InstallReceiptComponent },
            { path: ServiceDeliveryModuleRoutes.ICABSBVALIDLINKEDPRODUCTSGRID, component: ValidLinkedProductsGridComponent },
            { path: ServiceDeliveryModuleRoutes.ICABSARDAILYPRENOTIFICATIONREPORT, component: DailyPrenotificationReportComponent },
            { path: ServiceDeliveryModuleRoutes.ICABSBPRODUCTLANGUAGEMAINTENANCE, component: ProductLanguageMaintenanceComponent, canDeactivate: [RouteAwayGuardService]  }
        ], data: { domain: 'SERVICE DELIVERY' }
    }
];

export const ServiceDeliveryRouteDefinitions: ModuleWithProviders = RouterModule.forChild(routes);

