import { NgModule, Component, ViewContainerRef } from '@angular/core';
import { ComponentsHelper } from 'ng2-bootstrap/ng2-bootstrap';
import { ContractManagementModuleRoutes } from './../base/PageRoutes';
import { RouteAwayGuardService } from '../../shared/services/route-away-guard.service';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { InternalSearchModule } from '../internal/search.module';
import { PremiseMaintenanceComponent } from './ContractPremisesManagement/iCABSAPremiseMaintenance';
import { PremiseServiceSuspendMaintenanceComponent } from './Premises/iCABSAPremiseServiceSuspendMaintenance.component';
import { PremisePropertiesComponent } from './ContractPremisesManagement/iCABSAPremiseMaintenance.properties';

@Component({
    template: `<router-outlet></router-outlet>
    `
})

export class PremisesMaintenanceRootComponent {
    constructor(viewContainerRef: ViewContainerRef, componentsHelper: ComponentsHelper) {
        componentsHelper.setRootViewContainerRef(viewContainerRef);
    }
}

@NgModule({
    imports: [
        HttpModule,
        InternalSearchModule,
        SharedModule,
        RouterModule.forChild([
            {
                path: '', component: PremisesMaintenanceRootComponent, children: [
                    { path: ContractManagementModuleRoutes.ICABSAPREMISEMAINTENANCE_SUB, component: PremiseMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: ContractManagementModuleRoutes.ICABSAPREMISESERVICESUSPENDMAINTENANCE, component: PremiseServiceSuspendMaintenanceComponent, canDeactivate: [RouteAwayGuardService] }
                ], data: { domain: 'CONTRACT MANAGEMENT' }
            }

        ])
    ],
    declarations: [
        PremisesMaintenanceRootComponent,
        PremiseMaintenanceComponent,
        PremiseServiceSuspendMaintenanceComponent,
        PremisePropertiesComponent
    ],
    exports: [
        PremiseMaintenanceComponent
    ]
})

export class PremiseMaintenanceModule { }
