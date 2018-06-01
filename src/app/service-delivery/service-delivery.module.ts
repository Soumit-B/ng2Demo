import { ServiceDocketDataEntryComponent } from './VisitMaintenance/iCABSSeServiceDocketDataEntry';
import { ServicePlanDeliveryNoteGridComponent } from './DeliveryPaperwork/iCABSSeServicePlanDeliveryNoteGrid.component';
import { NgModule } from '@angular/core';

import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
/*import { InternalMaintenanceModule } from '../internal/maintenance.module';
import { InternalGridSearchModule } from '../internal/grid-search.module';*/
import { InternalSearchModule } from '../internal/search.module';

import { ServiceDeliveryRootComponent } from './service-delivery.component';
import { ServiceDeliveryRouteDefinitions } from './service-delivery.route';
import { TechnicianSyncSummaryGridComponent } from './PDAReturns/iCABSSeTechnicianSyncSummaryGrid.component';
import { TechnicianWorkSummaryComponent } from './PDAReturns/TechWorkGrid/iCABSSeTechnicianWorkSummaryGrid.component';
import { ServicePlanDeliveryNoteProductComponent } from './DeliveryPaperwork/SingleServiceReceipt/iCABSSeServicePlanDeliveryNotebyProduct.component';
import { InstallReceiptComponent } from './DeliveryPaperwork/iCABSSInstallReceipt.component';
import { WorkListConfirmComponent } from './DeliveryPaperwork/Work-list/iCABSWorkListConfirm.component';
import { SePESVisitGridComponent } from './PDAReturns/iCABSSePESVisitGrid.component';
import { ServiceCallTypeGridComponent } from './ReportsWorkload/ServiceCallTypeBranch/iCABSServiceCallTypeGrid.component';
import { ProductSalesDeliveriesDueGridComponent } from './ReportsPlanning/iCABSAProductSalesDeliveriesDueGrid.component';
import { ProductLanguageMaintenanceComponent } from './Translation/Product Language/iCABSBProductLanguageMaintenance.component';
import { ValidLinkedProductsGridComponent } from './TableMaintenanceProduct/ValidLinkedProducts/iCABSBValidLinkedProductsGrid.component';
import { DailyPrenotificationReportComponent } from './ProcessWasteConsignmentNote/DailyPrenotificationReport/iCABSARDailyPrenotificationReport.component';


@NgModule({
    imports: [
        HttpModule,
        SharedModule,
        InternalSearchModule,
        ServiceDeliveryRouteDefinitions
    ],
    declarations: [
        ServiceDeliveryRootComponent,
        TechnicianSyncSummaryGridComponent,
        TechnicianWorkSummaryComponent,
        ServicePlanDeliveryNoteGridComponent,
        ServicePlanDeliveryNoteProductComponent,
        WorkListConfirmComponent,
        ServiceDocketDataEntryComponent,
        ServiceCallTypeGridComponent,
        SePESVisitGridComponent,
        ProductSalesDeliveriesDueGridComponent,
        InstallReceiptComponent,
        ValidLinkedProductsGridComponent,
        DailyPrenotificationReportComponent,
        ProductLanguageMaintenanceComponent
    ]
})
export class ServiceDeliveryModule { }
