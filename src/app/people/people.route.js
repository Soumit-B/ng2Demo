import { EmployeeMaintenanceComponent } from './TableMaintenanceBusiness/iCABSBEmployeeMaintenance';
import { RouterModule } from '@angular/router';
import { PeopleRootComponent } from './people.component';
import { ChangeEmployeeNumberComponent } from './TableMaintenanceBusiness/iCABSAChangeEmployeeNumber';
var routes = [
    {
        path: '', component: PeopleRootComponent, children: [
            { path: 'tablemaintenance/changeemployeenumber', component: ChangeEmployeeNumberComponent },
            { path: 'business/employeemaintenance', component: EmployeeMaintenanceComponent }
        ], data: { domain: 'PEOPLE' }
    }
];
export var PeopleRouteDefinitions = RouterModule.forChild(routes);
