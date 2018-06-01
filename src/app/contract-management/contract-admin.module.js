import { NgModule, Component, ViewContainerRef } from '@angular/core';
import { ComponentsHelper } from 'ng2-bootstrap/ng2-bootstrap';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { InternalSearchModule } from '../internal/search.module';
export var ContractAdminRootComponent = (function () {
    function ContractAdminRootComponent(viewContainerRef, componentsHelper) {
        componentsHelper.setRootViewContainerRef(viewContainerRef);
    }
    ContractAdminRootComponent.decorators = [
        { type: Component, args: [{
                    template: "<router-outlet></router-outlet>\n    "
                },] },
    ];
    ContractAdminRootComponent.ctorParameters = [
        { type: ViewContainerRef, },
        { type: ComponentsHelper, },
    ];
    return ContractAdminRootComponent;
}());
export var ContractAdminModule = (function () {
    function ContractAdminModule() {
    }
    ContractAdminModule.decorators = [
        { type: NgModule, args: [{
                    imports: [
                        HttpModule,
                        InternalSearchModule,
                        SharedModule,
                        RouterModule.forChild([
                            {
                                path: '', component: ContractAdminRootComponent, children: [], data: { domain: 'CONTRACT MANAGEMENT' }
                            }
                        ])
                    ],
                    declarations: [
                        ContractAdminRootComponent
                    ]
                },] },
    ];
    ContractAdminModule.ctorParameters = [];
    return ContractAdminModule;
}());
