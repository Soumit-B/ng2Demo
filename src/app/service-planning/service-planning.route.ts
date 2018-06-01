import { RouteAwayGuardService } from './../../shared/services/route-away-guard.service';
import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ServicePlanningRootComponent } from './service-planning.component';
import { AwaitingVerificationGridComponent } from './Workload/ServiceVerification/iCABSSeAwaitingVerificationGrid.component';
import { ServiceMoveGridComponent } from './Workload/BumpWorkload/iCABSSeServiceMoveGrid.component';
import { ClosedServiceGridComponent } from './Templates/HolidayClosedTemplateUse/iCABSAClosedServiceGrid.component';
import { CalendarHistoryGridComponent } from './Templates/iCABSACalendarHistoryGrid.component';
import { ServicePlanningModuleRoutes } from './../base/PageRoutes';
import { CalendarServiceGridComponent } from './Templates/CalendarTemplateUse/iCABSACalendarServiceGrid.component';
import { ClosedTemplateMaintenanceComponent } from './Templates/HolidayClosedTemplateMaintenance/iCABSAClosedTemplateMaintenance.component';
import { SeServicePlanningGridHgComponent } from './PDA/iCABSSeServicePlanningGridHg.component';
import { ServiceCoverCalendarDatesMaintenanceGridComponent } from './CalendarAndSeasons/iCABSAServiceCoverCalendarDatesMaintenanceGrid';

const routes: Routes = [
    {
        path: '', component: ServicePlanningRootComponent, children: [
            { path: 'Service/verification', component: AwaitingVerificationGridComponent },
            { path: ServicePlanningModuleRoutes.ICABSSESERVICEMOVEGRID, component: ServiceMoveGridComponent },
            { path: ServicePlanningModuleRoutes.ICBSSACALENDERHISTORYGRID, component: CalendarHistoryGridComponent },
            { path: ServicePlanningModuleRoutes.ICABSACLOSEDSERVICEGRID, component: ClosedServiceGridComponent },
            { path: ServicePlanningModuleRoutes.ICABSACALENDARSERVICEGRID, component: CalendarServiceGridComponent },
            { path: ServicePlanningModuleRoutes.ICABSCLOSEDTEMPLATEMAINTENANCE, component: ClosedTemplateMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
            { path: ServicePlanningModuleRoutes.ICABSSESERVICEPLANNINGGRIDHG, component: SeServicePlanningGridHgComponent },
            { path: ServicePlanningModuleRoutes.ICABSASERVICECOVERCALENDARDATESMAINTENANCEGRID, component: ServiceCoverCalendarDatesMaintenanceGridComponent }
        ], data: { domain: 'SERVICE PLANNING' }
    }
];

export const ServicePlanningRouteDefinitions: ModuleWithProviders = RouterModule.forChild(routes);
