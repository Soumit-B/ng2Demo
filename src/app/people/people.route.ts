import { RouteAwayGuardService } from './../../shared/services/route-away-guard.service';
import { EmployeeMaintenanceComponent } from './TableMaintenanceBusiness/iCABSBEmployeeMaintenance';
import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PeopleRootComponent } from './people.component';
import { ChangeEmployeeNumberComponent } from './TableMaintenanceBusiness/iCABSAChangeEmployeeNumber';
import { UserAuthorityMaintenanceComponent } from './TableMaintenanceBusiness/iCABSBUserAuthorityMaintenance';
import { TestComponent } from './Authorisation/test';
import { PeopleModuleRoutes } from './../base/PageRoutes';
import { EmployeeExportGridComponent } from './Exports/EmployeeExportBranch/iCABSAREmployeeExportGrid.component';


const routes: Routes = [{
    path: '',
    component: PeopleRootComponent,
    children: [{
        path: 'test',
        component: TestComponent
    }, {
        path: 'tablemaintenance/changeemployeenumber',
        component: ChangeEmployeeNumberComponent
    }, {
        path: 'business/authoritymaintainance',
        component: UserAuthorityMaintenanceComponent,
        canDeactivate: [RouteAwayGuardService]
    }, {
        path: 'business/employeemaintenance',
        component: EmployeeMaintenanceComponent,
        canDeactivate: [RouteAwayGuardService]
    },{
        path: PeopleModuleRoutes.ICABSAREMPLOYEEEXPORTGRIDBUSINESS,
         component: EmployeeExportGridComponent
    },{
        path: PeopleModuleRoutes.ICABSAREMPLOYEEEXPORTGRIDREGION,
         component: EmployeeExportGridComponent
        },{
        path: PeopleModuleRoutes.ICABSAREMPLOYEEEXPORTGRIDBRANCH,
        component: EmployeeExportGridComponent
    }],
    data: {
        domain: 'PEOPLE'
    }
}];

export const PeopleRouteDefinitions: ModuleWithProviders = RouterModule.forChild(routes);
