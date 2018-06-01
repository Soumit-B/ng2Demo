import { NgModule, Component, ViewContainerRef } from '@angular/core';
import { ComponentsHelper } from 'ng2-bootstrap/ng2-bootstrap';
import { ContractManagementModuleRoutes } from './../base/PageRoutes';
import { RouteAwayGuardService } from '../../shared/services/route-away-guard.service';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { InternalSearchModule } from '../internal/search.module';
import { PremiseSelectMaintenanceComponent } from './ClientRetention/Premises/DeletePremises/iCABSAPremiseSelectMaintenance.component';
import { ServiceCoverSelectMaintenanceComponent } from './ClientRetention/iCABSAServiceCoverSelectMaintenance';
import { ContractSelectMaintenanceComponent } from './ClientRetention/iCABSAContractSelectMaintenance';
export var RetentionRootComponent = (function () {
    function RetentionRootComponent(viewContainerRef, componentsHelper) {
        componentsHelper.setRootViewContainerRef(viewContainerRef);
    }
    RetentionRootComponent.decorators = [
        { type: Component, args: [{
                    template: "<router-outlet></router-outlet>\n    "
                },] },
    ];
    RetentionRootComponent.ctorParameters = [
        { type: ViewContainerRef, },
        { type: ComponentsHelper, },
    ];
    return RetentionRootComponent;
}());
export var RetentionModule = (function () {
    function RetentionModule() {
    }
    RetentionModule.decorators = [
        { type: NgModule, args: [{
                    imports: [
                        HttpModule,
                        InternalSearchModule,
                        SharedModule,
                        RouterModule.forChild([
                            {
                                path: '', component: RetentionRootComponent, children: [
                                    { path: ContractManagementModuleRoutes.ICABSASERVICECOVERSELECTMAINTENANCE_SUB, component: ServiceCoverSelectMaintenanceComponent },
                                    { path: ContractManagementModuleRoutes.ICABSACONTRACTSELECTMAINTENANCE_SUB, component: ContractSelectMaintenanceComponent },
                                    { path: ContractManagementModuleRoutes.ICABSAPREMISESELECTMAINTENANCE_SUB, component: PremiseSelectMaintenanceComponent, canDeactivate: [RouteAwayGuardService] }
                                ], data: { domain: 'CONTRACT MANAGEMENT' }
                            }
                        ])
                    ],
                    declarations: [
                        RetentionRootComponent,
                        ServiceCoverSelectMaintenanceComponent,
                        ContractSelectMaintenanceComponent,
                        PremiseSelectMaintenanceComponent
                    ],
                    exports: [
                        ServiceCoverSelectMaintenanceComponent,
                        ContractSelectMaintenanceComponent,
                        PremiseSelectMaintenanceComponent
                    ],
                    entryComponents: [
                        ContractSelectMaintenanceComponent,
                        ServiceCoverSelectMaintenanceComponent,
                        PremiseSelectMaintenanceComponent
                    ]
                },] },
    ];
    RetentionModule.ctorParameters = [];
    return RetentionModule;
}());
