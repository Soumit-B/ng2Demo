import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { SharedModule } from '../../shared/shared.module';
import { InternalSearchModule } from '../internal/search.module';
import { ProspectToContractRootComponent } from './prospect-to-contract.component';
import { ProspectConvGridComponent } from './ProspectAndDiaryMaintenance/iCABSCMProspectGrid';
import { ProspectMaintenanceComponent } from './ProspectAndDiaryMaintenance/iCABSCMPipelineProspectMaintenance';
import { MaintenanceTypeGeneralComponent } from './ProspectAndDiaryMaintenance/tabs/maintenanceTypeGeneral';
import { MaintenanceTypePremiseComponent } from './ProspectAndDiaryMaintenance/tabs/maintenanceTypePremise';
import { MaintenanceTypeAccountComponent } from './ProspectAndDiaryMaintenance/tabs/maintenanceTypeAccount';
import { PipelineGridComponent } from './SalesOrderProcessing/iCABSSPipelineGrid.component';
import { ProspectToContractRouteDefinitions } from './prospect-to-contract.route';
export var ProspectToContractModule = (function () {
    function ProspectToContractModule() {
    }
    ProspectToContractModule.decorators = [
        { type: NgModule, args: [{
                    imports: [
                        HttpModule,
                        SharedModule,
                        InternalSearchModule,
                        ProspectToContractRouteDefinitions
                    ],
                    declarations: [
                        ProspectToContractRootComponent,
                        ProspectConvGridComponent,
                        ProspectMaintenanceComponent,
                        MaintenanceTypeGeneralComponent,
                        MaintenanceTypePremiseComponent,
                        MaintenanceTypeAccountComponent,
                        PipelineGridComponent
                    ],
                    entryComponents: [
                        ProspectToContractRootComponent,
                        ProspectConvGridComponent,
                        ProspectMaintenanceComponent,
                        MaintenanceTypeGeneralComponent,
                        MaintenanceTypePremiseComponent,
                        MaintenanceTypeAccountComponent,
                        PipelineGridComponent
                    ]
                },] },
    ];
    ProspectToContractModule.ctorParameters = [];
    return ProspectToContractModule;
}());
