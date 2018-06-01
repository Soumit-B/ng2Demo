import { BatchProcessMonitorSearchComponent } from './TableMaintenanceSystem/iCABSMBatchProcessMonitorSearch';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { SharedModule } from '../../shared/shared.module';
import { InternalSearchModule } from '../internal/search.module';
import { ITFunctionsRootComponent } from './it-functions.component';
import { ITFunctionsRouteDefinitions } from './it-functions.route';
import { BatchProcessMonitorComponent } from './BatchProcesses/iCABSOBatchProcessMonitorSearch.component';
import { RiRegistryComponent } from './Registry/riRegistry.component';
import { BatchProgramMaintenanceComponent } from './TableMaintenanceSystem/MaintainBatchProgram/riMGBatchProgramMaintenance.component';
import { BusinessSystemCharacteristicsCustomMaintenanceComponent } from './TableMaintenanceSystem/iCABSSBusinessSystemCharacteristicsCustomMaintenance';
import { SystemParameterMaintenanceComponent } from './Maintenance/MaintainParameters/iCABSSSystemParameterMaintenance.component';
export var ITFunctionsModule = (function () {
    function ITFunctionsModule() {
    }
    ITFunctionsModule.decorators = [
        { type: NgModule, args: [{
                    imports: [
                        HttpModule,
                        SharedModule,
                        InternalSearchModule,
                        ITFunctionsRouteDefinitions
                    ],
                    declarations: [
                        ITFunctionsRootComponent,
                        BatchProcessMonitorComponent,
                        RiRegistryComponent,
                        BatchProcessMonitorSearchComponent,
                        BatchProgramMaintenanceComponent,
                        BusinessSystemCharacteristicsCustomMaintenanceComponent,
                        SystemParameterMaintenanceComponent
                    ]
                },] },
    ];
    ITFunctionsModule.ctorParameters = [];
    return ITFunctionsModule;
}());
