import { RouterModule } from '@angular/router';
import { ServicePlanningModuleRoutes } from '../base/PageRoutes';
import { ServicePlanningRootComponent } from './service-planning.component';
import { AwaitingVerificationGridComponent } from './Workload/ServiceVerification/iCABSSeAwaitingVerificationGrid.component';
import { ServiceMoveGridComponent } from './Workload/BumpWorkload/iCABSSeServiceMoveGrid.component';
var routes = [
    {
        path: '', component: ServicePlanningRootComponent, children: [
            { path: 'Service/verification', component: AwaitingVerificationGridComponent },
            { path: ServicePlanningModuleRoutes.ICABSSESERVICEMOVEGRID, component: ServiceMoveGridComponent }
        ], data: { domain: 'SERVICE PLANNING' }
    }
];
export var ServicePlanningRouteDefinitions = RouterModule.forChild(routes);
