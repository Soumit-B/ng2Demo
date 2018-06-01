import { ServiceCoverMaintenanceComponent } from './maintenance/ServicecoverMaintenance/iCABSAServiceCoverMaintenance.component';
import { ServiceCoverPropertiesComponent } from './maintenance/ServicecoverMaintenance/iCABSAServiceCoverMaintenance.properties';
import { RouterModule } from '@angular/router';
import { NgModule, ModuleWithProviders, Component, ViewContainerRef, ViewChild } from '@angular/core';
import { ComponentsHelper } from 'ng2-bootstrap/ng2-bootstrap';
import { HttpModule } from '@angular/http';
import { SharedModule } from '../../shared/shared.module';
import { InternalSearchModule } from './search.module';
import { ContractManagementModuleRoutes } from './../base/PageRoutes';

import { RouteAwayGuardService } from '../../shared/services/route-away-guard.service';
import { RouteAwayGlobals } from '../../shared/services/route-away-global.service';

@Component({
    template: `<router-outlet></router-outlet>`
})

export class ServiceCoverMaintenanceRootComponent {
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
                path: '', component: ServiceCoverMaintenanceRootComponent, children: [
                    { path: ContractManagementModuleRoutes.ICABSASERVICECOVERMAINTENANCE_SUB, component: ServiceCoverMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: ContractManagementModuleRoutes.ICABSASERVICECOVERMAINTENANCECONTRACT_SUB, component: ServiceCoverMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: ContractManagementModuleRoutes.ICABSASERVICECOVERMAINTENANCEJOB_SUB, component: ServiceCoverMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: ContractManagementModuleRoutes.ICABSASERVICECOVERMAINTENANCEREDUCE_SUB, component: ServiceCoverMaintenanceComponent, canDeactivate: [RouteAwayGuardService] }
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
})

export class ServiceCoverMaintenanceModule { }

