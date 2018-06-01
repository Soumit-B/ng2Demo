import { RouterModule } from '@angular/router';
import { ProspectToContractRootComponent } from './prospect-to-contract.component';
import { ProspectConvGridComponent } from './ProspectAndDiaryMaintenance/iCABSCMProspectGrid';
import { ProspectMaintenanceComponent } from './ProspectAndDiaryMaintenance/iCABSCMPipelineProspectMaintenance';
import { PipelineGridComponent } from './SalesOrderProcessing/iCABSSPipelineGrid.component';
var routes = [
    {
        path: '', component: ProspectToContractRootComponent, children: [
            { path: 'prospectconvgrid', component: ProspectConvGridComponent },
            { path: 'maintenance/prospect', component: ProspectMaintenanceComponent },
            { path: 'SalesOrderProcessing/PipelineGrid', component: PipelineGridComponent }
        ], data: { domain: 'PROSPECT TO CONTRACT' }
    }
];
export var ProspectToContractRouteDefinitions = RouterModule.forChild(routes);
