import { ServiceDocketDataEntryComponent } from './VisitMaintenance/iCABSSeServiceDocketDataEntry';
import { ServiceDeliveryModuleRoutes } from './../base/PageRoutes';
import { ServicePlanDeliveryNoteGridComponent } from './DeliveryPaperwork/iCABSSeServicePlanDeliveryNoteGrid.component';
import { RouterModule } from '@angular/router';
import { ServiceDeliveryRootComponent } from './service-delivery.component';
import { TechnicianWorkSummaryComponent } from './PDAReturns/TechWorkGrid/iCABSSeTechnicianWorkSummaryGrid.component';
import { TechnicianSyncSummaryGridComponent } from './PDAReturns/iCABSSeTechnicianSyncSummaryGrid.component';
import { ServicePlanDeliveryNoteProductComponent } from './DeliveryPaperwork/SingleServiceReceipt/iCABSSeServicePlanDeliveryNotebyProduct.component';
import { SePESVisitGridComponent } from './PDAReturns/iCABSSePESVisitGrid.component';
var routes = [
    {
        path: '', component: ServiceDeliveryRootComponent, children: [
            { path: 'pdareturns/techniciansyncsummary', component: TechnicianSyncSummaryGridComponent },
            { path: 'techWorkGridService/TechnicianWorkSummaryGrid', component: TechnicianWorkSummaryComponent },
            { path: 'techWorkGridService/TechnicianWorkSummaryGrid', component: TechnicianWorkSummaryComponent },
            { path: 'paperwork/servicelisting', component: ServicePlanDeliveryNoteGridComponent },
            { path: 'paperwork/singleServiceReceipt', component: ServicePlanDeliveryNoteProductComponent },
            { path: ServiceDeliveryModuleRoutes.ICABSSESERVICEDOCKETDATAENTRY, component: ServiceDocketDataEntryComponent },
            { path: ServiceDeliveryModuleRoutes.ICABSSEPESVISITGRID, component: SePESVisitGridComponent }
        ], data: { domain: 'SERVICE DELIVERY' }
    }
];
export var ServiceDeliveryRouteDefinitions = RouterModule.forChild(routes);
