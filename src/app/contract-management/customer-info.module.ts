import { NgModule, Component, ViewContainerRef } from '@angular/core';
import { ComponentsHelper } from 'ng2-bootstrap/ng2-bootstrap';
import { ContractManagementModuleRoutes } from './../base/PageRoutes';
import { RouteAwayGuardService } from '../../shared/services/route-away-guard.service';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { InternalSearchModule } from '../internal/search.module';
import { DataChangeGridComponent } from './PDAReturns/CustomerDataUpdate/iCABSSeDataChangeGrid.component';

@Component({
    template: `<router-outlet></router-outlet>
    `
})

export class CustomerInfoRootComponent {
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
                path: '', component: CustomerInfoRootComponent, children: [
                    { path: ContractManagementModuleRoutes.ICABSSEDATACHANGEGRID_SUB, component: DataChangeGridComponent }

            ], data: { domain: 'CONTRACT MANAGEMENT' }
            }

        ])
    ],
    declarations: [
        CustomerInfoRootComponent,
        DataChangeGridComponent
    ],
    exports: [
        DataChangeGridComponent
    ],
    entryComponents: [
        DataChangeGridComponent
    ]
})

export class CustomerInfoModule { }
