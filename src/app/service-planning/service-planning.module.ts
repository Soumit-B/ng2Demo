import { NgModule } from '@angular/core';

import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
/*import { InternalMaintenanceModule } from '../internal/maintenance.module';
import { InternalGridSearchModule } from '../internal/grid-search.module';*/
import { InternalSearchModule } from '../internal/search.module';

import { ServicePlanningRootComponent } from './service-planning.component';
import { ServicePlanningRouteDefinitions } from './service-planning.route';
import { AwaitingVerificationGridComponent } from './Workload/ServiceVerification/iCABSSeAwaitingVerificationGrid.component';
import { ServiceMoveGridComponent } from './Workload/BumpWorkload/iCABSSeServiceMoveGrid.component';
import { ClosedServiceGridComponent } from './Templates/HolidayClosedTemplateUse/iCABSAClosedServiceGrid.component';
import { CalendarHistoryGridComponent } from './Templates/iCABSACalendarHistoryGrid.component';
import { CalendarServiceGridComponent } from './Templates/CalendarTemplateUse/iCABSACalendarServiceGrid.component';
import { ClosedTemplateMaintenanceComponent } from './Templates/HolidayClosedTemplateMaintenance/iCABSAClosedTemplateMaintenance.component';
import { SeServicePlanningGridHgComponent } from './PDA/iCABSSeServicePlanningGridHg.component';
import { ServiceCoverCalendarDatesMaintenanceGridComponent } from './CalendarAndSeasons/iCABSAServiceCoverCalendarDatesMaintenanceGrid';

@NgModule({
    imports: [
        HttpModule,
        SharedModule,
        InternalSearchModule,
        ServicePlanningRouteDefinitions
    ],
    declarations: [
        ServicePlanningRootComponent,
        AwaitingVerificationGridComponent,
        ServiceMoveGridComponent,
        ClosedServiceGridComponent,
        CalendarHistoryGridComponent,
        CalendarServiceGridComponent,
        ClosedTemplateMaintenanceComponent,
        SeServicePlanningGridHgComponent,
        ServiceCoverCalendarDatesMaintenanceGridComponent
    ]
})

export class ServicePlanningModule { }
