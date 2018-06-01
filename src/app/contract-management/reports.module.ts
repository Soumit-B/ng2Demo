import { NgModule, Component, ViewContainerRef } from '@angular/core';
import { ComponentsHelper } from 'ng2-bootstrap/ng2-bootstrap';
import { ContractManagementModuleRoutes } from './../base/PageRoutes';
import { RouteAwayGuardService } from '../../shared/services/route-away-guard.service';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { InternalSearchModule } from '../internal/search.module';
import { RenewalExtractGenerationComponent } from './LettersAndLabels/iCABSRenewalExtractGeneration.component';
import { BranchContractReportComponent } from './ContractAndJobReports/ContractForBranch/iCABSARBranchContractReport.component';
import { SalesStatsAdjustmentGridComponent } from './SalesAdjustments/StatsAdjustmentGrid/iCABSSSalesStatsAdjustmentGrid.component';

@Component({
    template: `<router-outlet></router-outlet>
    `
})

export class ReportsRootComponent {
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
                path: '', component: ReportsRootComponent, children: [
                    { path: ContractManagementModuleRoutes.ICABSRENEWALEXTRACTGENERATION_SUB, component: RenewalExtractGenerationComponent },
                    { path: ContractManagementModuleRoutes.ICABSARBRANCHCONTRACTREPORT, component: BranchContractReportComponent },
                    { path: ContractManagementModuleRoutes.ICABSSSALESSTATSADJUSTMENTGRID_SUB, component: SalesStatsAdjustmentGridComponent }

            ], data: { domain: 'CONTRACT MANAGEMENT' }
            }

        ])
    ],
    declarations: [
        ReportsRootComponent,
        RenewalExtractGenerationComponent,
        BranchContractReportComponent,
        SalesStatsAdjustmentGridComponent
    ],
    exports: [
        SalesStatsAdjustmentGridComponent,
        BranchContractReportComponent,
        RenewalExtractGenerationComponent
    ],
    entryComponents: [
        BranchContractReportComponent,
        RenewalExtractGenerationComponent
    ]
})

export class ReportsModule { }
