import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { SharedModule } from '../../shared/shared.module';
import { InternalSearchModule } from '../internal/search.module';
import { PeopleRootComponent } from './people.component';
import { ChangeEmployeeNumberComponent } from './TableMaintenanceBusiness/iCABSAChangeEmployeeNumber';
import { EmployeeMaintenanceComponent } from './TableMaintenanceBusiness/iCABSBEmployeeMaintenance';
import { PeopleRouteDefinitions } from './people.route';
export var PeopleModule = (function () {
    function PeopleModule() {
    }
    PeopleModule.decorators = [
        { type: NgModule, args: [{
                    imports: [
                        HttpModule,
                        SharedModule,
                        InternalSearchModule,
                        PeopleRouteDefinitions
                    ],
                    declarations: [
                        PeopleRootComponent,
                        ChangeEmployeeNumberComponent,
                        EmployeeMaintenanceComponent
                    ]
                },] },
    ];
    PeopleModule.ctorParameters = [];
    return PeopleModule;
}());
