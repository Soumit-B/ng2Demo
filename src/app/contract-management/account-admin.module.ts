import { NgModule, Component, ViewContainerRef } from '@angular/core';
import { ComponentsHelper } from 'ng2-bootstrap/ng2-bootstrap';
import { ContractManagementModuleRoutes } from './../base/PageRoutes';
import { RouteAwayGuardService } from '../../shared/services/route-away-guard.service';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { InternalSearchModule } from '../internal/search.module';
import { AccountMergeComponent } from './AccountMerge/iCABSAAccountMerge.component';
import { AccountAssignComponent } from './AccountAssign/iCABSAAccountAssign.component';
import { AccountMoveComponent } from './AccountMove/iCABSAAccountMove.component';

@Component({
    template: `<router-outlet></router-outlet>
    `
})

export class AccountAdminRootComponent {
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
                path: '', component: AccountAdminRootComponent, children: [
                    { path: ContractManagementModuleRoutes.ICABSAACCOUNTASSIGN_SUB, component: AccountAssignComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: ContractManagementModuleRoutes.ICABSAACCOUNTASSIGN_SUB, component: AccountAssignComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: ContractManagementModuleRoutes.ICABSAACCOUNTMERGE_SUB, component: AccountMergeComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: ContractManagementModuleRoutes.ICABSAACCOUNTMERGE_SUB, component: AccountMergeComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: ContractManagementModuleRoutes.ICABSAACCOUNTMOVE_SUB, component: AccountMoveComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: ContractManagementModuleRoutes.ICABSAACCOUNTMOVE_SUB, component: AccountMoveComponent, canDeactivate: [RouteAwayGuardService] }
            ], data: { domain: 'CONTRACT MANAGEMENT' }
            }

        ])
    ],
    declarations: [
        AccountAdminRootComponent,
        AccountMergeComponent,
        AccountAssignComponent,
        AccountMoveComponent
    ]
})

export class AccountAdminModule { }
