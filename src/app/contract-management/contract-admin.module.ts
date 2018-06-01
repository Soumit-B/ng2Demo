import { NgModule, Component, ViewContainerRef } from '@angular/core';
import { ComponentsHelper } from 'ng2-bootstrap/ng2-bootstrap';
import { ContractManagementModuleRoutes } from './../base/PageRoutes';
import { RouteAwayGuardService } from '../../shared/services/route-away-guard.service';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { InternalSearchModule } from '../internal/search.module';
import { NegBranchMaintenanceComponent } from './ContractManagement/NegotiatingBranch/iCABSANegBranchMaintenance.component';
import { ContractAnniversaryChangeComponent } from './ContractManagement/iCABSAContractAnniversaryChange.component';
@Component({
    template: `<router-outlet></router-outlet>
    `
})

export class ContractAdminRootComponent {
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
                path: '', component: ContractAdminRootComponent, children: [
                    { path: ContractManagementModuleRoutes.ICABSANEGBRANCHMAINTENANCE_SUB, component: NegBranchMaintenanceComponent , canDeactivate: [RouteAwayGuardService] },
                    { path: ContractManagementModuleRoutes.ICABSACONTRACTANNIVERSARYCHANGE_SUB, component: ContractAnniversaryChangeComponent }
            ], data: { domain: 'CONTRACT MANAGEMENT' }
            }

        ])
    ],
    declarations: [
        ContractAdminRootComponent,
        ContractAnniversaryChangeComponent,
        NegBranchMaintenanceComponent
    ],
    exports: [
        ContractAnniversaryChangeComponent,
        NegBranchMaintenanceComponent
    ],
    entryComponents: [
        NegBranchMaintenanceComponent
    ]
})

export class ContractAdminModule { }
