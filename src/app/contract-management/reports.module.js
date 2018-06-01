import { NgModule, Component, ViewContainerRef } from '@angular/core';
import { ComponentsHelper } from 'ng2-bootstrap/ng2-bootstrap';
import { ContractManagementModuleRoutes } from './../base/PageRoutes';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { InternalSearchModule } from '../internal/search.module';
import { RenewalExtractGenerationComponent } from './LettersAndLabels/iCABSRenewalExtractGeneration.component';
import { SalesStatsAdjustmentGridComponent } from './SalesAdjustments/StatsAdjustmentGrid/iCABSSSalesStatsAdjustmentGrid.component';
export var ReportsRootComponent = (function () {
    function ReportsRootComponent(viewContainerRef, componentsHelper) {
        componentsHelper.setRootViewContainerRef(viewContainerRef);
    }
    ReportsRootComponent.decorators = [
        { type: Component, args: [{
                    template: "<router-outlet></router-outlet>\n    "
                },] },
    ];
    ReportsRootComponent.ctorParameters = [
        { type: ViewContainerRef, },
        { type: ComponentsHelper, },
    ];
    return ReportsRootComponent;
}());
export var ReportsModule = (function () {
    function ReportsModule() {
    }
    ReportsModule.decorators = [
        { type: NgModule, args: [{
                    imports: [
                        HttpModule,
                        InternalSearchModule,
                        SharedModule,
                        RouterModule.forChild([
                            {
                                path: '', component: ReportsRootComponent, children: [
                                    { path: ContractManagementModuleRoutes.ICABSRENEWALEXTRACTGENERATION_SUB, component: RenewalExtractGenerationComponent },
                                    { path: ContractManagementModuleRoutes.ICABSSSALESSTATSADJUSTMENTGRID_SUB, component: SalesStatsAdjustmentGridComponent }
                                ], data: { domain: 'CONTRACT MANAGEMENT' }
                            }
                        ])
                    ],
                    declarations: [
                        ReportsRootComponent,
                        RenewalExtractGenerationComponent,
                        SalesStatsAdjustmentGridComponent
                    ],
                    exports: [
                        SalesStatsAdjustmentGridComponent,
                        RenewalExtractGenerationComponent
                    ],
                    entryComponents: [
                        RenewalExtractGenerationComponent
                    ]
                },] },
    ];
    ReportsModule.ctorParameters = [];
    return ReportsModule;
}());
