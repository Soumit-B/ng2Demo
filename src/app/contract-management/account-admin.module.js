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
export var AccountAdminRootComponent = (function () {
    function AccountAdminRootComponent(viewContainerRef, componentsHelper) {
        componentsHelper.setRootViewContainerRef(viewContainerRef);
    }
    AccountAdminRootComponent.decorators = [
        { type: Component, args: [{
                    template: "<router-outlet></router-outlet>\n    "
                },] },
    ];
    AccountAdminRootComponent.ctorParameters = [
        { type: ViewContainerRef, },
        { type: ComponentsHelper, },
    ];
    return AccountAdminRootComponent;
}());
export var AccountAdminModule = (function () {
    function AccountAdminModule() {
    }
    AccountAdminModule.decorators = [
        { type: NgModule, args: [{
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
                },] },
    ];
    AccountAdminModule.ctorParameters = [];
    return AccountAdminModule;
}());
