import { ServiceCoverMaintenanceComponent } from './maintenance/ServicecoverMaintenance/iCABSAServiceCoverMaintenance.component';
import { ServiceCoverPropertiesComponent } from './maintenance/ServicecoverMaintenance/iCABSAServiceCoverMaintenance.properties';
import { RouterModule } from '@angular/router';
import { NgModule, Component, ViewContainerRef } from '@angular/core';
import { ComponentsHelper } from 'ng2-bootstrap/ng2-bootstrap';
import { HttpModule } from '@angular/http';
import { SharedModule } from '../../shared/shared.module';
import { InternalSearchModule } from './search.module';
import { ContractManagementModuleRoutes } from './../base/PageRoutes';
import { RouteAwayGuardService } from '../../shared/services/route-away-guard.service';
export var ServiceCoverMaintenanceRootComponent = (function () {
    function ServiceCoverMaintenanceRootComponent(viewContainerRef, componentsHelper) {
        componentsHelper.setRootViewContainerRef(viewContainerRef);
    }
    ServiceCoverMaintenanceRootComponent.decorators = [
        { type: Component, args: [{
                    template: "<router-outlet></router-outlet>"
                },] },
    ];
    ServiceCoverMaintenanceRootComponent.ctorParameters = [
        { type: ViewContainerRef, },
        { type: ComponentsHelper, },
    ];
    return ServiceCoverMaintenanceRootComponent;
}());
export var ServiceCoverMaintenanceModule = (function () {
    function ServiceCoverMaintenanceModule() {
    }
    ServiceCoverMaintenanceModule.decorators = [
        { type: NgModule, args: [{
                    imports: [
                        HttpModule,
                        SharedModule,
                        InternalSearchModule,
                        RouterModule.forChild([
                            {
                                path: '', component: ServiceCoverMaintenanceRootComponent, children: [
                                    { path: ContractManagementModuleRoutes.ICABSASERVICECOVERMAINTENANCE_SUB, component: ServiceCoverMaintenanceComponent, canDeactivate: [RouteAwayGuardService] }
                                ]
                            }
                        ])
                    ],
                    declarations: [
                        ServiceCoverMaintenanceRootComponent,
                        ServiceCoverMaintenanceComponent,
                        ServiceCoverPropertiesComponent
                    ],
                    entryComponents: []
                },] },
    ];
    ServiceCoverMaintenanceModule.ctorParameters = [];
    return ServiceCoverMaintenanceModule;
}());
