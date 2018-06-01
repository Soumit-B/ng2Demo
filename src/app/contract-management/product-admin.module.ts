import { NgModule, Component, ViewContainerRef } from '@angular/core';
import { ComponentsHelper } from 'ng2-bootstrap/ng2-bootstrap';
import { ContractManagementModuleRoutes } from './../base/PageRoutes';
import { RouteAwayGuardService } from '../../shared/services/route-away-guard.service';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { InternalSearchModule } from '../internal/search.module';

import { ProductCoverMaintenanceComponent } from './TableMaintenanceBusiness/ProductCover/iCABSBProductCoverMaintenance.component';
import { ProductExpenseMaintenanceComponent } from './TableMaintenanceBusiness/ProductExpense/iCABSBProductExpenseMaintenance.component';

@Component({
    template: `<router-outlet></router-outlet>
    `
})

export class ProductAdminRootComponent {
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
                path: '', component: ProductAdminRootComponent, children: [
                    { path: ContractManagementModuleRoutes.ICABSBPRODUCTCOVERMAINTENANCE_SUB, component: ProductCoverMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: ContractManagementModuleRoutes.ICABSBPRODUCTEXPENSEMAINTENANCE, component: ProductExpenseMaintenanceComponent, canDeactivate: [RouteAwayGuardService] }
                ],
                data: { domain: 'CONTRACT MANAGEMENT' }
            }

        ])
    ],
    declarations: [
        ProductAdminRootComponent,
        ProductCoverMaintenanceComponent,
        ProductExpenseMaintenanceComponent
    ],
    exports: [
        ProductCoverMaintenanceComponent,
        ProductExpenseMaintenanceComponent
    ],
    entryComponents: [
        ProductCoverMaintenanceComponent,
        ProductExpenseMaintenanceComponent
    ]
})

export class ProductAdminModule { }
