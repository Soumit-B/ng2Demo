import { ServiceDocketDataEntryComponent } from './VisitMaintenance/iCABSSeServiceDocketDataEntry';
import { ServicePlanDeliveryNoteGridComponent } from './DeliveryPaperwork/iCABSSeServicePlanDeliveryNoteGrid.component';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { SharedModule } from '../../shared/shared.module';
import { InternalSearchModule } from '../internal/search.module';
import { ServiceDeliveryRootComponent } from './service-delivery.component';
import { ServiceDeliveryRouteDefinitions } from './service-delivery.route';
import { TechnicianSyncSummaryGridComponent } from './PDAReturns/iCABSSeTechnicianSyncSummaryGrid.component';
import { TechnicianWorkSummaryComponent } from './PDAReturns/TechWorkGrid/iCABSSeTechnicianWorkSummaryGrid.component';
import { ServicePlanDeliveryNoteProductComponent } from './DeliveryPaperwork/SingleServiceReceipt/iCABSSeServicePlanDeliveryNotebyProduct.component';
import { SePESVisitGridComponent } from './PDAReturns/iCABSSePESVisitGrid.component';
export var ServiceDeliveryModule = (function () {
    function ServiceDeliveryModule() {
    }
    ServiceDeliveryModule.decorators = [
        { type: NgModule, args: [{
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
                        ServiceDocketDataEntryComponent,
                        SePESVisitGridComponent
                    ]
                },] },
    ];
    ServiceDeliveryModule.ctorParameters = [];
    return ServiceDeliveryModule;
}());
