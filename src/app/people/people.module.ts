import { NgModule } from '@angular/core';

import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
/*import { InternalMaintenanceModule } from '../internal/maintenance.module';
import { InternalGridSearchModule } from '../internal/grid-search.module';*/
import { InternalSearchModule } from '../internal/search.module';

import { PeopleRootComponent } from './people.component';
import { ChangeEmployeeNumberComponent } from './TableMaintenanceBusiness/iCABSAChangeEmployeeNumber';
import { EmployeeMaintenanceComponent } from './TableMaintenanceBusiness/iCABSBEmployeeMaintenance';
import { PeopleRouteDefinitions } from './people.route';
import { UserAuthorityMaintenanceComponent } from './TableMaintenanceBusiness/iCABSBUserAuthorityMaintenance';
import { TestComponent } from './Authorisation/test';
import { EmployeeExportGridComponent } from './Exports/EmployeeExportBranch/iCABSAREmployeeExportGrid.component';

@NgModule({
    imports: [
        HttpModule,
        SharedModule,
        InternalSearchModule,
        PeopleRouteDefinitions
    ],
    declarations: [
        PeopleRootComponent,
        ChangeEmployeeNumberComponent,
        EmployeeMaintenanceComponent,
        UserAuthorityMaintenanceComponent,
        TestComponent,
        EmployeeExportGridComponent
    ]
})

export class PeopleModule { }
