import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { SharedModule } from '../../shared/shared.module';
import { InternalSearchModule } from '../internal/search.module';
import { ServicePlanningRootComponent } from './service-planning.component';
import { ServicePlanningRouteDefinitions } from './service-planning.route';
import { AwaitingVerificationGridComponent } from './Workload/ServiceVerification/iCABSSeAwaitingVerificationGrid.component';
import { ServiceMoveGridComponent } from './Workload/BumpWorkload/iCABSSeServiceMoveGrid.component';
export var ServicePlanningModule = (function () {
    function ServicePlanningModule() {
    }
    ServicePlanningModule.decorators = [
        { type: NgModule, args: [{
                    imports: [
                        HttpModule,
                        SharedModule,
                        InternalSearchModule,
                        ServicePlanningRouteDefinitions
                    ],
                    declarations: [
                        ServicePlanningRootComponent,
                        AwaitingVerificationGridComponent,
                        ServiceMoveGridComponent
                    ]
                },] },
    ];
    ServicePlanningModule.ctorParameters = [];
    return ServicePlanningModule;
}());
