import { NgModule } from '@angular/core';

import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
/*import { InternalMaintenanceModule } from '../internal/maintenance.module';
import { InternalGridSearchModule } from '../internal/grid-search.module';*/
import { InternalSearchModule } from '../internal/search.module';

import { ExtranetsOrConnectRootComponent } from './extranets-or-connect.component';
import { ExtranetsOrConnectRouteDefinitions } from './extranets-or-connect.route';

@NgModule({
    imports: [
        HttpModule,
        SharedModule,
        InternalSearchModule,
        ExtranetsOrConnectRouteDefinitions
    ],
    declarations: [
        ExtranetsOrConnectRootComponent

    ]
})

export class ExtranetsOrConnectModule { }
