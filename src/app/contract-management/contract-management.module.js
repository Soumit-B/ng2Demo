import { NgModule, Component, ViewContainerRef } from '@angular/core';
import { ComponentsHelper } from 'ng2-bootstrap/ng2-bootstrap';
import { ContractManagementModuleRoutes } from './../base/PageRoutes';
import { RouteAwayGuardService } from '../../shared/services/route-away-guard.service';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { InternalSearchModule } from '../internal/search.module';
import { ContractMaintenanceComponent } from './ContractManagement/iCABSAContractMaintenance';
import { ContractInvoiceDetailGridComponent } from './ContractInvoiceDetailGrid/iCABSAContractInvoiceDetailGrid';
import { MaintenanceTypeAComponent } from './ContractManagement/contract-maintenance-tabs/maintenance-type-a';
import { MaintenanceTypeBComponent } from './ContractManagement/contract-maintenance-tabs/maintenance-type-b';
import { MaintenanceTypeCComponent } from './ContractManagement/contract-maintenance-tabs/maintenance-type-c';
import { MaintenanceTypeDComponent } from './ContractManagement/contract-maintenance-tabs/maintenance-type-d';
import { MaintenanceTypeEComponent } from './ContractManagement/contract-maintenance-tabs/maintenance-type-e';
export var ContractManagementRootComponent = (function () {
    function ContractManagementRootComponent(viewContainerRef, componentsHelper) {
        componentsHelper.setRootViewContainerRef(viewContainerRef);
    }
    ContractManagementRootComponent.decorators = [
        { type: Component, args: [{
                    template: "<router-outlet></router-outlet>\n    "
                },] },
    ];
    ContractManagementRootComponent.ctorParameters = [
        { type: ViewContainerRef, },
        { type: ComponentsHelper, },
    ];
    return ContractManagementRootComponent;
}());
export var ContractManagementModule = (function () {
    function ContractManagementModule() {
    }
    ContractManagementModule.decorators = [
        { type: NgModule, args: [{
                    imports: [
                        HttpModule,
                        InternalSearchModule,
                        SharedModule,
                        RouterModule.forChild([
                            {
                                path: '', component: ContractManagementRootComponent, children: [
                                    { path: ContractManagementModuleRoutes.ICABSACONTRACTINVOICEDETAILGRID_SUB, component: ContractInvoiceDetailGridComponent },
                                    { path: ContractManagementModuleRoutes.ICABSACONTRACTMAINTENANCE_SUB, component: ContractMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                                    { path: ContractManagementModuleRoutes.ICABSAJOBMAINTENANCE_SUB, component: ContractMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                                    { path: ContractManagementModuleRoutes.ICABSAPRODUCTSALEMAINTENANCE_SUB, component: ContractMaintenanceComponent, canDeactivate: [RouteAwayGuardService] }
                                ], data: { domain: 'CONTRACT MANAGEMENT' }
                            }
                        ])
                    ],
                    declarations: [
                        ContractManagementRootComponent,
                        ContractMaintenanceComponent,
                        MaintenanceTypeAComponent,
                        MaintenanceTypeBComponent,
                        MaintenanceTypeCComponent,
                        MaintenanceTypeDComponent,
                        MaintenanceTypeEComponent,
                        ContractInvoiceDetailGridComponent
                    ],
                    exports: [
                        MaintenanceTypeAComponent,
                        MaintenanceTypeBComponent,
                        MaintenanceTypeCComponent,
                        MaintenanceTypeDComponent,
                        MaintenanceTypeEComponent,
                        ContractInvoiceDetailGridComponent
                    ],
                    entryComponents: [
                        MaintenanceTypeAComponent,
                        MaintenanceTypeBComponent,
                        MaintenanceTypeCComponent,
                        MaintenanceTypeDComponent,
                        MaintenanceTypeEComponent
                    ]
                },] },
    ];
    ContractManagementModule.ctorParameters = [];
    return ContractManagementModule;
}());
