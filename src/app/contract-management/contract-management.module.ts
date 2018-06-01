import { NgModule, Component, ViewContainerRef } from '@angular/core';
import { ComponentsHelper } from 'ng2-bootstrap/ng2-bootstrap';
import { ContractManagementModuleRoutes } from './../base/PageRoutes';
import { RouteAwayGuardService } from '../../shared/services/route-away-guard.service';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { InternalSearchModule } from '../internal/search.module';
import { MaintenanceTypeAComponent } from './ContractManagement/contract-maintenance-tabs/maintenance-type-a';
import { MaintenanceTypeBComponent } from './ContractManagement/contract-maintenance-tabs/maintenance-type-b';
import { MaintenanceTypeCComponent } from './ContractManagement/contract-maintenance-tabs/maintenance-type-c';
import { MaintenanceTypeDComponent } from './ContractManagement/contract-maintenance-tabs/maintenance-type-d';
import { MaintenanceTypeEComponent } from './ContractManagement/contract-maintenance-tabs/maintenance-type-e';

import { ContractMaintenanceComponent } from './ContractManagement/iCABSAContractMaintenance';
import { ContractInvoiceDetailGridComponent } from './ContractInvoiceDetailGrid/iCABSAContractInvoiceDetailGrid';
import { GeneralSearchGridComponent } from './generalSearch/iCABSCMGeneralSearchGrid';
@Component({
    template: `<router-outlet></router-outlet>
    `
})

export class ContractManagementRootComponent {
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
                path: '', component: ContractManagementRootComponent, children: [
                    { path: ContractManagementModuleRoutes.ICABSACONTRACTINVOICEDETAILGRID_SUB, component: ContractInvoiceDetailGridComponent },
                    { path: ContractManagementModuleRoutes.ICABSACONTRACTMAINTENANCE_SUB, component: ContractMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: ContractManagementModuleRoutes.ICABSAJOBMAINTENANCE_SUB, component: ContractMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: ContractManagementModuleRoutes.ICABSAPRODUCTSALEMAINTENANCE_SUB, component: ContractMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: ContractManagementModuleRoutes.ICABSCMGENERALSEARCHGRID_SUB, component: GeneralSearchGridComponent}
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
        ContractInvoiceDetailGridComponent,
        GeneralSearchGridComponent
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
})

export class ContractManagementModule { }
