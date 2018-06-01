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
import { InactiveContractInfoMaintenanceComponent } from './ClientRetention/Contract-AmendTermination/iCABSAInactiveContractInfoMaintenance.component';

@Component({
    template: `<router-outlet></router-outlet>
    `
})

export class RetentionRootComponent {
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
                path: '', component: RetentionRootComponent, children: [
                    { path: ContractManagementModuleRoutes.ICABSASERVICECOVERSELECTMAINTENANCE_SUB, component: ServiceCoverSelectMaintenanceComponent },
                    { path: ContractManagementModuleRoutes.ICABSACONTRACTSELECTMAINTENANCE_SUB, component: ContractSelectMaintenanceComponent },
                    { path: ContractManagementModuleRoutes.ICABSAPREMISESELECTMAINTENANCE_SUB, component: PremiseSelectMaintenanceComponent },
                    { path: ContractManagementModuleRoutes.ICABSAINACTIVECONTRACTINFOMAINTENANCE_SUB, component: InactiveContractInfoMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: ContractManagementModuleRoutes.ICABSAINACTIVECONTRACTINFOMAINTENANCECANCEL_SUB, component: InactiveContractInfoMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: ContractManagementModuleRoutes.ICABSAINACTIVECONTRACTINFOMAINTENANREINSTATEL_SUB, component: InactiveContractInfoMaintenanceComponent, canDeactivate: [RouteAwayGuardService] }
            ], data: { domain: 'CONTRACT MANAGEMENT' }
            }

        ])
    ],
    declarations: [
        RetentionRootComponent,
        ServiceCoverSelectMaintenanceComponent,
        ContractSelectMaintenanceComponent,
        PremiseSelectMaintenanceComponent,
        InactiveContractInfoMaintenanceComponent
    ],
    exports: [
        ServiceCoverSelectMaintenanceComponent,
        ContractSelectMaintenanceComponent,
        PremiseSelectMaintenanceComponent,
        InactiveContractInfoMaintenanceComponent
    ],
    entryComponents: [
        ContractSelectMaintenanceComponent,
        ServiceCoverSelectMaintenanceComponent,
        PremiseSelectMaintenanceComponent,
        InactiveContractInfoMaintenanceComponent
    ]
})

export class RetentionModule { }
