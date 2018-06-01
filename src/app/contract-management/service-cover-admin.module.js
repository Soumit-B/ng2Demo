import { NgModule, Component, ViewContainerRef } from '@angular/core';
import { ComponentsHelper } from 'ng2-bootstrap/ng2-bootstrap';
import { ContractManagementModuleRoutes } from './../base/PageRoutes';
import { RouteAwayGuardService } from '../../shared/services/route-away-guard.service';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { SharedModule } from '../../shared/shared.module';
import { InternalSearchModule } from '../internal/search.module';
import { ServiceVisitDetailSummaryComponent } from './ServiceVisitDetailSummary/iCABSAServiceVisitDetailSummary';
import { ServiceCoverFrequencyMaintenanceComponent } from './JobManagement/iCABSAServiceCoverFrequencyMaintenance';
import { YTDMaintenanceComponent } from './ContractServiceCoverMaintenance/YTDMaintenance/iCABSAServiceCoverYTDMaintenance.component';
import { TrialPeriodReleaseGridComponent } from './ContractServiceCoverMaintenance/TrialService/iCABSAServiceCoverTrialPeriodReleaseGrid.component';
import { ProductCodeUpgradeComponent } from './ContractServiceCoverMaintenance/iCABSAProductCodeUpgrade';
import { ServiceCoverFirstVisitComponent } from './JobManagement/InvoiceOnFirstandLastVisit/iCABSAServiceCoverInvoiceOnFirstVisitMaintenance.component';
export var ServiceCoverAdminRootComponent = (function () {
    function ServiceCoverAdminRootComponent(viewContainerRef, componentsHelper) {
        componentsHelper.setRootViewContainerRef(viewContainerRef);
    }
    ServiceCoverAdminRootComponent.decorators = [
        { type: Component, args: [{
                    template: "<router-outlet></router-outlet>\n    "
                },] },
    ];
    ServiceCoverAdminRootComponent.ctorParameters = [
        { type: ViewContainerRef, },
        { type: ComponentsHelper, },
    ];
    return ServiceCoverAdminRootComponent;
}());
export var ServiceCoverAdminModule = (function () {
    function ServiceCoverAdminModule() {
    }
    ServiceCoverAdminModule.decorators = [
        { type: NgModule, args: [{
                    imports: [
                        HttpModule,
                        InternalSearchModule,
                        SharedModule,
                        RouterModule.forChild([
                            {
                                path: '', component: ServiceCoverAdminRootComponent, children: [
                                    { path: ContractManagementModuleRoutes.ICABSASERVICECOVERYTDMAINTENANCE_SUB, component: YTDMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                                    { path: ContractManagementModuleRoutes.ICABSASERVICECOVERTRIALPERIODRELEASEGRID_SUB, component: TrialPeriodReleaseGridComponent },
                                    { path: ContractManagementModuleRoutes.ICABSAPRODUCTCODEUPGRADE_SUB, component: ProductCodeUpgradeComponent, canDeactivate: [RouteAwayGuardService] },
                                    { path: ContractManagementModuleRoutes.ICABSASERVICECOVERINVOICEONFIRSTVISITMAINTENANCE_SUB, component: ServiceCoverFirstVisitComponent },
                                    { path: ContractManagementModuleRoutes.ICABSASERVICECOVERFREQUENCYMAINTENANCE_SUB, component: ServiceCoverFrequencyMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
                                    { path: ContractManagementModuleRoutes.ICABSASERVICEVISITDETAILSUMMARY_SUB, component: ServiceVisitDetailSummaryComponent }
                                ], data: { domain: 'CONTRACT MANAGEMENT' }
                            }
                        ])
                    ],
                    declarations: [
                        ServiceCoverAdminRootComponent,
                        YTDMaintenanceComponent,
                        TrialPeriodReleaseGridComponent,
                        ProductCodeUpgradeComponent,
                        ServiceCoverFirstVisitComponent,
                        ServiceVisitDetailSummaryComponent,
                        ServiceCoverFrequencyMaintenanceComponent
                    ],
                    exports: [
                        ServiceCoverFirstVisitComponent,
                        ServiceVisitDetailSummaryComponent,
                        ServiceCoverFrequencyMaintenanceComponent
                    ],
                    entryComponents: [
                        ServiceCoverFrequencyMaintenanceComponent
                    ]
                },] },
    ];
    ServiceCoverAdminModule.ctorParameters = [];
    return ServiceCoverAdminModule;
}());
