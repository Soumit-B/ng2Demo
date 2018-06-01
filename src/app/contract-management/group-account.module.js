import { NgModule, Component, ViewContainerRef } from '@angular/core';
import { ComponentsHelper } from 'ng2-bootstrap/ng2-bootstrap';
import { ContractManagementModuleRoutes } from './../base/PageRoutes';
import { RouteAwayGuardService } from '../../shared/services/route-away-guard.service';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { InternalSearchModule } from '../internal/search.module';
import { GroupAccountMoveComponent } from './AccountAndGroupAccountManagement/iCABSSGroupAccountMove';
import { GroupAccountMaintenanceComponent } from './AccountAndGroupAccountManagement/iCABSSGroupAccountMaintenance';
export var GroupAccountRootComponent = (function () {
    function GroupAccountRootComponent(viewContainerRef, componentsHelper) {
        componentsHelper.setRootViewContainerRef(viewContainerRef);
    }
    GroupAccountRootComponent.decorators = [
        { type: Component, args: [{
                    template: "<router-outlet></router-outlet>\n    "
                },] },
    ];
    GroupAccountRootComponent.ctorParameters = [
        { type: ViewContainerRef, },
        { type: ComponentsHelper, },
    ];
    return GroupAccountRootComponent;
}());
export var GroupAccountModule = (function () {
    function GroupAccountModule() {
    }
    GroupAccountModule.decorators = [
        { type: NgModule, args: [{
                    imports: [
                        HttpModule,
                        InternalSearchModule,
                        SharedModule,
                        RouterModule.forChild([
                            {
                                path: '', component: GroupAccountRootComponent, children: [
                                    { path: ContractManagementModuleRoutes.ICABSSGROUPACCOUNTMOVE_SUB, component: GroupAccountMoveComponent },
                                    { path: ContractManagementModuleRoutes.ICABSSGROUPACCOUNTMAINTENANCE_SUB, component: GroupAccountMaintenanceComponent, canDeactivate: [RouteAwayGuardService] }
                                ], data: { domain: 'CONTRACT MANAGEMENT' }
                            }
                        ])
                    ],
                    declarations: [
                        GroupAccountRootComponent,
                        GroupAccountMoveComponent,
                        GroupAccountMaintenanceComponent
                    ],
                    exports: [
                        GroupAccountMoveComponent,
                        GroupAccountMaintenanceComponent
                    ]
                },] },
    ];
    GroupAccountModule.ctorParameters = [];
    return GroupAccountModule;
}());
