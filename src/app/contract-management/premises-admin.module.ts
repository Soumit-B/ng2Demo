import { NgModule, Component, ViewContainerRef } from '@angular/core';
import { ComponentsHelper } from 'ng2-bootstrap/ng2-bootstrap';
import { ContractManagementModuleRoutes } from './../base/PageRoutes';
import { RouteAwayGuardService } from '../../shared/services/route-away-guard.service';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { InternalSearchModule } from '../internal/search.module';
import { MultiPremisePurchaseOrderAmendComponent } from './ContractPremisesManagement/iCABSAMultiPremisePurchaseOrderAmend.component';
import { PremiseContactChangeGridComponent } from './PDAReturns/iCABSSePremiseContactChangeGrid';
import { PostcodeMoveBranchComponent } from './ContractPremisesManagement/iCABSAPostcodeMoveBranch';
import { MultiPremiseSpecialComponent } from './ContractServiceCoverMaintenance/SpecialInstructions/iCABSAMultiPremiseSpecial.component';

@Component({
    template: `<router-outlet></router-outlet>
    `
})

export class PremisesAdminRootComponent {
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
                path: '', component: PremisesAdminRootComponent, children: [
                    { path: ContractManagementModuleRoutes.ICABSSEPREMISECONTACTCHANGEGRID_SUB, component: PremiseContactChangeGridComponent },
                    { path: ContractManagementModuleRoutes.ICABSAPOSTCODEMOVEBRANCH_SUB, component: PostcodeMoveBranchComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: ContractManagementModuleRoutes.ICABSAMULTIPREMISEPURCHASEORDERAMEND_SUB, component: MultiPremisePurchaseOrderAmendComponent },
                    { path: ContractManagementModuleRoutes.ICABSAMULTIPREMISESPECIAL_SUB, component: MultiPremiseSpecialComponent }

            ], data: { domain: 'CONTRACT MANAGEMENT' }
            }

        ])
    ],
    declarations: [
        PremisesAdminRootComponent,
        PremiseContactChangeGridComponent,
        PostcodeMoveBranchComponent,
        MultiPremisePurchaseOrderAmendComponent,
        MultiPremiseSpecialComponent
    ],
    exports: [
        MultiPremisePurchaseOrderAmendComponent,
        MultiPremiseSpecialComponent
    ],
    entryComponents: [
        MultiPremiseSpecialComponent
    ]
})

export class PremiseAdminModule { }
