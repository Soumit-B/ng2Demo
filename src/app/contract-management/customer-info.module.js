import { NgModule, Component, ViewContainerRef } from '@angular/core';
import { ComponentsHelper } from 'ng2-bootstrap/ng2-bootstrap';
import { ContractManagementModuleRoutes } from './../base/PageRoutes';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { InternalSearchModule } from '../internal/search.module';
import { DataChangeGridComponent } from './PDAReturns/CustomerDataUpdate/iCABSSeDataChangeGrid.component';
export var CustomerInfoRootComponent = (function () {
    function CustomerInfoRootComponent(viewContainerRef, componentsHelper) {
        componentsHelper.setRootViewContainerRef(viewContainerRef);
    }
    CustomerInfoRootComponent.decorators = [
        { type: Component, args: [{
                    template: "<router-outlet></router-outlet>\n    "
                },] },
    ];
    CustomerInfoRootComponent.ctorParameters = [
        { type: ViewContainerRef, },
        { type: ComponentsHelper, },
    ];
    return CustomerInfoRootComponent;
}());
export var CustomerInfoModule = (function () {
    function CustomerInfoModule() {
    }
    CustomerInfoModule.decorators = [
        { type: NgModule, args: [{
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
                },] },
    ];
    CustomerInfoModule.ctorParameters = [];
    return CustomerInfoModule;
}());
