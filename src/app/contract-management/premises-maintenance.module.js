import { NgModule, Component, ViewContainerRef } from '@angular/core';
import { ComponentsHelper } from 'ng2-bootstrap/ng2-bootstrap';
import { ContractManagementModuleRoutes } from './../base/PageRoutes';
import { RouteAwayGuardService } from '../../shared/services/route-away-guard.service';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { InternalSearchModule } from '../internal/search.module';
import { PremiseMaintenanceComponent } from './ContractPremisesManagement/iCABSAPremiseMaintenance';
import { PremisePropertiesComponent } from './ContractPremisesManagement/iCABSAPremiseMaintenance.properties';
export var PremisesMaintenanceRootComponent = (function () {
    function PremisesMaintenanceRootComponent(viewContainerRef, componentsHelper) {
        componentsHelper.setRootViewContainerRef(viewContainerRef);
    }
    PremisesMaintenanceRootComponent.decorators = [
        { type: Component, args: [{
                    template: "<router-outlet></router-outlet>\n    "
                },] },
    ];
    PremisesMaintenanceRootComponent.ctorParameters = [
        { type: ViewContainerRef, },
        { type: ComponentsHelper, },
    ];
    return PremisesMaintenanceRootComponent;
}());
export var PremiseMaintenanceModule = (function () {
    function PremiseMaintenanceModule() {
    }
    PremiseMaintenanceModule.decorators = [
        { type: NgModule, args: [{
                    imports: [
                        HttpModule,
                        InternalSearchModule,
                        SharedModule,
                        RouterModule.forChild([
                            {
                                path: '', component: PremisesMaintenanceRootComponent, children: [
                                    { path: ContractManagementModuleRoutes.ICABSAPREMISEMAINTENANCE_SUB, component: PremiseMaintenanceComponent, canDeactivate: [RouteAwayGuardService] }
                                ], data: { domain: 'CONTRACT MANAGEMENT' }
                            }
                        ])
                    ],
                    declarations: [
                        PremisesMaintenanceRootComponent,
                        PremiseMaintenanceComponent,
                        PremisePropertiesComponent
                    ],
                    exports: [
                        PremiseMaintenanceComponent
                    ]
                },] },
    ];
    PremiseMaintenanceModule.ctorParameters = [];
    return PremiseMaintenanceModule;
}());
