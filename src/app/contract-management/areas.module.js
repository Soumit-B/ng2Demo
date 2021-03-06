import { NgModule, Component, ViewContainerRef } from '@angular/core';
import { ComponentsHelper } from 'ng2-bootstrap/ng2-bootstrap';
import { ContractManagementModuleRoutes } from './../base/PageRoutes';
import { RouteAwayGuardService } from '../../shared/services/route-away-guard.service';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { InternalSearchModule } from '../internal/search.module';
import { PostcodeMaintenanceComponent } from './BranchGeography/PostalCode/iCABSBPostcodeMaintenance';
import { PostCodeGridComponent } from './BranchGeography/iCABSBPostcodesGrid';
export var AreasRootComponent = (function () {
    function AreasRootComponent(viewContainerRef, componentsHelper) {
        componentsHelper.setRootViewContainerRef(viewContainerRef);
    }
    AreasRootComponent.decorators = [
        { type: Component, args: [{
                    template: "<router-outlet></router-outlet>\n    "
                },] },
    ];
    AreasRootComponent.ctorParameters = [
        { type: ViewContainerRef, },
        { type: ComponentsHelper, },
    ];
    return AreasRootComponent;
}());
export var AreasModule = (function () {
    function AreasModule() {
    }
    AreasModule.decorators = [
        { type: NgModule, args: [{
                    imports: [
                        HttpModule,
                        InternalSearchModule,
                        SharedModule,
                        RouterModule.forChild([
                            {
                                path: '', component: AreasRootComponent, children: [
                                    { path: ContractManagementModuleRoutes.ICABSBPOSTCODEMAINTENANCE_SUB, component: PostcodeMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                                    { path: ContractManagementModuleRoutes.ICABSBPOSTCODESGRID_SUB, component: PostCodeGridComponent }
                                ], data: { domain: 'CONTRACT MANAGEMENT' }
                            }
                        ])
                    ],
                    declarations: [
                        AreasRootComponent,
                        PostcodeMaintenanceComponent,
                        PostCodeGridComponent
                    ]
                },] },
    ];
    AreasModule.ctorParameters = [];
    return AreasModule;
}());
