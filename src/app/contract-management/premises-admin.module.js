import { NgModule, Component, ViewContainerRef } from '@angular/core';
import { ComponentsHelper } from 'ng2-bootstrap/ng2-bootstrap';
import { ContractManagementModuleRoutes } from './../base/PageRoutes';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { InternalSearchModule } from '../internal/search.module';
import { MultiPremisePurchaseOrderAmendComponent } from './ContractPremisesManagement/iCABSAMultiPremisePurchaseOrderAmend.component';
import { PremiseContactChangeGridComponent } from './PDAReturns/iCABSSePremiseContactChangeGrid';
import { PostcodeMoveBranchComponent } from './ContractPremisesManagement/iCABSAPostcodeMoveBranch';
export var PremisesAdminRootComponent = (function () {
    function PremisesAdminRootComponent(viewContainerRef, componentsHelper) {
        componentsHelper.setRootViewContainerRef(viewContainerRef);
    }
    PremisesAdminRootComponent.decorators = [
        { type: Component, args: [{
                    template: "<router-outlet></router-outlet>\n    "
                },] },
    ];
    PremisesAdminRootComponent.ctorParameters = [
        { type: ViewContainerRef, },
        { type: ComponentsHelper, },
    ];
    return PremisesAdminRootComponent;
}());
export var PremiseAdminModule = (function () {
    function PremiseAdminModule() {
    }
    PremiseAdminModule.decorators = [
        { type: NgModule, args: [{
                    imports: [
                        HttpModule,
                        InternalSearchModule,
                        SharedModule,
                        RouterModule.forChild([
                            {
                                path: '', component: PremisesAdminRootComponent, children: [
                                    { path: ContractManagementModuleRoutes.ICABSSEPREMISECONTACTCHANGEGRID_SUB, component: PremiseContactChangeGridComponent },
                                    { path: ContractManagementModuleRoutes.ICABSAPOSTCODEMOVEBRANCH_SUB, component: PostcodeMoveBranchComponent },
                                    { path: ContractManagementModuleRoutes.ICABSAMULTIPREMISEPURCHASEORDERAMEND_SUB, component: MultiPremisePurchaseOrderAmendComponent }
                                ], data: { domain: 'CONTRACT MANAGEMENT' }
                            }
                        ])
                    ],
                    declarations: [
                        PremisesAdminRootComponent,
                        PremiseContactChangeGridComponent,
                        PostcodeMoveBranchComponent,
                        MultiPremisePurchaseOrderAmendComponent
                    ],
                    exports: [
                        MultiPremisePurchaseOrderAmendComponent
                    ]
                },] },
    ];
    PremiseAdminModule.ctorParameters = [];
    return PremiseAdminModule;
}());
