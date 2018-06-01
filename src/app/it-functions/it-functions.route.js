import { BatchProcessMonitorSearchComponent } from './TableMaintenanceSystem/iCABSMBatchProcessMonitorSearch';
import { RouterModule } from '@angular/router';
import { ITFunctionsRootComponent } from './it-functions.component';
import { BatchProcessMonitorComponent } from './BatchProcesses/iCABSOBatchProcessMonitorSearch.component';
import { RiRegistryComponent } from './Registry/riRegistry.component';
import { BatchProgramMaintenanceComponent } from './TableMaintenanceSystem/MaintainBatchProgram/riMGBatchProgramMaintenance.component';
import { BusinessSystemCharacteristicsCustomMaintenanceComponent } from './TableMaintenanceSystem/iCABSSBusinessSystemCharacteristicsCustomMaintenance';
import { SystemParameterMaintenanceComponent } from './Maintenance/MaintainParameters/iCABSSSystemParameterMaintenance.component';
import { RouteAwayGuardService } from '../../shared/services/route-away-guard.service';
var routes = [
    {
        path: '', component: ITFunctionsRootComponent, children: [
            { path: 'batchprocess/monitor/search', component: BatchProcessMonitorComponent },
            { path: 'registry/:section', component: RiRegistryComponent },
            { path: 'registry', component: RiRegistryComponent },
            { path: 'batchprocess/monitor', component: BatchProcessMonitorSearchComponent },
            { path: 'batchprogram/maintenance', component: BatchProgramMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
            { path: 'batchprocess/syscharmonitor', component: BusinessSystemCharacteristicsCustomMaintenanceComponent },
            { path: 'maintenance/maintainParameters/system', component: SystemParameterMaintenanceComponent }
        ], data: { domain: 'IT FUNCTIONS' }
    }
];
export var ITFunctionsRouteDefinitions = RouterModule.forChild(routes);
